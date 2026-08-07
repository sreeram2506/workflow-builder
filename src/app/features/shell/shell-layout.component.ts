import { Component, inject } from '@angular/core';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { TopBarComponent } from './top-bar.component';
import { LeftSidebarComponent } from './left-sidebar.component';
import { RightSidebarComponent } from './right-sidebar.component';
import { CanvasHostComponent } from '../canvas/canvas-host.component';

@Component({
  selector: 'wb-shell-layout',
  standalone: true,
  imports: [TopBarComponent, LeftSidebarComponent, RightSidebarComponent, CanvasHostComponent],
  template: `
    <div class="shell" [attr.data-mode]="facade.editorMode()">
      @if (facade.bootstrapError(); as err) {
        <div class="error-banner" role="alert">{{ err }}</div>
      }
      <wb-top-bar />
      <div class="body">
        <wb-left-sidebar
          [collapsed]="facade.leftSidebarCollapsed()"
          (collapsedChange)="facade.setLeftCollapsed($event)"
        />
        <main class="main">
          <wb-canvas-host />
        </main>
        <wb-right-sidebar
          [collapsed]="facade.rightSidebarCollapsed()"
          (collapsedChange)="facade.setRightCollapsed($event)"
        />
      </div>
    </div>
  `,
  styles: `
    .shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--wb-bg-app);
    }
    .error-banner {
      background: color-mix(in srgb, var(--wb-danger) 20%, transparent);
      color: var(--wb-danger);
      border-bottom: 1px solid var(--wb-danger);
      padding: 0.6rem 1rem;
      font-size: 0.9rem;
    }
    .body {
      display: flex;
      flex: 1;
      min-height: 0;
    }
    .main {
      flex: 1;
      min-width: 0;
    }
  `,
})
export class ShellLayoutComponent {
  readonly facade = inject(WorkflowFacade);
}
