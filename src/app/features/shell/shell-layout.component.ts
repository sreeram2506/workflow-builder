import { Component, inject } from '@angular/core';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { TopBarComponent } from './top-bar.component';
import { LeftSidebarComponent } from './left-sidebar.component';
import { RightSidebarComponent } from './right-sidebar.component';
import { CanvasHostComponent } from '../canvas/canvas-host.component';
import { ChromeInsetDirective } from './chrome-inset.directive';

@Component({
  selector: 'wb-shell-layout',
  standalone: true,
  imports: [
    TopBarComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    CanvasHostComponent,
    ChromeInsetDirective,
  ],
  template: `
    <div class="shell" [attr.data-mode]="facade.editorMode()">
      @if (facade.bootstrapError(); as err) {
        <div class="error-banner" role="alert">{{ err }}</div>
      }
      <div class="stage">
        <wb-canvas-host />
        <div class="header-overlay" wbChromeInset>
          <wb-top-bar />
        </div>
        <wb-left-sidebar
          [collapsed]="facade.leftSidebarCollapsed()"
          [panelWidth]="facade.nodesLibraryWidth()"
          paletteScope="solution"
          (collapsedChange)="facade.setLeftCollapsed($event)"
          (panelWidthChange)="facade.setNodesLibraryWidth($event)"
        />
        <wb-right-sidebar
          [collapsed]="facade.rightSidebarCollapsed()"
          [panelWidth]="facade.propertiesWidth()"
          (collapsedChange)="facade.setRightCollapsed($event)"
          (panelWidthChange)="facade.setPropertiesWidth($event)"
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
      z-index: 20;
    }
    .stage {
      position: relative;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }
    .header-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
      padding: 1rem;
      overflow: visible;
      pointer-events: none;
      box-sizing: border-box;
    }
    .header-overlay > * {
      pointer-events: all;
    }
  `,
})
export class ShellLayoutComponent {
  readonly facade = inject(WorkflowFacade);
}
