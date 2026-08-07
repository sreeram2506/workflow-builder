import { Injectable, signal } from '@angular/core';
import type { WorkflowDocument } from '../domain/workflow.models';

@Injectable({ providedIn: 'root' })
export class GraphStore {
  readonly document = signal<WorkflowDocument | null>(null);

  setDocument(doc: WorkflowDocument): void {
    this.document.set(doc);
  }

  clear(): void {
    this.document.set(null);
  }
}
