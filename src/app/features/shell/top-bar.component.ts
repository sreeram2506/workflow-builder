import { Component, HostListener, inject, signal, viewChild } from '@angular/core';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { ImportWorkflowDialogComponent } from './import-workflow-dialog.component';
import { ThemeToggleComponent } from '../theme/theme-toggle.component';

@Component({
  selector: 'wb-top-bar',
  standalone: true,
  imports: [ImportWorkflowDialogComponent, ThemeToggleComponent],
  template: `
    <header class="top-bar" role="banner">
      <div class="toolbar">
        <div class="logo" aria-label="Workflow Builder" title="Workflow Builder">
          <svg width="55" height="22" viewBox="0 0 55 22" fill="none" aria-hidden="true">
            <path
              d="M51.1847 0.0967331H46.6515C44.9018 0.0967331 43.4828 1.51569 43.4828 3.2654V8.16968C43.4828 9.18006 42.2631 9.68726 41.5466 8.97543L33.5415 1.01788C32.9477 0.427487 32.1447 0.0967331 31.3081 0.0967331H24.9104C23.1607 0.0967331 21.7417 1.51569 21.7417 3.2654V8.14016C21.7417 9.1492 20.5241 9.65707 19.8069 8.94726L11.797 1.01385C11.204 0.426145 10.4023 0.0967331 9.56766 0.0967331H3.16865C1.41895 0.0967331 0 1.51569 0 3.2654V9.65506C0 10.4957 0.334107 11.3014 0.92785 11.8959L9.94269 20.9108C10.5371 21.5052 11.3429 21.8386 12.1835 21.8386H18.5731C20.3228 21.8386 21.7417 20.4197 21.7417 18.67V13.765C21.7417 12.7553 22.9614 12.2474 23.678 12.9592L31.6865 20.9175C32.2802 21.5072 33.0833 21.8386 33.9199 21.8386H40.3148C42.0645 21.8386 43.4835 20.4197 43.4835 18.67V12.1032C43.4835 11.4759 43.992 10.9673 44.6193 10.9673H51.1861C52.9358 10.9673 54.3547 9.54838 54.3547 7.79867V3.2654C54.3547 1.51569 52.9358 0.0967331 51.1861 0.0967331H51.1847Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div class="nav-segment">
          <button
            type="button"
            class="icon-btn"
            (click)="facade.saveDownload()"
            title="Save (download JSON)"
            aria-label="Save"
          >
            <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
              <path
                d="M208,32H83.31A15.86,15.86,0,0,0,72,36.69L36.69,72A15.86,15.86,0,0,0,32,83.31V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM168,48v32H88V48Zm40,160H48V83.31L83.31,48H72v40a16,16,0,0,0,16,16h80a16,16,0,0,0,16-16V48h8ZM152,152a24,24,0,1,1-24-24A24,24,0,0,1,152,152Z"
              />
            </svg>
          </button>
          <button
            type="button"
            class="icon-btn text-btn"
            (click)="facade.exportDownload()"
            title="Export JSON"
            aria-label="Export JSON"
          >
            <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
              <path
                d="M224,152v56a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V152a8,8,0,0,1,16,0v56H208V152a8,8,0,0,1,16,0ZM88.69,104.69,120,73.37V176a8,8,0,0,0,16,0V73.37l31.31,31.32a8,8,0,0,0,11.32-11.32l-45-45a8,8,0,0,0-11.32,0l-45,45a8,8,0,0,0,11.32,11.32Z"
              />
            </svg>
            <span>Export</span>
          </button>
          <button
            type="button"
            class="icon-btn text-btn"
            [disabled]="facade.editorMode() === 'view'"
            (click)="importOpen.set(true)"
            title="Import JSON"
            aria-label="Import JSON"
          >
            <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
              <path
                d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L95.66,98.34a8,8,0,0,0-11.32,11.32Z"
              />
            </svg>
            <span>Import</span>
          </button>
          @if (facade.runActive()) {
            <button
              type="button"
              class="icon-btn"
              (click)="facade.stopRun()"
              title="Stop run"
              aria-label="Stop run"
            >
              <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                <path
                  d="M200,32H56A24,24,0,0,0,32,56V200a24,24,0,0,0,24,24H200a24,24,0,0,0,24-24V56A24,24,0,0,0,200,32Zm8,168a8,8,0,0,1-8,8H56a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H200a8,8,0,0,1,8,8Z"
                />
              </svg>
            </button>
          } @else {
            <button
              type="button"
              class="icon-btn"
              (click)="facade.startRun()"
              title="Run simulation"
              aria-label="Run simulation"
            >
              <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
                <path
                  d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"
                />
              </svg>
            </button>
          }
          <button
            type="button"
            class="icon-btn text-btn"
            (click)="facade.resetStatuses()"
            title="Reset node statuses"
            aria-label="Reset node statuses"
          >
            Reset
          </button>
        </div>
      </div>

      <div class="project-selection">
        <span class="folder-name">Drafts /</span>
        <span class="title">{{ facade.workflowName() }}</span>
        <span class="status" [attr.data-status]="facade.workflowStatus()">{{ facade.workflowStatus() }}</span>
        @if (facade.editorMode() === 'view') {
          <span class="view-badge" aria-label="View mode">View</span>
        }
      </div>

      <div class="controls">
        <wb-theme-toggle />

        <button
          type="button"
          class="icon-btn"
          (click)="facade.toggleEditorMode()"
          [attr.aria-pressed]="facade.editorMode() === 'view'"
          [attr.aria-label]="
            facade.editorMode() === 'view' ? 'Switch to edit mode' : 'Switch to view mode'
          "
          [title]="facade.editorMode() === 'view' ? 'Edit mode' : 'View mode'"
        >
          <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            @if (facade.editorMode() === 'view') {
              <path
                d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.23,125.75a8,8,0,0,0,0,4.5C12.66,140.23,55.92,224,128,224a127.11,127.11,0,0,0,52.31-10.87l21.77,23.92a8,8,0,1,0,11.84-10.76ZM101,113.37l16.11,17.72A20,20,0,0,1,101,113.37ZM128,208c-53.74,0-90.05-60.71-97.41-74.73A131.83,131.83,0,0,1,72.6,78.33l24.28,26.71A36,36,0,0,0,148.28,160l19.12,21A111,111,0,0,1,128,208Zm6.94-96.45c.29,0,.57,0,.87,0h0Zm103.83,18.7a8,8,0,0,1-10.47-4.23A131.7,131.7,0,0,0,152.7,64.58a8,8,0,0,1,4.6-15.33,147.78,147.78,0,0,1,84.94,61.74A8,8,0,0,1,238.77,130.25Z"
              />
            } @else {
              <path
                d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C222.24,144.74,177.52,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"
              />
            }
          </svg>
        </button>

        <button
          type="button"
          class="icon-btn"
          disabled
          title="Coming in later phase"
          aria-label="More actions (coming later)"
        >
          <svg width="18" height="18" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path
              d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM128,72a12,12,0,1,0-12-12A12,12,0,0,0,128,72Zm0,112a12,12,0,1,0,12,12A12,12,0,0,0,128,184Z"
            />
          </svg>
        </button>
      </div>

      <div class="sr-live" aria-live="polite" aria-atomic="true">{{ facade.runAnnouncement() }}</div>
    </header>

    @if (importOpen()) {
      <wb-import-workflow-dialog
        (cancel)="importOpen.set(false)"
        (confirm)="onImportConfirm($event)"
      />
    }
  `,
  styles: `
    .top-bar {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--wb-bg-elevated);
      border: 1px solid var(--wb-border);
      border-radius: 12px;
      box-shadow: var(--wb-shadow-soft);
      pointer-events: all;
      box-sizing: border-box;
    }

    .toolbar {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      min-width: 0;
      z-index: 1;
    }

    .logo {
      display: inline-flex;
      color: var(--wb-text);
      flex-shrink: 0;
    }

    .nav-segment {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      flex-wrap: wrap;
    }

    .project-selection {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 0.45rem;
      max-width: min(42vw, 420px);
    }

    .folder-name {
      color: var(--wb-text-muted);
      font-size: 0.85rem;
      white-space: nowrap;
    }

    .title {
      color: var(--wb-text);
      font-size: 0.9rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .status {
      text-transform: capitalize;
      font-size: 0.7rem;
      padding: 0.15rem 0.45rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--wb-status-draft) 22%, transparent);
      color: var(--wb-status-draft);
      border: 1px solid color-mix(in srgb, var(--wb-status-draft) 45%, transparent);
    }

    .view-badge {
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--wb-accent) 18%, transparent);
      color: var(--wb-accent);
      border: 1px solid color-mix(in srgb, var(--wb-accent) 40%, transparent);
    }

    .sr-live {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .controls {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.35rem;
      z-index: 1;
    }

    .icon-btn {
      min-width: 34px;
      height: 34px;
      display: grid;
      place-items: center;
      border: 1px solid var(--wb-border);
      border-radius: 8px;
      background: transparent;
      color: var(--wb-text);
      cursor: pointer;
      padding: 0 0.4rem;
      font-size: 0.75rem;
    }

    .icon-btn.text-btn {
      width: auto;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0 0.55rem;
    }

    .icon-btn:disabled {
      color: var(--wb-text-muted);
      background: color-mix(in srgb, var(--wb-btn-disabled) 55%, transparent);
      cursor: not-allowed;
      opacity: 0.75;
    }

    .icon-btn:not(:disabled):hover {
      background: color-mix(in srgb, var(--wb-accent) 12%, transparent);
      border-color: color-mix(in srgb, var(--wb-accent) 35%, var(--wb-border));
    }

    @media (max-width: 900px) {
      .project-selection {
        display: none;
      }
    }
  `,
})
export class TopBarComponent {
  readonly facade = inject(WorkflowFacade);
  readonly importOpen = signal(false);
  readonly importDialog = viewChild(ImportWorkflowDialogComponent);

  onImportConfirm(text: string): void {
    const err = this.facade.importJson(text);
    if (err) {
      this.importDialog()?.setInlineError(err);
      return;
    }
    this.importOpen.set(false);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const tag = target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable) {
      return;
    }
    const mod = event.metaKey || event.ctrlKey;
    if (!mod) {
      return;
    }
    const key = event.key.toLowerCase();
    if (key === 'z' && event.shiftKey) {
      event.preventDefault();
      this.facade.redo();
      return;
    }
    if (key === 'y') {
      event.preventDefault();
      this.facade.redo();
      return;
    }
    if (key === 'z') {
      event.preventDefault();
      this.facade.undo();
      return;
    }
    if (key === 'c') {
      event.preventDefault();
      this.facade.copySelection();
      return;
    }
    if (key === 'v') {
      event.preventDefault();
      this.facade.pasteClipboard();
      return;
    }
    if (key === 's') {
      event.preventDefault();
      this.facade.saveDownload();
    }
  }
}
