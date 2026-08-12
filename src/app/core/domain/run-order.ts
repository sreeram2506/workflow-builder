/**
 * Pure BFS run-order helpers for simulated Run (U8).
 * Seeds = nodes with type === 'Trigger' ∪ nodes with indegree 0.
 * Walk: BFS from all seeds along outgoing edges; each node visited once.
 */

import type { WorkflowDocument, WorkflowEdge, WorkflowNode } from './workflow.models';

function outgoingBySource(edges: readonly WorkflowEdge[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const e of edges) {
    const list = map.get(e.source);
    if (list) {
      list.push(e.target);
    } else {
      map.set(e.source, [e.target]);
    }
  }
  return map;
}

function indegreeMap(nodes: readonly WorkflowNode[], edges: readonly WorkflowEdge[]): Map<string, number> {
  const deg = new Map<string, number>();
  for (const n of nodes) {
    deg.set(n.id, 0);
  }
  for (const e of edges) {
    if (!deg.has(e.target)) {
      continue;
    }
    deg.set(e.target, (deg.get(e.target) ?? 0) + 1);
  }
  return deg;
}

/** Trigger-type nodes and/or indegree-0 nodes present in the document. */
export function findRunSeeds(doc: WorkflowDocument): string[] {
  const indeg = indegreeMap(doc.nodes, doc.edges);
  const seeds: string[] = [];
  const seen = new Set<string>();
  for (const n of doc.nodes) {
    const isTrigger = n.type === 'Trigger';
    const isRoot = (indeg.get(n.id) ?? 0) === 0;
    if ((isTrigger || isRoot) && !seen.has(n.id)) {
      seen.add(n.id);
      seeds.push(n.id);
    }
  }
  return seeds;
}

/**
 * BFS order from seeds. Empty if no seeds (or empty graph).
 * Nodes unreachable from seeds are omitted.
 */
export function computeRunOrder(doc: WorkflowDocument): string[] {
  if (doc.nodes.length === 0) {
    return [];
  }
  const seeds = findRunSeeds(doc);
  if (seeds.length === 0) {
    return [];
  }
  const out = outgoingBySource(doc.edges);
  const visited = new Set<string>();
  const order: string[] = [];
  const queue = [...seeds];

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) {
      continue;
    }
    visited.add(id);
    order.push(id);
    for (const target of out.get(id) ?? []) {
      if (!visited.has(target)) {
        queue.push(target);
      }
    }
  }
  return order;
}
