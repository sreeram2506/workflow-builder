import { Injectable, computed, inject } from '@angular/core';
import { MockWorkflowRepository } from '../data/mock-workflow.repository';
import { nextTheme } from '../domain/theme.utils';
import { GraphStore } from '../stores/graph.store';
import { UiStore } from '../stores/ui.store';
import { ThemeApplicator } from '../theme/theme-applicator';

@Injectable({ providedIn: 'root' })
export class WorkflowFacade {
  private readonly graph = inject(GraphStore);
  private readonly ui = inject(UiStore);
  private readonly repo = inject(MockWorkflowRepository);
  private readonly themeApplicator = inject(ThemeApplicator);

  readonly document = this.graph.document;
  readonly theme = this.ui.theme;
  readonly editorMode = this.ui.editorMode;
  readonly leftSidebarCollapsed = this.ui.leftSidebarCollapsed;
  readonly rightSidebarCollapsed = this.ui.rightSidebarCollapsed;
  readonly bootstrapError = this.ui.bootstrapError;

  readonly workflowName = computed(() => this.graph.document()?.name ?? 'Untitled workflow');
  readonly workflowStatus = computed(() => this.graph.document()?.status ?? 'draft');
  readonly nodeCount = computed(() => this.graph.document()?.nodes.length ?? 0);
  readonly edgeCount = computed(() => this.graph.document()?.edges.length ?? 0);

  initialize(): void {
    this.ui.resetSessionDefaults();
    const doc = this.repo.getSampleWorkflow();
    this.graph.setDocument(doc);
    this.themeApplicator.apply(this.ui.theme());
  }

  toggleTheme(): void {
    const next = nextTheme(this.ui.theme());
    this.ui.setTheme(next);
    this.themeApplicator.apply(next);
  }

  setLeftCollapsed(collapsed: boolean): void {
    this.ui.setLeftCollapsed(collapsed);
  }

  setRightCollapsed(collapsed: boolean): void {
    this.ui.setRightCollapsed(collapsed);
  }

  setBootstrapError(message: string | null): void {
    this.ui.setBootstrapError(message);
  }
}
