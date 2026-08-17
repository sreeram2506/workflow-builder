import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CanvasPerformanceScheduler } from '../../core/canvas/canvas-performance.scheduler';
import {
  findConnectionTargetAt,
  portOnSideForNode,
  resolveConnection,
  validateConnection,
} from '../../core/domain/connection.math';
import { nodeSizeForType } from '../../core/domain/node-visuals';
import {
  nodeBounds,
  normalizeRect,
  rectsIntersect,
  screenToWorld,
  viewportTransformCss,
  type Point,
  type PortSide,
  type Rect,
} from '../../core/domain/viewport.math';
import { injectEffectiveUi } from '../../core/ui-config';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { CANVAS_DROP_LIST_ID } from '../shell/palette-dnd.ids';
import {
  GraphRendererComponent,
  type ConnectionDraftView,
} from './graph-renderer.component';
import { MinimapComponent } from './minimap.component';
import { WorkflowNodeComponent } from './workflow-node.component';
import { ZoomControlsComponent } from './zoom-controls.component';

type Gesture =
  | 'idle'
  | 'pan'
  | 'marquee'
  | 'pendingNodeDrag'
  | 'nodeDrag'
  | 'connect'
  | 'waypointDrag';

/** Screen px before a node press becomes a drag (preserves dblclick). */
const NODE_DRAG_THRESHOLD_PX = 5;

@Component({
  selector: 'wb-canvas-viewport',
  standalone: true,
  imports: [
    GraphRendererComponent,
    WorkflowNodeComponent,
    MinimapComponent,
    ZoomControlsComponent,
  ],
  template: `
    <div
      class="viewport"
      #viewportEl
      tabindex="0"
      [attr.id]="canvasDropListId"
      [class.panning]="isPanning()"
      [class.space-armed]="spaceHeld()"
      [class.connecting]="!!connectionDraft()"
      (pointerdown)="onViewportPointerDown($event)"
      (pointermove)="onPointerMove($event)"
      (pointerup)="onPointerUp($event)"
      (pointercancel)="onPointerUp($event)"
      (wheel)="onWheel($event)"
      (contextmenu)="$event.preventDefault()"
    >
      <div
        class="grid"
        [style.background-size]="gridSizeCss()"
        [style.background-position]="gridPos()"
      ></div>
      <div class="world" [style.transform]="worldTransform()">
        <wb-graph-renderer
          [nodes]="facade.nodes()"
          [edges]="facade.edges()"
          [selectedEdgeIds]="facade.selection().edgeIds"
          [marquee]="marquee()"
          [draft]="connectionDraft()"
          [focusedEdgeId]="focusedEdgeId()"
          [focusedWaypointIndex]="focusedWaypointIndex()"
          (edgeSelect)="onEdgeSelect($event)"
          (edgeDblClick)="onEdgeDblClick($event)"
          (waypointPointerDown)="onWaypointPointerDown($event)"
        />
        @for (node of facade.nodes(); track node.id) {
          <wb-workflow-node
            [node]="node"
            [selected]="isSelected(node.id)"
            (pointerDown)="onNodePointerDown($event)"
            (connectStart)="onConnectStart($event)"
            (nodeDblClick)="onNodeDblClick($event)"
          />
        }
      </div>

      @if (ui.is('canvas.enabled')) {
        <div class="chrome-bar">
          <wb-zoom-controls
            [scale]="facade.viewport().scale"
            [viewMode]="facade.editorMode() === 'view'"
            [canUndo]="facade.canUndo()"
            [canRedo]="facade.canRedo()"
            (zoomIn)="onZoomIn()"
            (zoomOut)="onZoomOut()"
            (reset)="onZoomReset()"
            (applyLayout)="onApplyLayout($event)"
            (undo)="facade.undo()"
            (redo)="facade.redo()"
          />
        </div>
      }
      @if (ui.is('canvas.enabled') && ui.is('canvas.minimap')) {
        <div class="chrome-minimap">
          <wb-minimap [viewWidth]="viewSize().w" [viewHeight]="viewSize().h" />
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
    .viewport {
      position: relative;
      height: 100%;
      width: 100%;
      overflow: hidden;
      touch-action: none;
      outline: none;
      background: var(--wb-bg-canvas);
      cursor: default;
    }
    .viewport.space-armed {
      cursor: grab;
    }
    .viewport.panning {
      cursor: grabbing;
    }
    .viewport.connecting {
      cursor: crosshair;
    }
    .grid {
      position: absolute;
      inset: -50%;
      width: 200%;
      height: 200%;
      pointer-events: none;
      background-image: radial-gradient(circle, var(--wb-grid-dot) 1px, transparent 1px);
      background-repeat: repeat;
      opacity: 0.9;
    }
    .world {
      position: absolute;
      inset: 0;
      transform-origin: 0 0;
      will-change: transform;
    }
    .chrome-bar {
      position: absolute;
      left: 50%;
      bottom: 16px;
      transform: translateX(-50%);
      z-index: 4;
      pointer-events: none;
      max-width: calc(100% - 2rem);
    }
    .chrome-minimap {
      position: absolute;
      right: 16px;
      bottom: 16px;
      z-index: 4;
      pointer-events: none;
    }
  `,
})
export class CanvasViewportComponent implements AfterViewInit {
  readonly facade = inject(WorkflowFacade);
  readonly ui = injectEffectiveUi();
  private readonly scheduler = inject(CanvasPerformanceScheduler);
  private readonly viewportEl = viewChild.required<ElementRef<HTMLElement>>('viewportEl');

