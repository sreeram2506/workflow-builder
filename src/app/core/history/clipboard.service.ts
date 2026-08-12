import { Injectable, signal } from '@angular/core';
import type { WorkflowEdge, WorkflowNode } from '../domain/workflow.models';

export interface ClipboardPayload {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

@Injectable({ providedIn: 'root' })
export class ClipboardService {
  readonly payload = signal<ClipboardPayload | null>(null);

  set(payload: ClipboardPayload | null): void {
    this.payload.set(
      payload
        ? {
            nodes: payload.nodes.map((n) => structuredClone(n)),
            edges: payload.edges.map((e) => structuredClone(e)),
          }
        : null,
    );
  }

  clear(): void {
    this.payload.set(null);
  }
}
