import { Component, input, output } from '@angular/core';
import type { WorkflowNode } from '../../core/domain/workflow.models';
import {
  accentTokenForType,
  initialsFromLabel,
  isLogicNodeType,
} from '../../core/domain/node-visuals';
import { NODE_CARD_HEIGHT, NODE_CARD_WIDTH, type PortSide } from '../../core/domain/viewport.math';

@Component({
  selector: 'wb-workflow-node',
  standalone: true,
  template: `
    <article
      class="node-card"
      [class.selected]="selected()"
      [class.is-logic]="isLogic"
      [style.left.px]="node().position.x"
      [style.top.px]="node().position.y"
      [style.width.px]="width"
      [style.height.px]="height"
      [style.--accent]="accent"
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

      @if (isLogic) {
        <div class="logic-diamond" aria-hidden="true"></div>
      }

      <div class="accent" aria-hidden="true"></div>
      <div class="avatar" aria-hidden="true">{{ initials }}</div>
      <div class="body">
        <div class="label">{{ node().label }}</div>
        <div class="subtitle">{{ node().subtitle }}</div>
      </div>
      <span class="status" [attr.data-status]="node().status">{{ node().status }}</span>
    </article>
  `,
  styles: `
    .node-card {
      position: absolute;
      display: grid;
      grid-template-columns: 4px 40px 1fr auto;
      align-items: center;
      gap: 0.45rem;
      padding: 0.45rem 0.55rem 0.45rem 0;
      box-sizing: border-box;
      background: var(--wb-bg-elevated);
      border: 1px solid var(--wb-border);
      border-radius: 10px;
      box-shadow: var(--wb-shadow-soft);
      color: var(--wb-text);
      cursor: grab;
      user-select: none;
      touch-action: none;
      z-index: 2;
    }
    .node-card.is-logic {
      border-radius: 12px;
      border-width: 2px;
      border-color: color-mix(in srgb, var(--accent) 75%, var(--wb-border));
      background:
        linear-gradient(
          135deg,
          color-mix(in srgb, var(--accent) 22%, transparent) 0 18px,
          color-mix(in srgb, var(--accent) 8%, var(--wb-bg-elevated)) 18px
        );
      overflow: visible;
      box-shadow:
        var(--wb-shadow-soft),
        inset 0 0 0 1px color-mix(in srgb, var(--accent) 35%, transparent);
    }
    .logic-diamond {
      position: absolute;
      left: -9px;
      top: 50%;
      width: 18px;
      height: 18px;
      margin-top: -9px;
      background: var(--accent);
      transform: rotate(45deg);
      border-radius: 2px;
      box-shadow: var(--wb-shadow-soft);
      z-index: 1;
      pointer-events: none;
    }
    .node-card.is-logic .label {
      font-style: italic;
    }
    .handle {
      position: absolute;
      width: 14px;
      height: 14px;
      padding: 0;
      border-radius: 50%;
      background: var(--wb-bg-elevated);
      border: 2px solid var(--wb-edge);
      box-sizing: border-box;
      z-index: 3;
      cursor: crosshair;
    }
    .handle-left {
      left: -7px;
      top: 50%;
      margin-top: -7px;
    }
    .handle-right {
      right: -7px;
      top: 50%;
      margin-top: -7px;
    }
    .handle-top {
      top: -7px;
      left: 50%;
      margin-left: -7px;
    }
    .handle-bottom {
      bottom: -7px;
      left: 50%;
      margin-left: -7px;
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
    .node-card.selected .handle {
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
    .node-card.is-logic .accent {
      opacity: 0.35;
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

  readonly width = NODE_CARD_WIDTH;
  readonly height = NODE_CARD_HEIGHT;

  get accent(): string {
    return accentTokenForType(this.node().type);
  }

  get initials(): string {
    return initialsFromLabel(this.node().label);
  }

  get isLogic(): boolean {
    return isLogicNodeType(this.node().type);
  }

  onPointerDown(event: PointerEvent): void {
    this.pointerDown.emit({ event, nodeId: this.node().id });
  }

  onSourceHandle(event: PointerEvent, side: PortSide): void {
    event.stopPropagation();
    event.preventDefault();
    this.connectStart.emit({ event, nodeId: this.node().id, side });
  }
}
