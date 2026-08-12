import { Injectable, signal } from '@angular/core';
import type {
  EditorMode,
  SelectionState,
  Theme,
  WorkflowEdge,
  WorkflowNode,
} from '../domain/workflow.models';

@Injectable({ providedIn: 'root' })
export class UiStore {
  readonly theme = signal<Theme>('dark');
  readonly editorMode = signal<EditorMode>('edit');
  readonly leftSidebarCollapsed = signal(false);
  readonly rightSidebarCollapsed = signal(true);
  readonly selection = signal<SelectionState>({ nodeIds: [], edgeIds: [] });
  /** Most recently clicked selected node (Properties target). */
  readonly selectionFocusNodeId = signal<string | null>(null);
  /** Most recently clicked selected edge (Properties target). */
  readonly selectionFocusEdgeId = signal<string | null>(null);
  /** Working copy while Properties form is dirty (dual-write). */
  readonly propertiesDraft = signal<WorkflowNode | null>(null);
  readonly propertiesEdgeDraft = signal<WorkflowEdge | null>(null);
  readonly bootstrapError = signal<string | null>(null);
  readonly canvasError = signal<string | null>(null);
  /** Non-error status (e.g. routing fallback notice). */
  readonly canvasStatus = signal<string | null>(null);
  /** Simulated Run in progress (U8). */
  readonly runActive = signal(false);
  /** Polite aria-live announcement for Run steps (U8). */
  readonly runAnnouncement = signal<string | null>(null);
  /** Last known canvas viewport CSS size (for click-to-add at center). */
  readonly viewSize = signal({ w: 800, h: 600 });

  resetSessionDefaults(): void {
    this.theme.set('dark');
    this.editorMode.set('edit');
    this.leftSidebarCollapsed.set(false);
    this.rightSidebarCollapsed.set(true);
    this.selection.set({ nodeIds: [], edgeIds: [] });
    this.selectionFocusNodeId.set(null);
    this.selectionFocusEdgeId.set(null);
    this.propertiesDraft.set(null);
    this.propertiesEdgeDraft.set(null);
    this.bootstrapError.set(null);
    this.canvasError.set(null);
    this.canvasStatus.set(null);
    this.runActive.set(false);
    this.runAnnouncement.set(null);
    this.viewSize.set({ w: 800, h: 600 });
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  setLeftCollapsed(collapsed: boolean): void {
    this.leftSidebarCollapsed.set(collapsed);
  }

  setRightCollapsed(collapsed: boolean): void {
    this.rightSidebarCollapsed.set(collapsed);
  }

  setBootstrapError(message: string | null): void {
    this.bootstrapError.set(message);
  }

  setCanvasError(message: string | null): void {
    this.canvasError.set(message);
  }

  setCanvasStatus(message: string | null): void {
    this.canvasStatus.set(message);
  }

  setRunActive(active: boolean): void {
    this.runActive.set(active);
  }

  setRunAnnouncement(message: string | null): void {
    this.runAnnouncement.set(message);
  }

  setEditorMode(mode: EditorMode): void {
    this.editorMode.set(mode);
  }

  setSelection(selection: SelectionState): void {
    this.selection.set({
      nodeIds: [...selection.nodeIds],
      edgeIds: [...selection.edgeIds],
    });
  }

  clearSelection(): void {
    this.selection.set({ nodeIds: [], edgeIds: [] });
  }

  setSelectionFocusNodeId(id: string | null): void {
    this.selectionFocusNodeId.set(id);
  }

  setSelectionFocusEdgeId(id: string | null): void {
    this.selectionFocusEdgeId.set(id);
  }

  setPropertiesDraft(node: WorkflowNode | null): void {
    this.propertiesDraft.set(node);
  }

  setPropertiesEdgeDraft(edge: WorkflowEdge | null): void {
    this.propertiesEdgeDraft.set(edge);
  }

  setViewSize(size: { w: number; h: number }): void {
    this.viewSize.set(size);
  }
}
