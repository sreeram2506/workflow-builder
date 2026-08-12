import { Component, computed, input, output } from '@angular/core';
import {
  edgePathThroughWaypoints,
  edgeRenderPoints,
} from '../../core/domain/connection.math';
import type { WorkflowEdge, WorkflowNode } from '../../core/domain/workflow.models';
import {
  NODE_CARD_HEIGHT,
  NODE_CARD_WIDTH,
  portOnSide,
  smoothEdgePath,
  type Point,
  type PortSide,
  type Rect,
} from '../../core/domain/viewport.math';

const HANDLE_R = 5;
const WAYPOINT_R = 6;

export interface ConnectionDraftView {
  sourceNodeId: string;
  sourceSide: PortSide;
  pointerWorld: Point;
  valid: boolean;
}

@Component({
  selector: 'wb-graph-renderer',
  standalone: true,
  template: `
    <svg class="graph-svg" xmlns="http://www.w3.org/2000/svg" aria-hidden="false">
      @for (edge of edgeViews(); track edge.id) {
        <g class="edge-group" [class.selected]="edge.selected">
          <path
            class="edge"
            [attr.d]="edge.d"
            (pointerdown)="onEdgePointerDown($event, edge.id)"
            (dblclick)="onEdgeDblClick($event, edge.id)"
          />
          <circle class="port-dot" [attr.cx]="edge.x1" [attr.cy]="edge.y1" [attr.r]="handleR" />
          <circle class="port-dot" [attr.cx]="edge.x2" [attr.cy]="edge.y2" [attr.r]="handleR" />
          @for (wp of edge.waypoints; track $index) {
            <circle
              class="waypoint"
              [class.focused]="edge.selected && focusedWaypointIndex() === $index && focusedEdgeId() === edge.id"
              [attr.cx]="wp.x"
              [attr.cy]="wp.y"
              [attr.r]="waypointR"
              (pointerdown)="onWaypointPointerDown($event, edge.id, $index)"
            />
          }
        </g>
      }
      @if (draftPath(); as d) {
        <path
          class="draft"
          [class.invalid]="!draftValid()"
          [attr.d]="d"
        />
      }
      @if (marquee(); as m) {
        <rect
          class="marquee"
          [attr.x]="m.x"
          [attr.y]="m.y"
          [attr.width]="m.width"
          [attr.height]="m.height"
        />
      }
    </svg>
  `,
  styles: `
    :host {
      display: block;
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .graph-svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .edge {
      stroke: var(--wb-edge);
      stroke-width: 2.25;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      pointer-events: stroke;
      cursor: pointer;
    }
    .edge-group.selected .edge {
      stroke: var(--wb-selection);
      stroke-width: 3;
    }
    .port-dot {
      fill: var(--wb-bg-elevated);
      stroke: var(--wb-edge);
      stroke-width: 2;
      pointer-events: none;
    }
    .edge-group.selected .port-dot {
      stroke: var(--wb-selection);
    }
    .waypoint {
      fill: var(--wb-bg-elevated);
      stroke: var(--wb-accent);
      stroke-width: 2;
      pointer-events: all;
      cursor: grab;
    }
    .waypoint.focused {
      fill: var(--wb-accent);
      stroke: var(--wb-selection);
    }
    .draft {
      stroke: var(--wb-accent);
      stroke-width: 2;
      fill: none;
      stroke-dasharray: 6 4;
      pointer-events: none;
    }
    .draft.invalid {
      stroke: var(--wb-danger);
    }
    .marquee {
      fill: color-mix(in srgb, var(--wb-accent) 12%, transparent);
      stroke: var(--wb-accent);
      stroke-width: 1;
      stroke-dasharray: 4 3;
      pointer-events: none;
    }
  `,
})
export class GraphRendererComponent {
  readonly nodes = input.required<WorkflowNode[]>();
  readonly edges = input.required<WorkflowEdge[]>();
  readonly selectedEdgeIds = input<string[]>([]);
  readonly marquee = input<Rect | null>(null);
  readonly draft = input<ConnectionDraftView | null>(null);
  readonly focusedEdgeId = input<string | null>(null);
  readonly focusedWaypointIndex = input<number | null>(null);

  readonly edgeSelect = output<{ edgeId: string; shift: boolean; event: PointerEvent }>();
  readonly edgeDblClick = output<{ edgeId: string; worldHint: Point; event: MouseEvent }>();
  readonly waypointPointerDown = output<{
    edgeId: string;
    index: number;
    event: PointerEvent;
  }>();

  readonly handleR = HANDLE_R;
  readonly waypointR = WAYPOINT_R;

  readonly edgeViews = computed(() => {
    const nodeList = this.nodes();
    const selected = new Set(this.selectedEdgeIds());
    return this.edges()
      .map((e) => {
        const pts = edgeRenderPoints(e, nodeList);
        if (!pts) {
          return null;
        }
        return {
          id: e.id,
          x1: pts.start.x,
          y1: pts.start.y,
          x2: pts.end.x,
          y2: pts.end.y,
          waypoints: pts.waypoints,
          d: edgePathThroughWaypoints(pts.start, pts.end, pts.waypoints),
          selected: selected.has(e.id),
        };
      })
      .filter((v): v is NonNullable<typeof v> => v != null);
  });

  readonly draftValid = computed(() => this.draft()?.valid ?? false);

  readonly draftPath = computed(() => {
    const d = this.draft();
    if (!d) {
      return null;
    }
    const src = this.nodes().find((n) => n.id === d.sourceNodeId);
    if (!src) {
      return null;
    }
    const a = portOnSide(src.position, NODE_CARD_WIDTH, NODE_CARD_HEIGHT, d.sourceSide);
    return smoothEdgePath(a, d.pointerWorld);
  });

  onEdgePointerDown(event: PointerEvent, edgeId: string): void {
    event.stopPropagation();
    event.preventDefault();
    this.edgeSelect.emit({ edgeId, shift: event.shiftKey, event });
  }

  onEdgeDblClick(event: MouseEvent, edgeId: string): void {
    event.stopPropagation();
    event.preventDefault();
    this.edgeDblClick.emit({
      edgeId,
      worldHint: { x: 0, y: 0 },
      event,
    });
  }

  onWaypointPointerDown(event: PointerEvent, edgeId: string, index: number): void {
    event.stopPropagation();
    event.preventDefault();
    this.waypointPointerDown.emit({ edgeId, index, event });
  }
}