  readonly canvasDropListId = CANVAS_DROP_LIST_ID;

  readonly marquee = signal<Rect | null>(null);
  readonly viewSize = signal({ w: 800, h: 600 });
  readonly spaceHeld = signal(false);
  readonly isPanning = signal(false);
  readonly connectionDraft = signal<ConnectionDraftView | null>(null);
  readonly focusedEdgeId = signal<string | null>(null);
  readonly focusedWaypointIndex = signal<number | null>(null);

  gesture: Gesture = 'idle';
  private lastScreen: Point = { x: 0, y: 0 };
  private marqueeOriginWorld: Point | null = null;
  private dragNodeIds: string[] = [];
  private lastWorld: Point = { x: 0, y: 0 };
  private pendingPan = { x: 0, y: 0 };
  private pendingMove = { x: 0, y: 0 };
  private panDistance = 0;
  private connectSourceId: string | null = null;
  private connectSourceSide: PortSide | null = null;
  private pendingDraftPointer: Point | null = null;
  private waypointEdgeId: string | null = null;
  private waypointIndex = -1;
  private pendingWaypoint: Point | null = null;

  ngAfterViewInit(): void {
    this.refreshViewSize();
  }

  worldTransform(): string {
    return viewportTransformCss(this.facade.viewport());
  }

  gridSizeCss(): string {
    const gap = 16 * this.facade.viewport().scale;
    return `${gap}px ${gap}px`;
  }

  gridPos(): string {
    const vp = this.facade.viewport();
    return `${vp.x}px ${vp.y}px`;
  }

