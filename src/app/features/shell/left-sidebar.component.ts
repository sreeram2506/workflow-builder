import { Component, input, output } from '@angular/core';

@Component({
  selector: 'wb-left-sidebar',
  standalone: true,
  template: `
    @if (!collapsed()) {
      <aside class="sidebar">
        <div class="sidebar-head">
          <h2>Nodes</h2>
          <button type="button" (click)="collapsedChange.emit(true)" aria-label="Collapse left sidebar">
            «
          </button>
        </div>
        <p class="placeholder">Node library coming soon</p>
      </aside>
    } @else {
      <button
        type="button"
        class="rail"
        (click)="collapsedChange.emit(false)"
        aria-label="Expand left sidebar"
      >
        »
      </button>
    }
  `,
  styles: `
    .sidebar {
      width: 240px;
      height: 100%;
      background: var(--wb-bg-panel);
      border-right: 1px solid var(--wb-border);
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
      border-right: 1px solid var(--wb-border);
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
export class LeftSidebarComponent {
  readonly collapsed = input(false);
  readonly collapsedChange = output<boolean>();
}
