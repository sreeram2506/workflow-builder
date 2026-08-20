import { Component, DestroyRef, EventEmitter, OnDestroy, OnInit, Output, computed, effect, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  createEffectiveUiReader,
  mergeInstanceUiFeatures,
  UI_EFFECTIVE_FEATURES,
  UiConfigService,
  type HostPropertiesInput,
  type UiFeaturesPartial,
} from '../../core/ui-config';
import type { PaletteItem } from '../../core/domain/palette.catalog';
import type { WorkflowDocument } from '../../core/domain/workflow.models';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { CanvasHostComponent } from '../canvas/canvas-host.component';
import { AgentTabsComponent } from '../shell/agent-tabs.component';
import { ChromeShortcutsDirective } from '../shell/chrome-shortcuts.directive';
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
    AgentTabsComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    ChromeInsetDirective,
    ChromeShortcutsDirective,
  ],
  providers: [
    {
      provide: UI_EFFECTIVE_FEATURES,
      useFactory: (host: AgentSkillsShellComponent) => host.effectiveUi,
      deps: [AgentSkillsShellComponent],
    },
  ],
  template: `
    <div
      class="shell"
      [attr.data-mode]="facade.editorMode()"
      data-testid="agent-skills-shell"
      wbChromeShortcuts
    >
      @if (facade.bootstrapError(); as err) {
        <div class="error-banner" role="alert">{{ err }}</div>
      }
      @if (uiConfig.loadStatus().kind === 'missing' || uiConfig.loadStatus().kind === 'invalid') {
        <div class="config-banner" role="status" data-testid="ui-config-banner">
          {{ uiConfig.loadStatus().message }}
        </div>
      }
      <div class="stage">
        <wb-canvas-host />
        @if (headerOverlayShown()) {
          <div
            class="header-overlay"
            [class.compact]="!effectiveUi.is('topBar.enabled')"
            wbChromeInset
          >
            @if (effectiveUi.is('topBar.enabled')) {
              <wb-top-bar />
            }
            @if (effectiveUi.is('agentTabs.enabled')) {
              <wb-agent-tabs />
            }
            @if (nestedSolutionBackShown()) {
              <button
                type="button"
                class="nested-back"
                data-testid="nested-back-to-solution"
                (click)="onNestedBack()"
              >
                Solution
              </button>
            }
          </div>
        }
        @if (effectiveUi.is('skillsLibrary.enabled')) {
          <wb-left-sidebar
            [collapsed]="facade.leftSidebarCollapsed()"
            [panelWidth]="facade.nodesLibraryWidth()"
            paletteScope="agent"
            [agentNodeId]="nodeId"
            [palettes]="palettes()"
            (collapsedChange)="facade.setLeftCollapsed($event)"
            (panelWidthChange)="facade.setNodesLibraryWidth($event)"
          />
        }
        @if (effectiveUi.is('propertiesPanel.enabled')) {
          <wb-right-sidebar
            [collapsed]="facade.rightSidebarCollapsed()"
            [panelWidth]="facade.propertiesWidth()"
            [palettes]="palettes()"
            [properties]="properties()"
            (collapsedChange)="facade.setRightCollapsed($event)"
            (panelWidthChange)="facade.setPropertiesWidth($event)"
          />
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
      min-height: 0;
    }
    .shell {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
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
    .config-banner {
      background: color-mix(in srgb, var(--wb-accent) 16%, transparent);
      color: var(--wb-text);
      border-bottom: 1px solid color-mix(in srgb, var(--wb-accent) 45%, var(--wb-border));
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
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem;
      overflow: visible;
      pointer-events: none;
      box-sizing: border-box;
    }
    .header-overlay > * {
      pointer-events: all;
    }
    .header-overlay.compact {
      padding: 0.5rem 1rem;
    }
    .nested-back {
      align-self: flex-start;
      min-height: 1.85rem;
      padding: 0.35rem 0.9rem;
      border: 1px solid var(--wb-border);
      border-radius: 999px;
      background: color-mix(in srgb, var(--wb-bg-app) 82%, #000);
      color: var(--wb-text);
      font: inherit;
      font-size: 0.8rem;
      font-weight: 650;
      letter-spacing: 0.01em;
      cursor: pointer;
      pointer-events: all;
      box-shadow: var(--wb-shadow-soft);
    }
    .nested-back:hover {
      border-color: color-mix(in srgb, var(--wb-accent) 50%, var(--wb-border));
      background: color-mix(in srgb, var(--wb-accent) 38%, var(--wb-bg-elevated));
    }
  `,
})
export class AgentSkillsShellComponent implements OnInit, OnDestroy {
  readonly facade = inject(WorkflowFacade);
  readonly uiConfig = inject(UiConfigService);
  /** Instance chrome overlay (omit = last shell overlay, else JSON/provider). */
  readonly ui = input<UiFeaturesPartial | undefined>();
  readonly palettes = input<PaletteItem[] | undefined>();
  /** Instance properties schema — adapter or map by paletteKey. */
  readonly properties = input<HostPropertiesInput | undefined>();
  @Output() readonly save = new EventEmitter<WorkflowDocument>();
  @Output() readonly run = new EventEmitter<WorkflowDocument>();
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  nodeId = '';

  readonly effectiveFeatures = computed(() =>
    mergeInstanceUiFeatures(this.uiConfig.features(), this.uiConfig.instanceUiForMerge(this.ui())),
  );
  readonly effectiveUi = createEffectiveUiReader(() => this.effectiveFeatures());
  /**
   * Nested Solution Back when the strip is off and canvas dblclick enter is off.
   * Embed combo (strip off + dblclick on) leaves exit to the parent breadcrumb.
   */
  readonly nestedSolutionBackShown = computed(() => {
    const tabs = this.effectiveFeatures().agentTabs;
    return !tabs.enabled && !tabs.doubleClick;
  });
  /** Top bar, open chips, or nested Back when that control is mounted. */
  readonly headerOverlayShown = computed(() => {
    const features = this.effectiveFeatures();
    return (
      features.topBar.enabled ||
      this.nestedSolutionBackShown() ||
      this.facade.agentTabs().length > 0
    );
  });

  constructor() {
    this.facade.registerInstancePersist({
      saveObserved: () => this.save.observed,
      emitSave: (doc) => this.save.emit(doc),
      runObserved: () => this.run.observed,
      emitRun: (doc) => this.run.emit(doc),
    });
    effect(() => {
      this.uiConfig.publishInstanceUiOverlay(this.ui());
    });
    effect(() => {
      const features = this.effectiveFeatures();
      this.facade.setAgentTabsChromeEnabled(features.agentTabs.enabled);
      if (!this.headerOverlayShown()) {
        this.facade.setChromeInsetTop(16);
      }
    });
  }

  ngOnInit(): void {
    this.facade.setAgentTabsChromeEnabled(this.effectiveFeatures().agentTabs.enabled);
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.nodeId = params.get('nodeId') ?? '';
      this.facade.ensureAgentRoute(this.nodeId);
    });
  }

  onNestedBack(): void {
    this.facade.navigateBackToSolution(this.facade.editingAgentNodeId());
  }

  ngOnDestroy(): void {
    this.facade.registerInstancePersist(null);
    if (this.facade.editingAgentNodeId()) {
      this.facade.exitAgentCanvas();
    }
  }
}
