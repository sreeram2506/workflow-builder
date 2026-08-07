import { Component, input, output } from '@angular/core';

@Component({
  selector: 'wb-right-sidebar',
  standalone: true,
  template: `
    @if (!collapsed()) {
      <aside class="sidebar">
        <div class="sidebar-head">
          <h2>Properties</h2>
          <button
            type="button"
            (click)="collapsedChange.emit(true)"
            aria-label="Collapse right sidebar"
          >
            »
          </button>
        </div>
        <p class="placeholder">Properties coming soon</p>
      </aside>
    } @else {
      <button
        type="button"
        class="rail"
        (click)="collapsedChange.emit(false)"
        aria-label="Expand right sidebar"
      >
        «
      </button>
    }
  `,
  styles: `
    .sidebar {
      width: 280px;
      height: 100%;
      background: var(--wb-bg-panel);
      border-left: 1px solid var(--wb-border);
      padding: 0.75rem;
    }
    .sidebar-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    h2 {
      margin: 0;
      font-size: 0.9rem;
    }
    .placeholder {
      color: var(--wb-text-muted);
      font-size: 0.85rem;
    }
    .rail {
      width: 28px;
      border: none;
      border-left: 1px solid var(--wb-border);
      background: var(--wb-bg-panel);
      color: var(--wb-text);
      cursor: pointer;
    }
    button {
      border: 1px solid var(--wb-border);
      background: transparent;
      color: var(--wb-text);
      border-radius: var(--wb-radius);
      cursor: pointer;
    }
  `,
})
export class RightSidebarComponent {
  readonly collapsed = input(false);
  readonly collapsedChange = output<boolean>();
}
