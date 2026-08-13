import { Component, inject } from '@angular/core';
import { WorkflowFacade } from '../../core/facade/workflow.facade';

@Component({
  selector: 'wb-theme-toggle',
  standalone: true,
  template: `
    <button
      type="button"
      class="theme-pill"
      [attr.data-theme]="facade.theme()"
      (click)="facade.toggleTheme()"
      [attr.aria-label]="facade.theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
      [title]="facade.theme() === 'dark' ? 'Light mode' : 'Dark mode'"
      data-testid="theme-toggle"
    >
      <span class="slot sun" [class.active]="facade.theme() === 'light'" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55">
          <circle cx="12" cy="12" r="3.1" />
          <path
            stroke-linecap="round"
            d="M12 3.2v1.7M12 19.1v1.7M3.2 12h1.7M19.1 12h1.7M6 6l1.2 1.2M16.8 16.8l1.2 1.2M18 6l-1.2 1.2M7.2 16.8l-1.2 1.2"
          />
        </svg>
      </span>
      <span class="slot moon" [class.active]="facade.theme() === 'dark'" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.8 4.4a7 7 0 1 0 4.8 12.2 5.4 5.4 0 0 1-4.8-12.2z"
          />
          <path stroke-linecap="round" d="M18.2 6.6v1.8M17.3 7.5h1.8" />
          <path stroke-linecap="round" d="M20.2 8.8v1.2M19.6 9.4h1.2" />
        </svg>
      </span>
      <span class="thumb" aria-hidden="true"></span>
    </button>
  `,
  styles: `
    .theme-pill {
      --theme-track: #0a0c10;
      --theme-thumb: #2a2f38;
      --theme-inactive: #8b93a3;
      position: relative;
      display: inline-grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      width: 72px;
      height: 34px;
      padding: 0;
      border: 1px solid color-mix(in srgb, var(--theme-track) 80%, #444);
      border-radius: 999px;
      background: var(--theme-track);
      cursor: pointer;
      color: var(--theme-inactive);
      overflow: hidden;
      box-shadow: inset 0 1px 2px color-mix(in srgb, #000 45%, transparent);
    }
    :host-context([data-theme='light']) .theme-pill {
      --theme-track: #e8ebf0;
      --theme-thumb: #ffffff;
      --theme-inactive: #6b7280;
      border-color: #d5dae3;
      box-shadow: inset 0 1px 2px color-mix(in srgb, #000 6%, transparent);
    }
    .slot {
      position: relative;
      z-index: 1;
      display: grid;
      place-content: center;
      height: 100%;
      transition: color 220ms ease;
    }
    .slot svg {
      width: 17px;
      height: 17px;
      display: block;
    }
    .slot.active {
      color: var(--wb-accent);
    }
    .thumb {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--theme-thumb);
      box-shadow: 0 1px 4px color-mix(in srgb, #000 40%, transparent);
      transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
      z-index: 0;
    }
    .theme-pill[data-theme='dark'] .thumb {
      transform: translateX(38px);
    }
    .theme-pill:hover {
      border-color: color-mix(in srgb, var(--wb-accent) 40%, var(--theme-track));
    }
    .theme-pill:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--wb-accent) 55%, transparent);
      outline-offset: 2px;
    }
  `,
})
export class ThemeToggleComponent {
  readonly facade = inject(WorkflowFacade);
}
