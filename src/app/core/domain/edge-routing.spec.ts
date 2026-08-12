import { describe, expect, it } from 'vitest';
import { routeAllEdges, routeEdge } from './edge-routing';
import type { WorkflowEdge, WorkflowNode } from './workflow.models';

function node(id: string, x: number, y: number): WorkflowNode {
  return {
    id,
    type: 'Action',
    label: id,
    subtitle: '',
    position: { x, y },
    status: 'idle',
    data: {},
  };
}

function edge(id: string, source: string, target: string): WorkflowEdge {
  return { id, source, target, label: '', waypoints: [{ x: 1, y: 1 }] };
}

describe('edge-routing', () => {
  it('routes a clear horizontal pair without fallback', () => {
    const nodes = [node('a', 0, 0), node('b', 400, 0)];
    const e = edge('e1', 'a', 'b');
    const r = routeEdge(e, nodes, { gridSize: 16, obstaclePadding: 8 });
    expect(r.usedFallback).toBe(false);
    expect(Array.isArray(r.waypoints)).toBe(true);
  });

  it('falls back when endpoints missing', () => {
    const r = routeEdge(edge('e1', 'missing', 'b'), [node('b', 100, 0)]);
    expect(r.usedFallback).toBe(true);
    expect(r.waypoints).toEqual([]);
  });

  it('routeAllEdges replaces waypoints and reports fallback aggregate', () => {
    const nodes = [node('a', 0, 0), node('b', 320, 0), node('c', 160, 0)];
    const edges = [edge('e1', 'a', 'b'), edge('e2', 'missing', 'c')];
    const all = routeAllEdges(edges, nodes);
    expect(all.byEdgeId.get('e1')).toBeDefined();
    expect(all.byEdgeId.get('e2')).toEqual([]);
    expect(all.anyFallback).toBe(true);
  });
});
