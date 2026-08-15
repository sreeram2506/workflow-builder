import { Component, inject, input } from '@angular/core';
import { WorkflowFacade } from '../../core/facade/workflow.facade';

@Component({
  selector: 'wb-nested-skills-panel',
  standalone: true,
  template: `
    <section class="panel" data-testid="nested-skills-panel">
      <header class="head">
        <h2>Selected skills</h2>
        <p class="sub">Agent: {{ facade.agentTabLabel(agentNodeId()) }} — add from Skills Library</p>
      </header>
      @if (facade.agentSkills(agentNodeId()).length === 0) {
        <p class="empty">No skills added yet. Use the Skills Library on the left.</p>
      } @else {
        <ul class="cards" role="list">
          @for (skill of facade.agentSkills(agentNodeId()); track skill.skillId) {
            <li
              class="card"
              [class.active]="facade.selectedSkillId() === skill.skillId"
              role="listitem"
            >
              <button
                type="button"
                class="select"
                (click)="facade.setSelectedSkillId(skill.skillId)"
              >
                <span class="name">{{ skill.name }}</span>
                <span class="desc">{{ skill.description }}</span>
              </button>
              <button
                type="button"
                class="remove"
                [disabled]="facade.editorMode() === 'view'"
                (click)="facade.removeSkillFromAgent(agentNodeId(), skill.skillId)"
                [attr.aria-label]="'Remove ' + skill.name"
                title="Remove"
              >
                ×
              </button>
            </li>
          }
        </ul>
      }
    </section>
  `,
  styles: `
    .panel {
      height: 100%;
      padding: 4.5rem 1.25rem 1rem 300px;
      box-sizing: border-box;
      overflow: auto;
      background: var(--wb-bg-canvas);
    }
    .head h2 {
      margin: 0;
      font-size: 1rem;
    }
    .sub {
      margin: 0.25rem 0 0.85rem;
      color: var(--wb-text-muted);
      font-size: 0.8rem;
    }
    .empty {
      color: var(--wb-text-muted);
      font-size: 0.85rem;
    }
    .cards {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 0.55rem;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }
    .card {
      display: flex;
      align-items: stretch;
      border: 1px solid var(--wb-border);
      border-radius: 12px;
      background: var(--wb-bg-elevated);
      overflow: hidden;
    }
    .card.active {
      border-color: color-mix(in srgb, var(--wb-accent) 50%, var(--wb-border));
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--wb-accent) 35%, transparent);
    }
    .select {
      flex: 1;
      min-width: 0;
      text-align: left;
      border: 0;
      background: transparent;
      color: var(--wb-text);
      padding: 0.7rem 0.75rem;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .name {
      font-weight: 650;
      font-size: 0.85rem;
    }
    .desc {
      font-size: 0.72rem;
      color: var(--wb-text-muted);
    }
    .remove {
      border: 0;
      border-left: 1px solid var(--wb-border);
      background: transparent;
      color: var(--wb-text-muted);
      padding: 0 0.7rem;
      cursor: pointer;
      font-size: 1.1rem;
    }
    .remove:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `,
})
export class NestedSkillsPanelComponent {
  readonly facade = inject(WorkflowFacade);
  readonly agentNodeId = input.required<string>();
}
