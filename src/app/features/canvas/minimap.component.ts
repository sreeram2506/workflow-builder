import { Component, computed, inject, input } from '@angular/core';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { nodeSizeForType } from '../../core/domain/node-visuals';
import { type Rect } from '../../core/domain/viewport.math';

@Component({
  selector: 'wb-minimap',
  standalone: true,
  template: `
    <div
      class="minimap"
      #surface
      (pointerdown)="onPointerDown($event, surface)"
      (pointermove)="onPointerMove($event, surface)"
      (pointerup)="onPointerUp($event)"
      (pointercancel)="onPointerUp($event)"
      role="img"
      aria-label="Workflow minimap"
    >
      <svg [attr.viewBox]="viewBox()" preserveAspectRatio="xMidYMid meet">
        @for (n of facade.nodes(); track n.id) {
          <rect
            class="node"
            [attr.x]="n.position.x"
            [attr.y]="n.position.y"
            [attr.width]="sizeFor(n.type).width"
            [attr.height]="sizeFor(n.type).height"
          />
        }
        <rect
          class="viewport"
          [attr.x]="vpWorld().x"
          [attr.y]="vpWorld().y"
          [attr.width]="vpWorld().width"
          [attr.height]="vpWorld().height"
        />
      </svg>
    </div>
  `,
  styles: `
    .minimap {
      width: 180px;
      height: 120px;
      background: var(--wb-bg-elevated);
      border: 1px solid var(--wb-border);
      border-radius: 10px;
      box-shadow: var(--wb-shadow-soft);
      overflow: hidden;
      pointer-events: all;
      touch-action: none;
      cursor: grab;
    }
    svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .node {
      fill: color-mix(in srgb, var(--wb-accent) 35%, var(--wb-bg-panel));
      stroke: var(--wb-border);
      stroke-width: 2;
    }
    .viewport {
      fill: color-mix(in srgb, var(--wb-accent) 12%, transparent);
      stroke: var(--wb-accent);
      stroke-width: 4;
    }
  `,
})
export class MinimapComponent {
  readonly facade = inject(WorkflowFacade);
  readonly viewWidth = input(800);
  readonly viewHeight = input(600);

  private dragging = false;

  sizeFor(type: Parameters<typeof nodeSizeForType>[0]): { width: number; height: number } {
    return nodeSizeForType(type);
  }

  readonly contentBounds = computed((): Rect => {
    const nodes = this.facade.nodes();
    if (nodes.length === 0) {
      return { x: 0, y: 0, width: 800, height: 600 };
    }
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const n of nodes) {
      const size = nodeSizeForType(n.type);
      minX = Math.min(minX, n.position.x);
      minY = Math.min(minY, n.position.y);
      maxX = Math.max(maxX, n.position.x + size.width);
      maxY = Math.max(maxY, n.position.y + size.height);
    }
    const pad = 40;
    return {
      x: minX - pad,
      y: minY - pad,
      width: Math.max(200, maxX - minX + pad * 2),
      height: Math.max(150, maxY - minY + pad * 2),
    };
  });

  readonly viewBox = computed(() => {
    const b = this.contentBounds();
    return `${b.x} ${b.y} ${b.width} ${b.height}`;
  });

  readonly vpWorld = computed((): Rect => {
    const vp = this.facade.viewport();
    const w = this.viewWidth();
    const h = this.viewHeight();
    return {
      x: -vp.x / vp.scale,
      y: -vp.y / vp.scale,
      width: w / vp.scale,
      height: h / vp.scale,
    };
  });

  onPointerDown(event: PointerEvent, surface: HTMLElement): void {
    event.preventDefault();
    this.dragging = true;
    surface.setPointerCapture(event.pointerId);
    this.navigateFromEvent(event, surface);
  }

  onPointerMove(event: PointerEvent, surface: HTMLElement): void {
    if (!this.dragging) {
      return;
    }
    this.navigateFromEvent(event, surface);
  }

  onPointerUp(event: PointerEvent): void {
    this.dragging = false;
    try {
      (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
    } catch {
      /* ignore */
    }
  }

  private navigateFromEvent(event: PointerEvent, surface: HTMLElement): void {
    const rect = surface.getBoundingClientRect();
    const b = this.contentBounds();
    const relX = (event.clientX - rect.left) / rect.width;
    const relY = (event.clientY - rect.top) / rect.height;
    const worldX = b.x + relX * b.width;
    const worldY = b.y + relY * b.height;
    const vp = this.facade.viewport();
    const w = this.viewWidth();
    const h = this.viewHeight();
    this.facade.setViewport({
      scale: vp.scale,
      x: w / 2 - worldX * vp.scale,
      y: h / 2 - worldY * vp.scale,
    });
  }
}
