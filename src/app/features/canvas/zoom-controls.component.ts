import { DecimalPipe } from '@angular/common';
import { Component, inject, input, output, signal, viewChild } from '@angular/core';
import type { LayoutMode } from '../../core/domain/layout.math';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { ImportWorkflowDialogComponent } from '../shell/import-workflow-dialog.component';

@Component({
  selector: 'wb-zoom-controls',
  standalone: true,
  imports: [DecimalPipe, ImportWorkflowDialogComponent],
  template: `
    <div class="chrome-controls" role="group" aria-label="Canvas controls">
      <div class="workflow-actions" role="group" aria-label="Workflow actions">
        <button
          type="button"
          class="z-btn icon"
          (click)="facade.saveDownload()"
          title="Save"
          aria-label="Save"
        >
          <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path
              d="M208,32H83.31A15.86,15.86,0,0,0,72,36.69L36.69,72A15.86,15.86,0,0,0,32,83.31V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM168,48v32H88V48Zm40,160H48V83.31L83.31,48H72v40a16,16,0,0,0,16,16h80a16,16,0,0,0,16-16V48h8ZM152,152a24,24,0,1,1-24-24A24,24,0,0,1,152,152Z"
            />
          </svg>
        </button>
        <button
          type="button"
          class="z-btn text"
          (click)="facade.exportDownload()"
          title="Export JSON"
          aria-label="Export JSON"
        >
          <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path
              d="M224,152v56a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V152a8,8,0,0,1,16,0v56H208V152a8,8,0,0,1,16,0ZM88.69,104.69,120,73.37V176a8,8,0,0,0,16,0V73.37l31.31,31.32a8,8,0,0,0,11.32-11.32l-45-45a8,8,0,0,0-11.32,0l-45,45a8,8,0,0,0,11.32,11.32Z"
            />
          </svg>
          <span>Export</span>
        </button>
        <button
          type="button"
          class="z-btn text"
          [disabled]="viewMode()"
          (click)="importOpen.set(true)"
          title="Import JSON"
          aria-label="Import JSON"
        >
          <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path
              d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L95.66,98.34a8,8,0,0,0-11.32,11.32Z"
            />
          </svg>
          <span>Import</span>
        </button>
        @if (facade.runActive()) {
          <button
            type="button"
            class="z-btn icon"
            (click)="facade.stopRun()"
            title="Stop run"
            aria-label="Stop run"
          >
            <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
              <path
                d="M200,32H56A24,24,0,0,0,32,56V200a24,24,0,0,0,24,24H200a24,24,0,0,0,24-24V56A24,24,0,0,0,200,32Zm8,168a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H200a8,8,0,0,1,8,8Z"
              />
            </svg>
          </button>
        } @else {
          <button
            type="button"
            class="z-btn icon"
            (click)="facade.startRun()"
            title="Run simulation"
            aria-label="Run simulation"
          >
            <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
              <path
                d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"
              />
            </svg>
          </button>
        }
        <button
          type="button"
          class="z-btn text"
          (click)="facade.resetStatuses()"
          title="Reset node statuses"
          aria-label="Reset node statuses"
        >
          Reset
        </button>
      </div>

      <div class="history-group" role="group" aria-label="History">
        <button
          type="button"
          class="z-btn icon"
          [disabled]="!canUndo() || viewMode()"
          (click)="undo.emit()"
          aria-label="Undo"
          title="Undo"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M3 8h11a5 5 0 1 1 0 10H9" />
            <path d="M7 4 3 8l4 4" />
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
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M21 8H10a5 5 0 1 0 0 10h4" />
            <path d="M17 4l4 4-4 4" />
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

    @if (importOpen()) {
      <wb-import-workflow-dialog
        (cancel)="importOpen.set(false)"
        (confirm)="onImportConfirm($event)"
      />
    }
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
    .workflow-actions,
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
    .z-btn.text {
      width: auto;
      min-width: 0;
      padding: 0 0.55rem;
      gap: 0.3rem;
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
  readonly facade = inject(WorkflowFacade);
  readonly scale = input(1);
  readonly viewMode = input(false);
  readonly canUndo = input(false);
  readonly canRedo = input(false);
  readonly zoomIn = output<void>();
  readonly zoomOut = output<void>();
  readonly reset = output<void>();
  readonly applyLayout = output<LayoutMode>();
  readonly undo = output<void>();
  readonly redo = output<void>();

  readonly importOpen = signal(false);
  readonly importDialog = viewChild(ImportWorkflowDialogComponent);

  onLayoutChange(event: Event): void {
    const el = event.target as HTMLSelectElement;
    const value = el.value as LayoutMode | '';
    if (value === 'vertical' || value === 'horizontal' || value === 'layered') {
      this.applyLayout.emit(value);
    }
    el.value = '';
  }

  onImportConfirm(text: string): void {
    const err = this.facade.importJson(text);
    if (err) {
      this.importDialog()?.setInlineError(err);
      return;
    }
    this.importOpen.set(false);
  }
}
