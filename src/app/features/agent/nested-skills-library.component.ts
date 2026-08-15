import { Component, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MOCK_SKILLS, filterMockSkills } from '../../core/domain/mock-skills.catalog';
import { WorkflowFacade } from '../../core/facade/workflow.facade';

@Component({
  selector: 'wb-nested-skills-library',
  standalone: true,
  imports: [FormsModule],
  template: `
    <aside class="lib" data-testid="nested-skills-library">
      <h2 class="title">Developed skills</h2>
      <input
        class="search"
        type="search"
        placeholder="Search skills…"
        [ngModel]="query()"
        (ngModelChange)="query.set($event)"
        [disabled]="facade.editorMode() === 'view'"
      />
      <ul class="list" role="list">
        @for (skill of filtered(); track skill.skillId) {
          <li class="card">
            <div class="text">
              <div class="name">{{ skill.name }}</div>
              <div class="desc">{{ skill.description }}</div>
            </div>
            <button
              type="button"
              class="add"
              [disabled]="facade.editorMode() === 'view'"
              (click)="facade.addSkillToAgent(agentNodeId(), skill.skillId)"
              [attr.data-testid]="'add-skill-' + skill.skillId"
            >
              Add
            </button>
          </li>
        }
      </ul>
    </aside>
  `,
  styles: `
    .lib {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      height: 100%;
      padding: 4.5rem 0.75rem 0.75rem;
      box-sizing: border-box;
      background: var(--wb-bg-elevated);
      border-right: 1px solid var(--wb-border);
      overflow: auto;
    }
    .title {
      margin: 0;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--wb-text);
    }
    .search {
      border: 1px solid var(--wb-border);
      border-radius: 8px;
      background: var(--wb-bg-app);
      color: var(--wb-text);
      padding: 0.4rem 0.55rem;
      font-size: 0.8rem;
    }
    .list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }
    .card {
      display: flex;
      gap: 0.5rem;
      align-items: flex-start;
      border: 1px solid var(--wb-border);
      border-radius: 10px;
      padding: 0.55rem;
      background: var(--wb-bg-app);
    }
    .text {
      min-width: 0;
      flex: 1;
    }
    .name {
      font-size: 0.8rem;
      font-weight: 650;
    }
    .desc {
      font-size: 0.7rem;
      color: var(--wb-text-muted);
    }
    .add {
      border: 1px solid var(--wb-border);
      border-radius: 8px;
      background: transparent;
      color: var(--wb-accent);
      cursor: pointer;
      font-size: 0.72rem;
      padding: 0.25rem 0.45rem;
    }
    .add:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
})
export class NestedSkillsLibraryComponent {
  readonly facade = inject(WorkflowFacade);
  readonly agentNodeId = input.required<string>();
  readonly query = signal('');
  readonly filtered = computed(() => filterMockSkills(MOCK_SKILLS, this.query()));
}
