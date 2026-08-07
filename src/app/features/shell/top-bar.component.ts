import { Component, inject } from '@angular/core';
import { ThemeToggleComponent } from '../theme/theme-toggle.component';
import { WorkflowFacade } from '../../core/facade/workflow.facade';

@Component({
  selector: 'wb-top-bar',
  standalone: true,
  imports: [ThemeToggleComponent],
  template: `
    <header class="top-bar">
      <div class="brand">
        <h1>{{ facade.workflowName() }}</h1>
        <span class="status" [attr.data-status]="facade.workflowStatus()">{{
          facade.workflowStatus()
        }}</span>
      </div>
      <div class="actions">
        <button type="button" disabled title="Coming in later phase" aria-label="Undo (coming later)">
          Undo
        </button>
        <button type="button" disabled title="Coming in later phase" aria-label="Redo (coming later)">
          Redo
        </button>
        <button type="button" disabled title="Coming in later phase" aria-label="Save (coming later)">
          Save
        </button>
        <button type="button" disabled title="Coming in later phase" aria-label="Run (coming later)">
          Run
        </button>
        <wb-theme-toggle />
      </div>
    </header>
  `,
  styles: `
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 1rem;
      background: var(--wb-bg-panel);
      border-bottom: 1px solid var(--wb-border);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    h1 {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 600;
    }
    .status {
      text-transform: capitalize;
      font-size: 0.75rem;
      padding: 0.2rem 0.55rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--wb-status-draft) 22%, transparent);
      color: var(--wb-status-draft);
      border: 1px solid color-mix(in srgb, var(--wb-status-draft) 45%, transparent);
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .actions button {
      border: 1px solid var(--wb-border);
      background: var(--wb-btn-disabled);
      color: var(--wb-text-muted);
      border-radius: var(--wb-radius);
      padding: 0.4rem 0.7rem;
      cursor: not-allowed;
    }
  `,
})
export class TopBarComponent {
  readonly facade = inject(WorkflowFacade);
}
