import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  applyLayoutMode,
  layeredRanks,
  layoutHorizontal,
  layoutLayered,
  layoutVertical,
} from './layout.math';
import type { WorkflowEdge, WorkflowNode } from './workflow.models';

function node(id: string, x = 0, y = 0, type: WorkflowNode['type'] = 'Action'): WorkflowNode {
  return {
    id,
    type,
    label: id,
    subtitle: '',
    position: { x, y },
    status: 'idle',
    data: {},
  };
}

function edge(id: string, source: string, target: string): WorkflowEdge {
  return { id, source, target, label: '', waypoints: [] };
}

describe('layout.math', () => {
  it('vertical/horizontal/layered produce finite positions for sample graph', () => {
    const nodes = [
      node('a', 10, 10, 'Trigger'),
      node('b', 200, 80),
      node('c', 400, 20, 'End'),
    ];
    const edges = [edge('e1', 'a', 'b'), edge('e2', 'b', 'c')];

    for (const mode of ['vertical', 'horizontal', 'layered'] as const) {
      const pos = applyLayoutMode(mode, nodes, edges);
      expect(pos.size).toBe(3);
      for (const p of pos.values()) {
        expect(Number.isFinite(p.x)).toBe(true);
        expect(Number.isFinite(p.y)).toBe(true);
      }
    }
  });

  it('vertical stacks increasing Y', () => {
    const nodes = [node('a'), node('b'), node('c')];
    const pos = layoutVertical(nodes);
    expect(pos.get('a')!.y).toBeLessThan(pos.get('b')!.y);
    expect(pos.get('b')!.y).toBeLessThan(pos.get('c')!.y);
  });

  it('horizontal packs increasing X', () => {
    const nodes = [node('a'), node('b'), node('c')];
    const pos = layoutHorizontal(nodes);
    expect(pos.get('a')!.x).toBeLessThan(pos.get('b')!.x);
    expect(pos.get('b')!.x).toBeLessThan(pos.get('c')!.x);
  });

  it('layered places trigger seed left of dependents', () => {
    const nodes = [node('t', 0, 0, 'Trigger'), node('a', 0, 0), node('e', 0, 0, 'End')];
    const edges = [edge('e1', 't', 'a'), edge('e2', 'a', 'e')];
    const pos = layoutLayered(nodes, edges);
    expect(pos.get('t')!.x).toBeLessThan(pos.get('a')!.x);
    expect(pos.get('a')!.x).toBeLessThan(pos.get('e')!.x);
  });

  it('PBT: all laid-out positions are finite', () => {
    const nodeArb = fc.record({
      id: fc.stringMatching(/^n[0-9a-z]{1,4}$/),
      type: fc.constantFrom('Trigger', 'Action', 'End') as fc.Arbitrary<WorkflowNode['type']>,
      x: fc.integer({ min: -200, max: 800 }),
      y: fc.integer({ min: -200, max: 800 }),
    });

    fc.assert(
      fc.property(fc.array(nodeArb, { minLength: 1, maxLength: 8 }), (raw) => {
        const seen = new Set<string>();
        const nodes: WorkflowNode[] = [];
        for (const r of raw) {
          if (seen.has(r.id)) {
            continue;
          }
          seen.add(r.id);
          nodes.push(node(r.id, r.x, r.y, r.type));
        }
        if (nodes.length === 0) {
          return;
        }
        for (const mode of ['vertical', 'horizontal', 'layered'] as const) {
          const pos = applyLayoutMode(mode, nodes, []);
          expect(pos.size).toBe(nodes.length);
          for (const p of pos.values()) {
            expect(Number.isFinite(p.x)).toBe(true);
            expect(Number.isFinite(p.y)).toBe(true);
          }
        }
      }),
    );
  });

  it('PBT: layered ranks non-decreasing along edges on chains (acyclic)', () => {
    fc.assert(
      fc.property(fc.integer({ min: 2, max: 6 }), (n) => {
        const nodes: WorkflowNode[] = Array.from({ length: n }, (_, i) =>
          node(`n${i}`, i * 10, 0, i === 0 ? 'Trigger' : i === n - 1 ? 'End' : 'Action'),
        );
        const edges: WorkflowEdge[] = Array.from({ length: n - 1 }, (_, i) =>
          edge(`e${i}`, `n${i}`, `n${i + 1}`),
        );
        const ranks = layeredRanks(nodes, edges);
        for (const e of edges) {
          expect(ranks.get(e.target)!).toBeGreaterThanOrEqual(ranks.get(e.source)!);
        }
      }),
    );
  });
});
