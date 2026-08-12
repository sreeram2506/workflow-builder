import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { computeRunOrder, findRunSeeds } from './run-order';
import type { WorkflowDocument, WorkflowEdge, WorkflowNode } from './workflow.models';

function node(id: string, type: WorkflowNode['type'] = 'Action'): WorkflowNode {
  return {
    id,
    type,
    label: id,
    subtitle: '',
    position: { x: 0, y: 0 },
    status: 'idle',
    data: {},
  };
}

function doc(nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowDocument {
  return {
    id: 'w',
    name: 't',
    status: 'draft',
    version: 1,
    updatedAt: '2026-01-01T00:00:00.000Z',
    viewport: { x: 0, y: 0, scale: 1 },
    nodes,
    edges,
  };
}

describe('run-order', () => {
  it('BFS from Trigger along chain', () => {
    const d = doc(
      [node('t', 'Trigger'), node('a'), node('b'), node('e', 'End')],
      [
        { id: 'e1', source: 't', target: 'a', label: '', waypoints: [] },
        { id: 'e2', source: 'a', target: 'b', label: '', waypoints: [] },
        { id: 'e3', source: 'b', target: 'e', label: '', waypoints: [] },
      ],
    );
    expect(findRunSeeds(d)).toEqual(['t']);
    expect(computeRunOrder(d)).toEqual(['t', 'a', 'b', 'e']);
  });

  it('includes indegree-0 non-Trigger seeds', () => {
    const d = doc(
      [node('root'), node('child')],
      [{ id: 'e1', source: 'root', target: 'child', label: '', waypoints: [] }],
    );
    expect(findRunSeeds(d)).toEqual(['root']);
    expect(computeRunOrder(d)).toEqual(['root', 'child']);
  });

  it('returns empty order for empty graph', () => {
    expect(computeRunOrder(doc([], []))).toEqual([]);
  });

  it('returns empty when only a cycle (no Trigger, no indegree-0)', () => {
    const d = doc(
      [node('a'), node('b')],
      [
        { id: 'e1', source: 'a', target: 'b', label: '', waypoints: [] },
        { id: 'e2', source: 'b', target: 'a', label: '', waypoints: [] },
      ],
    );
    expect(findRunSeeds(d)).toEqual([]);
    expect(computeRunOrder(d)).toEqual([]);
  });

  it('PBT: order ⊆ node ids; non-seeds have predecessor earlier in prefix', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 12 }),
        fc.array(fc.tuple(fc.nat(), fc.nat()), { minLength: 0, maxLength: 20 }),
        (n, edgePairs) => {
          const nodes: WorkflowNode[] = Array.from({ length: n }, (_, i) =>
            node(`n${i}`, i === 0 ? 'Trigger' : 'Action'),
          );
          const edges: WorkflowEdge[] = [];
          const seen = new Set<string>();
          for (const [a, b] of edgePairs) {
            const s = `n${a % n}`;
            const t = `n${b % n}`;
            if (s === t) {
              continue;
            }
            const key = `${s}->${t}`;
            if (seen.has(key)) {
              continue;
            }
            seen.add(key);
            edges.push({ id: key, source: s, target: t, label: '', waypoints: [] });
          }
          const d = doc(nodes, edges);
          const order = computeRunOrder(d);
          const idSet = new Set(nodes.map((x) => x.id));
          for (const id of order) {
            expect(idSet.has(id)).toBe(true);
          }
          expect(new Set(order).size).toBe(order.length);

          const seeds = new Set(findRunSeeds(d));
          const preds = new Map<string, string[]>();
          for (const e of edges) {
            const list = preds.get(e.target) ?? [];
            list.push(e.source);
            preds.set(e.target, list);
          }
          for (let i = 0; i < order.length; i++) {
            const id = order[i]!;
            if (seeds.has(id)) {
              continue;
            }
            const earlier = new Set(order.slice(0, i));
            const parents = preds.get(id) ?? [];
            const hasPred = parents.some((p) => earlier.has(p));
            expect(hasPred).toBe(true);
          }
        },
      ),
      { numRuns: 40 },
    );
  });
});
