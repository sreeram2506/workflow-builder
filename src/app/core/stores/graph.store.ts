import { Injectable, inject, signal } from '@angular/core';
import { lockEdgePortSides } from '../domain/connection.math';
import type { Point } from '../domain/viewport.math';
import type { Viewport, WorkflowDocument, WorkflowEdge, WorkflowNode } from '../domain/workflow.models';
import { AutoSaveService } from '../history/autosave.service';
import { HistoryService } from '../history/history.service';

export interface GraphWriteOptions {
  skipHistory?: boolean;
  skipAutosave?: boolean;
  /** When true, do not flip `saved` → `draft` on this write. */
  skipDirtyStatus?: boolean;
  /** When true, do not mark host `dirty` (viewport pan). */
  skipHostDirty?: boolean;
}

@Injectable({ providedIn: 'root' })
export class GraphStore {
  private readonly history = inject(HistoryService);
  private readonly autoSave = inject(AutoSaveService);

  readonly document = signal<WorkflowDocument | null>(null);

  setDocument(doc: WorkflowDocument, options: GraphWriteOptions = {}): void {
    this.commit(doc, options);
  }

  clear(): void {
    this.document.set(null);
  }

  setViewport(viewport: Viewport): void {
    const doc = this.document();
    if (!doc) {
      return;
    }
    // Viewport-only: skip history and host dirty (pan is not a committed graph edit).
    this.commit({ ...doc, viewport: { ...viewport } }, { skipHistory: true, skipHostDirty: true });
  }

  moveNodes(ids: readonly string[], delta: { x: number; y: number }): void {
    const doc = this.document();
    if (!doc || ids.length === 0) {
      return;
    }
    const idSet = new Set(ids);
    // Lock port sides on current geometry before moving so edges follow fixed handles.
    const edges = doc.edges.map((e) => lockEdgePortSides(e, doc.nodes));
    const nodes: WorkflowNode[] = doc.nodes.map((n) =>
      idSet.has(n.id)
        ? { ...n, position: { x: n.position.x + delta.x, y: n.position.y + delta.y } }
        : n,
    );
    this.commit({ ...doc, nodes, edges });
  }

  addNode(node: WorkflowNode): void {
    const doc = this.document();
    if (!doc) {
      return;
    }
    this.commit({
      ...doc,
      nodes: [...doc.nodes, { ...node, position: { ...node.position }, data: { ...node.data } }],
    });
  }

  addNodesAndEdges(nodes: readonly WorkflowNode[], edges: readonly WorkflowEdge[]): void {
    const doc = this.document();
    if (!doc || (nodes.length === 0 && edges.length === 0)) {
      return;
    }
    this.commit({
      ...doc,
      nodes: [
        ...doc.nodes,
        ...nodes.map((n) => ({
          ...n,
          position: { ...n.position },
          data: structuredClone(n.data) as Record<string, unknown>,
        })),
      ],
      edges: [
        ...doc.edges,
        ...edges.map((e) => ({
          ...e,
          label: e.label ?? '',
          waypoints: e.waypoints.map((p) => ({ ...p })),
        })),
      ],
    });
  }

  addEdge(edge: WorkflowEdge): void {
    const doc = this.document();
    if (!doc) {
      return;
    }
    this.commit({
      ...doc,
      edges: [
        ...doc.edges,
        {
          ...edge,
          label: edge.label ?? '',
          waypoints: edge.waypoints.map((p) => ({ ...p })),
        },
      ],
    });
  }

  removeEdges(ids: readonly string[]): void {
    const doc = this.document();
    if (!doc || ids.length === 0) {
      return;
    }
    const idSet = new Set(ids);
    this.commit({
      ...doc,
      edges: doc.edges.filter((e) => !idSet.has(e.id)),
    });
  }

  /** Remove nodes and any edges connected to them. */
  removeNodes(ids: readonly string[]): void {
    const doc = this.document();
    if (!doc || ids.length === 0) {
      return;
    }
    const idSet = new Set(ids);
    this.commit({
      ...doc,
      nodes: doc.nodes.filter((n) => !idSet.has(n.id)),
      edges: doc.edges.filter((e) => !idSet.has(e.source) && !idSet.has(e.target)),
    });
  }

