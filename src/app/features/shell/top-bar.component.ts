import { Component, inject } from '@angular/core';
import { injectEffectiveUi } from '../../core/ui-config';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { ThemeToggleComponent } from '../theme/theme-toggle.component';

@Component({
  selector: 'wb-top-bar',
  standalone: true,
  imports: [ThemeToggleComponent],
  template: `
    <header class="top-bar" role="banner">
      <div class="top-bar-row">
      <div class="toolbar">
        @if (ui.is('topBar.logo')) {
          <div class="logo" aria-label="Workflow Builder" title="Workflow Builder">
            <img
              class="logo-mark"
              src="brand-mark.png"
              width="28"
              height="28"
              alt=""
              decoding="async"
            />
          </div>
        }
      </div>

      @if (ui.is('topBar.title') || ui.is('topBar.status')) {
        <div class="project-selection">
          @if (ui.is('topBar.title')) {
            <span class="folder-name">Drafts /</span>
            <span class="title">{{ facade.workflowName() }}</span>
          }
          @if (ui.is('topBar.status')) {
            <span class="status" [attr.data-status]="facade.workflowStatus()">{{ facade.workflowStatus() }}</span>
          }
          @if (facade.editorMode() === 'view') {
            <span class="view-badge" aria-label="View mode">View</span>
          }
        </div>
      }

      <div class="controls">
        @if (ui.is('topBar.theme')) {
          <wb-theme-toggle />
        }

        @if (ui.is('topBar.editView')) {
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
        }

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
      </div>

      <div class="sr-live" aria-live="polite" aria-atomic="true">{{ facade.runAnnouncement() }}</div>
    </header>
  `,
  styles: `
    .top-bar {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 0.45rem;
      width: 100%;
      padding: 0.65rem 1rem 0.55rem;
      background: var(--wb-bg-elevated);
      border: 1px solid var(--wb-border);
      border-radius: 12px;
      box-shadow: var(--wb-shadow-soft);
      pointer-events: all;
      box-sizing: border-box;
    }

    .top-bar-row {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      min-height: 2.25rem;
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
      align-items: center;
      color: var(--wb-text);
      flex-shrink: 0;
    }

    .logo-mark {
      display: block;
      width: 28px;
      height: 28px;
      object-fit: contain;
      background: transparent;
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

    .status[data-status='saved'] {
      background: color-mix(in srgb, var(--wb-node-action) 22%, transparent);
      color: var(--wb-node-action);
      border: 1px solid color-mix(in srgb, var(--wb-node-action) 45%, transparent);
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
  readonly ui = injectEffectiveUi();
}
