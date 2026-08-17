import { Component, inject } from '@angular/core';
import { WorkflowFacade } from '../../core/facade/workflow.facade';

@Component({
  selector: 'wb-agent-tabs',
  standalone: true,
  template: `
    @if (facade.agentTabs().length > 0) {
      <div
        class="agent-tabs"
        role="tablist"
        aria-label="Solution and agent tabs"
        data-testid="agent-tabs-strip"
      >
        <button
          type="button"
          class="agent-chip solution-chip"
          role="tab"
          [class.active]="!facade.editingAgentNodeId()"
          [attr.aria-selected]="!facade.editingAgentNodeId()"
          data-testid="solution-tab"
          (click)="onSolutionTab()"
          title="Solution workflow"
        >
          Solution
        </button>
        @for (tab of facade.agentTabs(); track tab.nodeId) {
          <div
            class="agent-chip"
            role="presentation"
            [class.active]="facade.editingAgentNodeId() === tab.nodeId"
            [class.focused]="
              !facade.editingAgentNodeId() && facade.focusedAgentTabId() === tab.nodeId
            "
            [attr.data-testid]="'agent-tab-' + tab.nodeId"
          >
            <button
              type="button"
              class="agent-chip-label"
              role="tab"
              [attr.aria-selected]="facade.editingAgentNodeId() === tab.nodeId"
              (click)="facade.focusAgentTabChrome(tab.nodeId)"
              [title]="'Open ' + facade.agentTabLabel(tab.nodeId)"
            >
              {{ facade.agentTabLabel(tab.nodeId) }}
            </button>
            <button
              type="button"
              class="agent-chip-close"
              (click)="onCloseTab(tab.nodeId); $event.stopPropagation()"
              [attr.aria-label]="'Close ' + facade.agentTabLabel(tab.nodeId)"
              title="Close tab"
            >
              ×
            </button>
          </div>
        }
      </div>
    }
  `,
  styles: `
    .agent-tabs {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      width: 100%;
      max-width: 100%;
      padding: 0.55rem 0.85rem;
      overflow-x: auto;
      background: var(--wb-bg-elevated);
      border: 1px solid var(--wb-border);
      border-radius: 12px;
      box-shadow: var(--wb-shadow-soft);
      pointer-events: all;
      box-sizing: border-box;
    }

    .agent-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
      max-width: 200px;
      min-height: 1.85rem;
      padding: 0.15rem 0.2rem 0.15rem 0.7rem;
      border: 1px solid var(--wb-border);
      border-radius: 999px;
      background: color-mix(in srgb, var(--wb-bg-app) 75%, #000);
      color: var(--wb-text);
      flex-shrink: 0;
      box-sizing: border-box;
    }

    .agent-chip.solution-chip {
      padding: 0.35rem 0.9rem;
      font: inherit;
      font-size: 0.8rem;
      font-weight: 650;
      letter-spacing: 0.01em;
      cursor: pointer;
      color: var(--wb-text);
      background: color-mix(in srgb, var(--wb-bg-app) 82%, #000);
    }

    .agent-chip.focused:not(.active) {
      border-color: color-mix(in srgb, var(--wb-accent) 40%, var(--wb-border));
      background: color-mix(in srgb, var(--wb-accent) 16%, var(--wb-bg-app));
    }

    .agent-chip.active,
    .agent-chip.solution-chip.active {
      border-color: color-mix(in srgb, var(--wb-accent) 50%, var(--wb-border));
      background: color-mix(in srgb, var(--wb-accent) 38%, var(--wb-bg-elevated));
      color: var(--wb-text);
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--wb-accent) 22%, transparent);
    }

    .agent-chip-label {
      min-width: 0;
      border: 0;
      background: transparent;
      color: inherit;
      font-size: 0.8rem;
      font-weight: 650;
      padding: 0.2rem 0.15rem;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .agent-chip-close {
      border: 0;
      background: transparent;
      color: var(--wb-text-muted);
      cursor: pointer;
      padding: 0.15rem 0.45rem 0.2rem;
      font-size: 0.95rem;
      line-height: 1;
      border-radius: 999px;
    }

    .agent-chip-close:hover {
      color: var(--wb-text);
      background: color-mix(in srgb, var(--wb-text) 10%, transparent);
    }
  `,
})
export class AgentTabsComponent {
  readonly facade = inject(WorkflowFacade);

  onSolutionTab(): void {
    if (this.facade.editingAgentNodeId()) {
      this.facade.navigateBackToSolution(this.facade.editingAgentNodeId());
    }
  }

  onCloseTab(nodeId: string): void {
    const wasEditing = this.facade.editingAgentNodeId() === nodeId;
    this.facade.closeAgentTab(nodeId);
    if (wasEditing) {
      this.facade.navigateBackToSolution(nodeId);
    }
  }
}