  isSelected(id: string): boolean {
    return this.facade.selection().nodeIds.includes(id);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Space' && !event.repeat) {
      event.preventDefault();
      this.spaceHeld.set(true);
      return;
    }
    if (event.key === 'Escape') {
      if (this.gesture === 'connect' || this.connectionDraft()) {
        event.preventDefault();
        this.cancelConnect();
        return;
      }
      this.clearWaypointFocus();
      return;
    }
    if (event.key === 'Delete' || event.key === 'Backspace') {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        return;
      }
      event.preventDefault();
      this.handleDelete();
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      this.spaceHeld.set(false);
    }
  }

  onConnectStart(payload: { event: PointerEvent; nodeId: string; side: PortSide }): void {
    try {
      this.refreshViewSize();
      this.clearWaypointFocus();
      this.connectSourceId = payload.nodeId;
      this.connectSourceSide = payload.side;
      this.gesture = 'connect';
      const world = screenToWorld(this.toLocalScreen(payload.event), this.facade.viewport());
      this.connectionDraft.set({
        sourceNodeId: payload.nodeId,
        sourceSide: payload.side,
        pointerWorld: world,
        valid: false,
      });
      this.viewportEl().nativeElement.setPointerCapture(payload.event.pointerId);
    } catch (err) {
      this.facade.setCanvasError(err instanceof Error ? err.message : 'Connect start error');
    }
  }

  onViewportPointerDown(event: PointerEvent): void {
    try {
      this.refreshViewSize();
      const target = event.target as HTMLElement;
      if (
        target.closest('wb-workflow-node') ||
        target.closest('.edge') ||
        target.closest('.waypoint') ||
        target.closest('.chrome-bar') ||
        target.closest('.chrome-minimap') ||
        target.closest('wb-zoom-controls') ||
        target.closest('wb-minimap')
      ) {
        return;
      }

      const screen = this.toLocalScreen(event);
      this.lastScreen = screen;

      const wantsMarquee = event.button === 0 && event.shiftKey && !this.spaceHeld();
      const wantsPan =
        event.button === 1 ||
        (event.button === 0 && this.spaceHeld()) ||
        (event.button === 0 && !event.shiftKey);

      if (wantsMarquee) {
        this.clearWaypointFocus();
        this.gesture = 'marquee';
        this.marqueeOriginWorld = screenToWorld(screen, this.facade.viewport());
        this.marquee.set(normalizeRect(this.marqueeOriginWorld, this.marqueeOriginWorld));
        this.viewportEl().nativeElement.setPointerCapture(event.pointerId);
        return;
      }

      if (wantsPan) {
        this.gesture = 'pan';
        this.isPanning.set(true);
        this.panDistance = 0;
        event.preventDefault();
        this.viewportEl().nativeElement.setPointerCapture(event.pointerId);
      }
    } catch (err) {
      this.facade.setCanvasError(err instanceof Error ? err.message : 'Canvas interaction error');
    }
  }

  onNodePointerDown(payload: { event: PointerEvent; nodeId: string }): void {
    try {
      const event = payload.event;
      event.stopPropagation();
      // Do not preventDefault — that suppresses dblclick and blocks Blank Agent open.
      this.refreshViewSize();
      this.clearWaypointFocus();

      if (event.shiftKey) {
        this.facade.toggleNodeSelection(payload.nodeId);
      } else if (!this.facade.selection().nodeIds.includes(payload.nodeId)) {
        this.facade.selectNodes([payload.nodeId]);
      } else {
        this.facade.focusNodeInSelection(payload.nodeId);
      }

      this.dragNodeIds = [...this.facade.selection().nodeIds];
      if (!this.dragNodeIds.includes(payload.nodeId)) {
        this.dragNodeIds = [payload.nodeId];
      }

      // Tabbed UX: selecting Blank Agent opens/focuses a header tab (does not navigate).
      if (!this.facade.editingAgentNodeId()) {
        const selected = this.facade.nodes().find((n) => n.id === payload.nodeId);
        if (selected?.type === 'AIAgent') {
          this.facade.openAgentTab(payload.nodeId);
        }
      }

      const screen = this.toLocalScreen(event);
      this.lastScreen = screen;
      this.lastWorld = screenToWorld(screen, this.facade.viewport());
      this.panDistance = 0;
      this.gesture = 'pendingNodeDrag';
      this.viewportEl().nativeElement.setPointerCapture(event.pointerId);
    } catch (err) {
      this.facade.setCanvasError(err instanceof Error ? err.message : 'Node drag error');
    }
  }

  onNodeDblClick(payload: { event: MouseEvent; nodeId: string }): void {
    try {
      // Nested agent canvas edits skills as nodes — do not re-enter agent from inside.
      if (this.facade.editingAgentNodeId()) {
        return;
      }
      const node = this.facade.nodes().find((n) => n.id === payload.nodeId);
      if (!node || node.type !== 'AIAgent') {
        return;
      }
      this.facade.selectAgentTab(payload.nodeId);
    } catch (err) {
      this.facade.setCanvasError(err instanceof Error ? err.message : 'Agent tab error');
    }
  }

  onEdgeSelect(payload: { edgeId: string; shift: boolean; event: PointerEvent }): void {
    try {
      this.clearWaypointFocus();
      this.facade.selectEdges([payload.edgeId], payload.shift);
      this.focusedEdgeId.set(payload.edgeId);
    } catch (err) {
      this.facade.setCanvasError(err instanceof Error ? err.message : 'Edge select error');
    }
  }

  onEdgeDblClick(payload: { edgeId: string; worldHint: Point; event: MouseEvent }): void {
    try {
      const world = screenToWorld(this.toLocalScreen(payload.event), this.facade.viewport());
      this.facade.selectEdges([payload.edgeId]);
      const idx = this.facade.addWaypoint(payload.edgeId, world);
      if (idx != null) {
        this.focusedEdgeId.set(payload.edgeId);
        this.focusedWaypointIndex.set(idx);
      }
    } catch (err) {
      this.facade.setCanvasError(err instanceof Error ? err.message : 'Waypoint add error');
    }
  }

  onWaypointPointerDown(payload: {
    edgeId: string;
    index: number;
    event: PointerEvent;
  }): void {
    try {
      this.facade.selectEdges([payload.edgeId]);
      this.focusedEdgeId.set(payload.edgeId);
      this.focusedWaypointIndex.set(payload.index);
      this.waypointEdgeId = payload.edgeId;
      this.waypointIndex = payload.index;
      this.gesture = 'waypointDrag';
      this.facade.beginHistoryGesture();
      this.lastWorld = screenToWorld(this.toLocalScreen(payload.event), this.facade.viewport());
      this.viewportEl().nativeElement.setPointerCapture(payload.event.pointerId);
    } catch (err) {
      this.facade.setCanvasError(err instanceof Error ? err.message : 'Waypoint drag error');
    }
  }

  onPointerMove(event: PointerEvent): void {
    if (this.gesture === 'idle') {
      return;
    }
    try {
      const screen = this.toLocalScreen(event);
      if (this.gesture === 'connect' && this.connectSourceId) {
        const world = screenToWorld(screen, this.facade.viewport());
        this.pendingDraftPointer = world;
        const sourceId = this.connectSourceId;
        const sourceSide = this.connectSourceSide;
        this.scheduler.schedule(() => {
          if (!this.pendingDraftPointer || !sourceId || !sourceSide) {
            return;
          }
          const ptr = this.pendingDraftPointer;
          this.pendingDraftPointer = null;
          const hover = findConnectionTargetAt(ptr, this.facade.nodes(), sourceId, sourceSide);
          const resolved =
            hover && resolveConnection(sourceId, sourceSide, hover.id, hover.side);
          const valid =
            !!resolved &&
            validateConnection(resolved.sourceId, resolved.targetId, this.facade.nodes()).ok;
          let pointerWorld = ptr;
          if (hover && valid) {
            const tgt = this.facade.nodes().find((n) => n.id === hover.id);
            if (tgt) {
              const size = nodeSizeForType(tgt.type);
              pointerWorld = portOnSideForNode(
                tgt.type,
                tgt.position,
                size.width,
                size.height,
                hover.side,
              );
            }
          }
          this.connectionDraft.set({
            sourceNodeId: sourceId,
            sourceSide,
            pointerWorld,
            valid,
          });
        });
        return;
      }
      if (this.gesture === 'pan') {
        const dx = screen.x - this.lastScreen.x;
        const dy = screen.y - this.lastScreen.y;
        this.lastScreen = screen;
        this.panDistance += Math.hypot(dx, dy);
        this.pendingPan.x += dx;
        this.pendingPan.y += dy;
        this.scheduler.schedule(() => {
          const px = this.pendingPan.x;
          const py = this.pendingPan.y;
          this.pendingPan = { x: 0, y: 0 };
          this.facade.panBy(px, py);
        });
        return;
      }
      if (this.gesture === 'marquee' && this.marqueeOriginWorld) {
        const world = screenToWorld(screen, this.facade.viewport());
        this.marquee.set(normalizeRect(this.marqueeOriginWorld, world));
        return;
      }
      if (this.gesture === 'pendingNodeDrag') {
        const dx = screen.x - this.lastScreen.x;
        const dy = screen.y - this.lastScreen.y;
        this.panDistance += Math.hypot(dx, dy);
        this.lastScreen = screen;
        if (this.panDistance < NODE_DRAG_THRESHOLD_PX) {
          return;
        }
        this.gesture = 'nodeDrag';
        this.facade.beginHistoryGesture();
        this.lastWorld = screenToWorld(screen, this.facade.viewport());
        return;
      }
      if (this.gesture === 'nodeDrag') {
        const world = screenToWorld(screen, this.facade.viewport());
        const dx = world.x - this.lastWorld.x;
        const dy = world.y - this.lastWorld.y;
        this.lastWorld = world;
        this.pendingMove.x += dx;
        this.pendingMove.y += dy;
        const ids = this.dragNodeIds;
        this.scheduler.schedule(() => {
          const mx = this.pendingMove.x;
          const my = this.pendingMove.y;
          this.pendingMove = { x: 0, y: 0 };
          this.facade.moveNodes(ids, { x: mx, y: my });
        });
        return;
      }
      if (this.gesture === 'waypointDrag' && this.waypointEdgeId != null) {
        const world = screenToWorld(screen, this.facade.viewport());
        this.pendingWaypoint = world;
        const edgeId = this.waypointEdgeId;
        const index = this.waypointIndex;
        this.scheduler.schedule(() => {
          if (!this.pendingWaypoint || edgeId == null || index < 0) {
            return;
          }
          const p = this.pendingWaypoint;
          this.pendingWaypoint = null;
          this.facade.moveWaypoint(edgeId, index, p);
        });
      }
    } catch (err) {
      this.facade.setCanvasError(err instanceof Error ? err.message : 'Pointer move error');
    }
  }

  onPointerUp(event: PointerEvent): void {
    try {
      if (this.gesture === 'connect' && this.connectSourceId && this.connectSourceSide) {
        const world = screenToWorld(this.toLocalScreen(event), this.facade.viewport());
        const target = findConnectionTargetAt(
          world,
          this.facade.nodes(),
          this.connectSourceId,
          this.connectSourceSide,
        );
        const resolved =
          target &&
          resolveConnection(
            this.connectSourceId,
            this.connectSourceSide,
            target.id,
            target.side,
          );
        if (
          resolved &&
          validateConnection(resolved.sourceId, resolved.targetId, this.facade.nodes()).ok
        ) {
          this.facade.createEdge(resolved.sourceId, resolved.targetId, {
            sourceSide: resolved.sourceSide,
            targetSide: resolved.targetSide,
          });
        }
        this.cancelConnect();
        return;
      }
      if (this.gesture === 'pan') {
        if (this.pendingPan.x !== 0 || this.pendingPan.y !== 0) {
          this.facade.panBy(this.pendingPan.x, this.pendingPan.y);
          this.pendingPan = { x: 0, y: 0 };
        }
        if (this.panDistance < 3 && event.button === 0 && !this.spaceHeld()) {
          this.facade.clearSelection();
          this.clearWaypointFocus();
        }
      } else if (this.gesture === 'marquee' && this.marquee()) {
        const box = this.marquee()!;
        const hits = this.facade
          .nodes()
          .filter((n) => {
            const size = nodeSizeForType(n.type);
            return rectsIntersect(box, nodeBounds(n.position, size.width, size.height));
          })
          .map((n) => n.id);
        const set = new Set(this.facade.selection().nodeIds);
        for (const id of hits) {
          set.add(id);
        }
        this.facade.setSelection({ nodeIds: [...set], edgeIds: [] });
        this.clearWaypointFocus();
      }
    } catch (err) {
      this.facade.setCanvasError(err instanceof Error ? err.message : 'Pointer up error');
    } finally {
      if (this.gesture === 'nodeDrag' || this.gesture === 'waypointDrag') {
        this.facade.endHistoryGesture();
      }
      if (this.gesture !== 'connect') {
        this.gesture = 'idle';
      }
      this.isPanning.set(false);
      this.marquee.set(null);
      this.marqueeOriginWorld = null;
      this.dragNodeIds = [];
      this.pendingPan = { x: 0, y: 0 };
      this.pendingMove = { x: 0, y: 0 };
      this.panDistance = 0;
      this.waypointEdgeId = null;
      this.waypointIndex = -1;
      this.pendingWaypoint = null;
      this.scheduler.cancel();
      if (this.gesture === 'idle') {
        try {
          this.viewportEl().nativeElement.releasePointerCapture(event.pointerId);
        } catch {
          /* ignore */
        }
      }
    }
  }

  onWheel(event: WheelEvent): void {
    try {
      event.preventDefault();
      const screen = this.toLocalScreen(event);
      const factor = Math.exp(-event.deltaY * 0.0015);
      this.facade.zoomAtScreen(screen, factor);
    } catch (err) {
      this.facade.setCanvasError(err instanceof Error ? err.message : 'Zoom error');
    }
  }

  onZoomIn(): void {
    this.refreshViewSize();
    const { w, h } = this.viewSize();
    this.facade.zoomByTowardCenter(1 + 0.1, w, h);
  }

  onZoomOut(): void {
    this.refreshViewSize();
    const { w, h } = this.viewSize();
    this.facade.zoomByTowardCenter(1 / 1.1, w, h);
  }

  onZoomReset(): void {
    this.refreshViewSize();
    const { w, h } = this.viewSize();
    this.facade.resetZoom(w, h);
  }

  onApplyLayout(mode: 'vertical' | 'horizontal' | 'layered'): void {
    this.refreshViewSize();
    const { w, h } = this.viewSize();
    this.facade.applyLayout(mode, w, h);
  }

  private handleDelete(): void {
    if (this.gesture === 'connect' || this.connectionDraft()) {
      return;
    }
    if (this.facade.editorMode() === 'view') {
      return;
    }
    const edgeId = this.focusedEdgeId();
    const wpIdx = this.focusedWaypointIndex();
    if (edgeId != null && wpIdx != null) {
      this.facade.removeWaypoint(edgeId, wpIdx);
      this.focusedWaypointIndex.set(null);
      return;
    }
    const nodeIds = this.facade.selection().nodeIds;
    if (nodeIds.length > 0) {
      this.facade.deleteNodes(nodeIds);
      this.clearWaypointFocus();
      return;
    }
    const edgeIds = this.facade.selection().edgeIds;
    if (edgeIds.length > 0) {
      this.facade.deleteEdges(edgeIds);
      this.clearWaypointFocus();
    }
  }

  private cancelConnect(): void {
    this.gesture = 'idle';
    this.connectSourceId = null;
    this.connectSourceSide = null;
    this.connectionDraft.set(null);
    this.pendingDraftPointer = null;
    try {
      /* capture may already be released */
    } catch {
      /* ignore */
    }
  }

  private clearWaypointFocus(): void {
    this.focusedEdgeId.set(null);
    this.focusedWaypointIndex.set(null);
  }

  private toLocalScreen(event: { clientX: number; clientY: number }): Point {
    const rect = this.viewportEl().nativeElement.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  private refreshViewSize(): void {
    const el = this.viewportEl().nativeElement;
    const size = { w: el.clientWidth || 800, h: el.clientHeight || 600 };
    this.viewSize.set(size);
    this.facade.setViewSize(size);
  }
}
