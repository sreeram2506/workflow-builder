import { Injectable, computed, signal } from '@angular/core';
import type { WorkflowDocument } from '../domain/workflow.models';

const MAX_UNDO = 100;

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private readonly undoStack = signal<WorkflowDocument[]>([]);
  private readonly redoStack = signal<WorkflowDocument[]>([]);
  private suppressRecording = false;
  private gestureActive = false;
  private gestureRecorded = false;

  readonly canUndo = computed(() => this.undoStack().length > 0);
  readonly canRedo = computed(() => this.redoStack().length > 0);

  clear(): void {
    this.undoStack.set([]);
    this.redoStack.set([]);
    this.gestureActive = false;
    this.gestureRecorded = false;
  }

  setSuppressRecording(value: boolean): void {
    this.suppressRecording = value;
  }

  beginGesture(): void {
    this.gestureActive = true;
    this.gestureRecorded = false;
  }

  endGesture(): void {
    this.gestureActive = false;
    this.gestureRecorded = false;
  }

  /** Called by GraphStore before an eligible mutation. */
  recordBeforeMutation(current: WorkflowDocument): void {
    if (this.suppressRecording) {
      return;
    }
    if (this.gestureActive) {
      if (this.gestureRecorded) {
        return;
      }
      this.gestureRecorded = true;
    }
    this.pushUndo(current);
    this.redoStack.set([]);
  }

  undo(current: WorkflowDocument): WorkflowDocument | null {
    const stack = this.undoStack();
    if (stack.length === 0) {
      return null;
    }
    const prev = stack[stack.length - 1]!;
    this.undoStack.set(stack.slice(0, -1));
    this.redoStack.update((r) => [...r, structuredClone(current)]);
    return structuredClone(prev);
  }

  redo(current: WorkflowDocument): WorkflowDocument | null {
    const stack = this.redoStack();
    if (stack.length === 0) {
      return null;
    }
    const next = stack[stack.length - 1]!;
    this.redoStack.set(stack.slice(0, -1));
    this.pushUndo(current);
    return structuredClone(next);
  }

  private pushUndo(doc: WorkflowDocument): void {
    const clone = structuredClone(doc);
    this.undoStack.update((s) => {
      const next = [...s, clone];
      if (next.length > MAX_UNDO) {
        return next.slice(next.length - MAX_UNDO);
      }
      return next;
    });
  }
}
