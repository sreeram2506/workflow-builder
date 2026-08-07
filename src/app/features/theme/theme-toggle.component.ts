import { Component, inject } from '@angular/core';
import { WorkflowFacade } from '../../core/facade/workflow.facade';

@Component({
  selector: 'wb-theme-toggle',
  standalone: true,
  template: `
    <button
      type="button"
      class="theme-toggle"
      (click)="facade.toggleTheme()"
      [attr.aria-label]="facade.theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
    >
      {{ facade.theme() === 'dark' ? 'Light' : 'Dark' }}
    </button>
  `,
  styles: `
    .theme-toggle {
      border: 1px solid var(--wb-border);
      background: var(--wb-bg-app);
      color: var(--wb-text);
      border-radius: var(--wb-radius);
      padding: 0.4rem 0.75rem;
      cursor: pointer;
    }
  `,
})
export class ThemeToggleComponent {
  readonly facade = inject(WorkflowFacade);
}
