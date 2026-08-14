import { Component, computed, input, output } from '@angular/core';
import type { WorkflowNode } from '../../core/domain/workflow.models';
import {
  accentTokenForType,
  initialsFromLabel,
  isShapedNodeType,
  logicShapeKind,
  nodeSizeForType,
} from '../../core/domain/node-visuals';
import type { PortSide } from '../../core/domain/viewport.math';

@Component({
  selector: 'wb-workflow-node',
  standalone: true,
  template: `
    <article
      class="node-root"
      [class.node-card]="!isShaped()"
      [class.node-shape]="isShaped()"
      [class.selected]="selected()"
      [attr.data-shape]="shapeKind() ?? null"
      [attr.data-type]="node().type"
      [style.left.px]="node().position.x"
      [style.top.px]="node().position.y"
      [style.width.px]="size().width"
      [style.height.px]="size().height"
      [style.--accent]="accent()"
      (pointerdown)="onPointerDown($event)"
      role="button"
      [attr.aria-label]="node().label"
      [attr.aria-selected]="selected()"
      tabindex="0"
    >
      <button
        type="button"
        class="handle handle-left handle-input"
        aria-label="Input left"
        title="Input"
        (pointerdown)="onSourceHandle($event, 'left')"
      ></button>
      <button
        type="button"
        class="handle handle-right handle-output"
        aria-label="Output right"
        title="Output"
        (pointerdown)="onSourceHandle($event, 'right')"
      ></button>
      <button
        type="button"
        class="handle handle-top handle-input"
        aria-label="Input top"
        title="Input"
        (pointerdown)="onSourceHandle($event, 'top')"
      ></button>
      <button
        type="button"
        class="handle handle-bottom handle-input"
        aria-label="Input bottom"
        title="Input"
        (pointerdown)="onSourceHandle($event, 'bottom')"
      ></button>

      @if (shapeKind(); as kind) {
        <svg class="shape-svg" viewBox="0 0 100 100" aria-hidden="true">
          @switch (kind) {
            @case ('rhombus') {
              <!-- Card-theme diamond (theme colors) -->
              <polygon
                class="shape-fill"
                points="50,6 94,50 50,94 6,50"
                stroke-linejoin="round"
              />
              <!-- Three-way branch: longer stems, up / left / right -->
              <g
                class="shape-glyph"
                transform="translate(50 50)"
                fill="none"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M0 10 L0 -17" />
                <path d="M0 -17 l-3.6 4.2 M0 -17 l3.6 4.2" />
                <path d="M0 0 L-17 0" />
                <path d="M-17 0 l4.2 -3.2 M-17 0 l4.2 3.2" />
                <path d="M0 0 L17 0" />
                <path d="M17 0 l-4.2 -3.2 M17 0 l-4.2 3.2" />
              </g>
            }
            @case ('router') {
              <!--
                Horizontal pointed hexagon (Router): left/right tips for routing,
                distinct from Condition diamond + Repeater rounded square.
              -->
              <polygon
                class="shape-fill"
                points="18,8 82,8 96,50 82,92 18,92 4,50"
                stroke-linejoin="round"
              />
              <g
                class="shape-glyph"
                transform="translate(50 50) scale(1.05)"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <!-- Stem + Y-fork; tip chevrons aligned to each branch (±45°) -->
                <path d="M-13 0 H0" />
                <path d="M0 0 L12 -11" />
                <path d="M0 0 L12 11" />
                <path d="M12 -11 l-5.2 0.7 M12 -11 l-0.7 5.2" />
                <path d="M12 11 l-0.7 -5.2 M12 11 l-5.2 -0.7" />
              </g>
            }
            @case ('repeater') {
              <!-- Rounded square — flush to box so handles attach like Condition -->
              <rect class="shape-fill" x="4" y="4" width="92" height="92" rx="20" ry="20" />
              <!--
                Sync arrows: tip apex seated exactly on each arc end (Condition-style
                right/left chevrons). Top tip → right; bottom → left via 180° rotate.
              -->
              <g
                class="shape-glyph"
                transform="translate(50 50) scale(1.05)"
                fill="none"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M-11 7 A13 13 0 0 1 7.5 -10.6" stroke-linecap="butt" />
                <path d="M7.5 -10.6 l-4.2 -3.2 M7.5 -10.6 l-4.2 3.2" />
                <g transform="rotate(180)">
                  <path d="M-11 7 A13 13 0 0 1 7.5 -10.6" stroke-linecap="butt" />
                  <path d="M7.5 -10.6 l-4.2 -3.2 M7.5 -10.6 l-4.2 3.2" />
                </g>
              </g>
            }
          }
        </svg>
        <div class="shape-label">{{ node().label }}</div>
      } @else {
        <div class="accent" aria-hidden="true"></div>
        <div class="avatar" aria-hidden="true">{{ initials() }}</div>
        <div class="body">
          <div class="label">{{ node().label }}</div>
          <div class="subtitle">{{ node().subtitle }}</div>
        </div>
        <span class="status" [attr.data-status]="node().status">{{ node().status }}</span>
      }
    </article>
  `,
  styles: `
    .node-root {
      position: absolute;
      box-sizing: border-box;
      color: var(--wb-text);
      cursor: grab;
      user-select: none;
      touch-action: none;
      z-index: 2;
    }
    .node-card {
      display: grid;
      grid-template-columns: 4px 40px 1fr auto;
      align-items: center;
      gap: 0.45rem;
      padding: 0.45rem 0.55rem 0.45rem 0;
      background: var(--wb-bg-elevated);
      border: 1px solid var(--wb-border);
      border-radius: 10px;
      box-shadow: var(--wb-shadow-soft);
    }
    .node-shape {
      display: block;
      background: transparent !important;
      border: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      overflow: visible;
      padding: 0;
    }
    .shape-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      pointer-events: none;
      filter: drop-shadow(0 2px 10px color-mix(in srgb, var(--wb-text) 14%, transparent));
    }
    .shape-fill {
      fill: var(--wb-bg-elevated);
      stroke: var(--wb-border);
      stroke-width: 2;
    }
    .node-shape.selected .shape-fill {
      stroke: var(--wb-selection);
      stroke-width: 2.5;
    }
    .node-shape.selected .shape-svg {
      filter:
        drop-shadow(0 0 0 2px color-mix(in srgb, var(--wb-selection) 45%, transparent))
        drop-shadow(0 2px 10px color-mix(in srgb, var(--wb-text) 14%, transparent));
    }
    .shape-glyph {
      color: var(--accent);
    }
    .shape-label {
      position: absolute;
      left: 50%;
      top: calc(100% + 4px);
      transform: translateX(-50%);
      z-index: 1;
      max-width: 160%;
      padding: 0 0.2rem;
      text-align: center;
      font-size: 0.72rem;
      font-weight: 600;
      line-height: 1.2;
      white-space: nowrap;
      color: var(--wb-text);
      pointer-events: none;
    }
    .handle {
      position: absolute;
      width: 12px;
      height: 12px;
      padding: 0;
      border-radius: 50%;
      background: var(--wb-bg-elevated);
      border: 2px solid var(--wb-edge);
      box-sizing: border-box;
      z-index: 3;
      cursor: crosshair;
    }
    .node-shape .handle {
      width: 10px;
      height: 10px;
      border-width: 1.5px;
    }
    .handle-left {
      left: -6px;
      top: 50%;
      margin-top: -6px;
    }
    .handle-right {
      right: -6px;
      top: 50%;
      margin-top: -6px;
    }
    .handle-top {
      top: -6px;
      left: 50%;
      margin-left: -6px;
    }
    .handle-bottom {
      bottom: -6px;
      left: 50%;
      margin-left: -6px;
    }
    .node-shape .handle-left {
      left: -5px;
      margin-top: -5px;
    }
    .node-shape .handle-right {
      right: -5px;
      margin-top: -5px;
    }
    .node-shape .handle-top {
      top: -5px;
      margin-left: -5px;
    }
    .node-shape .handle-bottom {
      bottom: -5px;
      margin-left: -5px;
    }
    /* Condition diamond tips are inset ~6% — keep handles on the vertices */
    .node-shape[data-shape='rhombus'] .handle-left {
      left: calc(6% - 5px);
    }
    .node-shape[data-shape='rhombus'] .handle-right {
      right: calc(6% - 5px);
      left: auto;
    }
    .node-shape[data-shape='rhombus'] .handle-top {
      top: calc(6% - 5px);
    }
    .node-shape[data-shape='rhombus'] .handle-bottom {
      top: auto;
      bottom: calc(6% - 5px);
    }
    .handle-output {
      background: var(--wb-accent);
      border-color: color-mix(in srgb, var(--wb-accent) 70%, var(--wb-edge));
    }
    .handle-input {
      background: var(--wb-bg-elevated);
    }
    .handle:hover {
      border-color: var(--wb-accent);
      background: color-mix(in srgb, var(--wb-accent) 25%, var(--wb-bg-elevated));
      transform: scale(1.15);
    }
    .handle-output:hover {
      background: color-mix(in srgb, var(--wb-accent) 85%, white);
    }
    .handle:focus-visible {
      outline: 2px solid var(--wb-accent);
      outline-offset: 2px;
    }
    .node-root.selected .handle {
      border-color: var(--wb-selection);
    }
    .node-card.selected {
      border-color: var(--wb-selection);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--wb-selection) 45%, transparent);
    }
    .accent {
      width: 4px;
      height: 100%;
      border-radius: 10px 0 0 10px;
      background: var(--accent);
    }
    .avatar {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: var(--wb-icon-well);
      color: var(--accent);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.02em;
      line-height: 1;
    }
    .body {
      min-width: 0;
    }
    .label {
      font-size: 0.85rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .subtitle {
      font-size: 0.7rem;
      color: var(--wb-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .status {
      font-size: 0.65rem;
      text-transform: capitalize;
      padding: 0.15rem 0.4rem;
      border-radius: 999px;
      border: 1px solid var(--wb-border);
      color: var(--wb-text-muted);
    }
  `,
})
export class WorkflowNodeComponent {
  readonly node = input.required<WorkflowNode>();
  readonly selected = input(false);
  readonly pointerDown = output<{ event: PointerEvent; nodeId: string }>();
  readonly connectStart = output<{ event: PointerEvent; nodeId: string; side: PortSide }>();

  readonly size = computed(() => nodeSizeForType(this.node().type));
  readonly accent = computed(() => accentTokenForType(this.node().type));
  readonly initials = computed(() => initialsFromLabel(this.node().label));
  readonly isShaped = computed(() => isShapedNodeType(this.node().type));
  readonly shapeKind = computed(() => logicShapeKind(this.node().type));

  onPointerDown(event: PointerEvent): void {
    this.pointerDown.emit({ event, nodeId: this.node().id });
  }

  onSourceHandle(event: PointerEvent, side: PortSide): void {
    event.stopPropagation();
    event.preventDefault();
    this.connectStart.emit({ event, nodeId: this.node().id, side });
  }
}
