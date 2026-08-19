import {
  Component,
  DestroyRef,
  EventEmitter,
  OnDestroy,
  Output,
  computed,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime } from 'rxjs';
import {
  createEffectiveUiReader,
  mergeInstanceUiFeatures,
  UI_EFFECTIVE_FEATURES,
  UiConfigService,
  type UiFeaturesPartial,
} from '../../core/ui-config';
import type { DefaultAgentCard } from '../../core/ui-config/ui-features.types';
import type { PaletteItem } from '../../core/domain/palette.catalog';
import type { WorkflowDocument } from '../../core/domain/workflow.models';
import { WorkflowFacade } from '../../core/facade/workflow.facade';
import { AgentTabsComponent } from './agent-tabs.component';
import { ChromeShortcutsDirective } from './chrome-shortcuts.directive';
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
    AgentTabsComponent,
    LeftSidebarComponent,
    RightSidebarComponent,
    CanvasHostComponent,
    ChromeInsetDirective,
    ChromeShortcutsDirective,
  ],
  providers: [
    {
      provide: UI_EFFECTIVE_FEATURES,
      useFactory: (host: ShellLayoutComponent) => host.effectiveUi,
      deps: [ShellLayoutComponent],
    },
  ],
  template: `
    <div class="shell" [attr.data-mode]="facade.editorMode()" wbChromeShortcuts>
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
        @if (effectiveUi.is('topBar.enabled') || (effectiveUi.is('agentTabs.enabled') && facade.agentTabs().length > 0)) {
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
          </div>
        }
        @if (effectiveUi.is('agentsLibrary.enabled')) {
          <wb-left-sidebar
            [collapsed]="facade.leftSidebarCollapsed()"
            [panelWidth]="facade.nodesLibraryWidth()"
            paletteScope="solution"
            [palettes]="palettes()"
            [defaultAgents]="defaultAgents()"
            (collapsedChange)="facade.setLeftCollapsed($event)"
            (panelWidthChange)="facade.setNodesLibraryWidth($event)"
          />
        }
        @if (effectiveUi.is('propertiesPanel.enabled')) {
          <wb-right-sidebar
            [collapsed]="facade.rightSidebarCollapsed()"
            [panelWidth]="facade.propertiesWidth()"
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
  `,
})
export class ShellLayoutComponent implements OnDestroy {
  readonly facade = inject(WorkflowFacade);
  readonly uiConfig = inject(UiConfigService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly changeTicks = new Subject<void>();
  /** Instance chrome overlay (omit = no overlay). */
  readonly ui = input<UiFeaturesPartial | undefined>();
  readonly palettes = input<PaletteItem[] | undefined>();
  readonly defaultAgents = input<DefaultAgentCard[] | undefined>();
  /** Host document to load. Omit/undefined keeps SPA initialize(). */
  readonly document = input<unknown>(undefined);

  @Output() readonly documentChange = new EventEmitter<WorkflowDocument>();
  @Output() readonly save = new EventEmitter<WorkflowDocument>();
  @Output() readonly run = new EventEmitter<WorkflowDocument>();

  readonly effectiveFeatures = computed(() =>
    mergeInstanceUiFeatures(this.uiConfig.features(), this.ui()),
  );
  readonly effectiveUi = createEffectiveUiReader(() => this.effectiveFeatures());

  constructor() {
    this.facade.registerInstancePersist({
      saveObserved: () => this.save.observed,
      emitSave: (doc) => this.save.emit(doc),
      runObserved: () => this.run.observed,
      emitRun: (doc) => this.run.emit(doc),
    });
    this.changeTicks.pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.emitDocumentChange();
    });
    effect(() => {
      const features = this.effectiveFeatures();
      this.facade.setAgentTabsChromeEnabled(features.agentTabs.enabled);
      const overlayShown =
        features.topBar.enabled || (features.agentTabs.enabled && this.facade.agentTabs().length > 0);
      if (!overlayShown) {
        this.facade.setChromeInsetTop(16);
      }
    });
    effect(() => {
      const raw = this.document();
      if (raw === undefined) {
        return;
      }
      untracked(() => this.facade.loadDocument(raw));
    });
    effect(() => {
      const rev = this.facade.documentRevision();
      if (rev > 0) {
        untracked(() => this.emitDocumentChange());
      }
    });
    effect(() => {
      if (this.facade.dirty()) {
        this.changeTicks.next();
      }
    });
  }

  ngOnDestroy(): void {
    this.facade.registerInstancePersist(null);
  }

  private emitDocumentChange(): void {
    const doc = this.facade.getDocument();
    if (!doc) {
      return;
    }
    this.documentChange.emit(structuredClone(doc));
  }
}
