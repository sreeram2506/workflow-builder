import { DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import type { LayoutMode } from '../../core/domain/layout.math';

@Component({
  selector: 'wb-zoom-controls',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div class="chrome-controls" role="group" aria-label="Canvas controls">
      <div class="history-group" role="group" aria-label="History">
        <button
          type="button"
          class="z-btn icon"
          [disabled]="!canUndo() || viewMode()"
          (click)="undo.emit()"
          aria-label="Undo"
          title="Undo"
        >
          <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path
              d="M224,128a96,96,0,0,1-94.71,96H128a8,8,0,0,1,0-16h1.21A80,80,0,1,0,66.34,66.34a8,8,0,0,1-11.31-11.32A96,96,0,0,1,224,128Zm-32.49-47.51a8,8,0,0,0-11.32,0L160,93.66V72a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8h40a8,8,0,0,0,0-16H171.31l20.2-20.19A8,8,0,0,0,191.51,80.49Z"
            />
          </svg>
        </button>
        <button
          type="button"
          class="z-btn icon"
          [disabled]="!canRedo() || viewMode()"
          (click)="redo.emit()"
          aria-label="Redo"
          title="Redo"
        >
          <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path
              d="M32,128a96,96,0,0,0,94.71,96H128a8,8,0,0,0,0-16h-1.21A80,80,0,1,1,189.66,66.34a8,8,0,0,0,11.31-11.32A96,96,0,0,0,32,128Zm32.49-47.51a8,8,0,0,1,11.32,0L96,93.66V72a8,8,0,0,1,16,0v40a8,8,0,0,1-8,8H64a8,8,0,0,1,0-16H84.69L64.49,83.81A8,8,0,0,1,64.49,80.49Z"
            />
          </svg>
        </button>
      </div>
      <div class="layout-group" role="group" aria-label="Layout">
        <label class="layout-label" for="wb-layout-select">Layout</label>
        <select
          id="wb-layout-select"
          class="layout-select"
          [disabled]="viewMode()"
          (change)="onLayoutChange($event)"
          aria-label="Apply layout"
          title="Apply layout"
        >
          <option value="" selected disabled>Layout ▾</option>
          <option value="vertical">Vertical</option>
          <option value="horizontal">Horizontal</option>
          <option value="layered">Layered</option>
        </select>
        <button
          type="button"
          class="z-btn"
          [disabled]="viewMode()"
          (click)="routeEdges.emit()"
          aria-label="Route edges"
          title="Route edges"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
            <path
              d="M2 3h4v2H4v4h2v2H2V3zm6 0h4v8H8v-2h2V5H8V3z"
              fill="currentColor"
            />
          </svg>
          Route
        </button>
      </div>
      <div class="zoom-controls" role="group" aria-label="Zoom controls">
        <button type="button" class="z-btn" (click)="zoomIn.emit()" aria-label="Zoom in" title="Zoom in">
          +
        </button>
        <button type="button" class="z-btn" (click)="zoomOut.emit()" aria-label="Zoom out" title="Zoom out">
          −
        </button>
        <button type="button" class="z-btn" (click)="reset.emit()" aria-label="Reset zoom" title="Reset zoom">
          100%
        </button>
        <span class="scale" aria-live="polite">{{ (scale() * 100) | number: '1.0-0' }}%</span>
      </div>
    </div>
  `,
  styles: `
    .chrome-controls {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem;
      background: var(--wb-bg-elevated);
      border: 1px solid var(--wb-border);
      border-radius: 10px;
      box-shadow: var(--wb-shadow-soft);
      pointer-events: all;
    }
    .history-group,
    .layout-group,
    .zoom-controls {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
    .layout-label {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
    }
    .layout-select {
      height: 32px;
      border: 1px solid var(--wb-border);
      border-radius: 8px;
      background: transparent;
      color: var(--wb-text);
      font-size: 0.8rem;
      padding: 0 0.4rem;
      cursor: pointer;
    }
    .layout-select:disabled,
    .z-btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .z-btn {
      min-width: 34px;
      height: 32px;
      border: 1px solid var(--wb-border);
      border-radius: 8px;
      background: transparent;
      color: var(--wb-text);
      cursor: pointer;
      font-size: 0.8rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      padding: 0 0.45rem;
    }
    .z-btn.icon {
      padding: 0;
    }
    .z-btn:hover:not(:disabled) {
      background: color-mix(in srgb, var(--wb-accent) 12%, transparent);
    }
    .scale {
      font-size: 0.75rem;
      color: var(--wb-text-muted);
      min-width: 2.5rem;
      text-align: right;
      padding-right: 0.25rem;
    }
  `,
})
export class ZoomControlsComponent {
  readonly scale = input(1);
  readonly viewMode = input(false);
  readonly canUndo = input(false);
  readonly canRedo = input(false);
  readonly zoomIn = output<void>();
  readonly zoomOut = output<void>();
  readonly reset = output<void>();
  readonly applyLayout = output<LayoutMode>();
  readonly routeEdges = output<void>();
  readonly undo = output<void>();
  readonly redo = output<void>();

  onLayoutChange(event: Event): void {
    const el = event.target as HTMLSelectElement;
    const value = el.value as LayoutMode | '';
    if (value === 'vertical' || value === 'horizontal' || value === 'layered') {
      this.applyLayout.emit(value);
    }
    el.value = '';
  }
}
