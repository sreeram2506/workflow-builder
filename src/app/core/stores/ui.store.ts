import { Injectable, signal } from '@angular/core';
import type { EditorMode, SelectionState, Theme } from '../domain/workflow.models';

@Injectable({ providedIn: 'root' })
export class UiStore {
  readonly theme = signal<Theme>('dark');
  readonly editorMode = signal<EditorMode>('edit');
  readonly leftSidebarCollapsed = signal(false);
  readonly rightSidebarCollapsed = signal(false);
  readonly selection = signal<SelectionState>({ nodeIds: [], edgeIds: [] });
  readonly bootstrapError = signal<string | null>(null);

  resetSessionDefaults(): void {
    this.theme.set('dark');
    this.editorMode.set('edit');
    this.leftSidebarCollapsed.set(false);
    this.rightSidebarCollapsed.set(false);
    this.selection.set({ nodeIds: [], edgeIds: [] });
    this.bootstrapError.set(null);
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
}