  setEdgeWaypoints(edgeId: string, waypoints: readonly Point[]): void {
    const doc = this.document();
    if (!doc) {
      return;
    }
    this.commit({
      ...doc,
      edges: doc.edges.map((e) =>
        e.id === edgeId ? { ...e, waypoints: waypoints.map((p) => ({ ...p })) } : e,
      ),
    });
  }

  setNodePositions(positions: ReadonlyMap<string, Point>): void {
    const doc = this.document();
    if (!doc || positions.size === 0) {
      return;
    }
    this.commit({
      ...doc,
      nodes: doc.nodes.map((n) => {
        const p = positions.get(n.id);
        return p ? { ...n, position: { x: p.x, y: p.y }, data: { ...n.data } } : n;
      }),
    });
  }

  setAllEdgeWaypoints(byEdgeId: ReadonlyMap<string, readonly Point[]>): void {
    const doc = this.document();
    if (!doc || byEdgeId.size === 0) {
      return;
    }
    this.commit({
      ...doc,
      edges: doc.edges.map((e) => {
        const wp = byEdgeId.get(e.id);
        return wp
          ? { ...e, waypoints: wp.map((p) => ({ ...p })) }
          : { ...e, waypoints: e.waypoints.map((p) => ({ ...p })) };
      }),
    });
  }

  patchNode(
    id: string,
    partial: Partial<Pick<WorkflowNode, 'label' | 'subtitle' | 'status' | 'data'>>,
  ): void {
    const doc = this.document();
    if (!doc) {
      return;
    }
    let found = false;
    const nodes: WorkflowNode[] = doc.nodes.map((n) => {
      if (n.id !== id) {
        return n;
      }
      found = true;
      return {
        ...n,
        label: partial.label !== undefined ? partial.label : n.label,
        subtitle: partial.subtitle !== undefined ? partial.subtitle : n.subtitle,
        status: partial.status !== undefined ? partial.status : n.status,
        data: partial.data !== undefined ? { ...partial.data } : { ...n.data },
        position: { ...n.position },
      };
    });
    if (!found) {
      return;
    }
    this.commit({ ...doc, nodes });
  }

  /** Batch status updates (U8 Run / Reset). Prefer `skipHistory: true` for simulation. */
  patchNodeStatuses(
    updates: Readonly<Record<string, WorkflowNode['status']>> | ReadonlyMap<string, WorkflowNode['status']>,
    options: GraphWriteOptions = {},
  ): void {
    const doc = this.document();
    if (!doc) {
      return;
    }
    const map =
      updates instanceof Map ? updates : new Map(Object.entries(updates) as [string, WorkflowNode['status']][]);
    if (map.size === 0) {
      return;
    }
    let changed = false;
    const nodes: WorkflowNode[] = doc.nodes.map((n) => {
      const status = map.get(n.id);
      if (status === undefined) {
        return n;
      }
      changed = true;
      return {
        ...n,
        status,
        position: { ...n.position },
        data: { ...n.data },
      };
    });
    if (!changed) {
      return;
    }
    this.commit({ ...doc, nodes }, options);
  }

  patchEdge(id: string, partial: Partial<Pick<WorkflowEdge, 'label' | 'condition'>>): void {
    const doc = this.document();
    if (!doc) {
      return;
    }
    let found = false;
    const edges: WorkflowEdge[] = doc.edges.map((e) => {
      if (e.id !== id) {
        return e;
      }
      found = true;
      return {
        ...e,
        label: partial.label !== undefined ? partial.label : e.label,
        condition: partial.condition !== undefined ? partial.condition : (e.condition ?? ''),
        waypoints: e.waypoints.map((p) => ({ ...p })),
      };
    });
    if (!found) {
      return;
    }
    this.commit({ ...doc, edges });
  }

  private commit(next: WorkflowDocument, options: GraphWriteOptions = {}): void {
    let doc = next;
    // Content edits after Save return the badge to draft (viewport/run/swap use skipHistory).
    if (!options.skipHistory && !options.skipDirtyStatus && doc.status === 'saved') {
      doc = {
        ...doc,
        status: 'draft',
        updatedAt: new Date().toISOString(),
      };
    }
    const current = this.document();
    if (!options.skipHistory && current) {
      this.history.recordBeforeMutation(current);
    }
    this.document.set(doc);
    if (!options.skipAutosave) {
      this.autoSave.notifyMutation();
      if (!options.skipHostDirty) {
        this.autoSave.markHostDirty();
      }
    }
  }
}
