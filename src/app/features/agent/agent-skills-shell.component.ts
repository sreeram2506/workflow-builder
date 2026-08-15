import { Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { CanvasHostComponent } from '../canvas/canvas-host.component';
import { TopBarComponent } from '../shell/top-bar.component';
import { LeftSidebarComponent } from '../shell/left-sidebar.component';
import { RightSidebarComponent } from '../shell/right-sidebar.component';
import { ChromeInsetDirective } from '../shell/chrome-inset.directive';

/**
 * Nested Blank Agent experience = same diagram builder as solution
 * (canvas + full Nodes Library drag-drop), scoped to agent.data.nestedWorkflow.
 */
@Component({
  selector: 'wb-agent-skills-shell',
  standalone: true,
  imports: [
    CanvasHostComponent,
    TopBarComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    ChromeInsetDirective,
  ],
  template: `
    <div class="shell" [attr.data-mode]="facade.editorMode()" data-testid="agent-skills-shell">
      @if (facade.bootstrapError(); as err) {
        <div class="error-banner" role="alert">{{ err }}</div>
      }
      <div class="stage">
        <wb-canvas-host />
        <div class="header-overlay" wbChromeInset>
          <wb-top-bar [showBack]="true" [backAgentNodeId]="nodeId" />
        </div>
        <wb-left-sidebar
          [collapsed]="facade.leftSidebarCollapsed()"
          [panelWidth]="facade.nodesLibraryWidth()"
          paletteScope="agent"
          [agentNodeId]="nodeId"
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
export class AgentSkillsShellComponent implements OnInit, OnDestroy {
  readonly facade = inject(WorkflowFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  nodeId = '';

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.nodeId = params.get('nodeId') ?? '';
      this.facade.ensureAgentRoute(this.nodeId);
    });
  }

  ngOnDestroy(): void {
    if (this.facade.editingAgentNodeId()) {
      this.facade.exitAgentCanvas();
    }
  }
}
