import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  WAYPOINT_GRID,
  arePortsCompatible,
  createWorkflowEdge,
  edgeRenderPoints,
  findConnectionTargetAt,
  isValidCreatedEdgeId,
  lockEdgePortSides,
  portRole,
  resolveConnection,
  snapToGrid,
  validateConnection,
} from './connection.math';
import type { WorkflowNode } from './workflow.models';

const sampleNodes: WorkflowNode[] = [
  {
    id: 'a',
    type: 'Trigger',
    label: 'A',
    subtitle: '',
    position: { x: 0, y: 0 },
    status: 'idle',
    data: {},
  },
  {
    id: 'b',
    type: 'Action',
    label: 'B',
    subtitle: '',
    position: { x: 200, y: 0 },
    status: 'idle',
    data: {},
  },
];

describe('connection.math', () => {
  it('rejects self-loop and missing nodes', () => {
    expect(validateConnection('a', 'a', sampleNodes).ok).toBe(false);
    expect(validateConnection('a', 'missing', sampleNodes).ok).toBe(false);
    expect(validateConnection('a', 'b', sampleNodes).ok).toBe(true);
  });

  it('never connects to right; allows input→input and right→input', () => {
    expect(portRole('right')).toBe('out');
    expect(arePortsCompatible('right', 'left')).toBe(true);
    expect(arePortsCompatible('right', 'top')).toBe(true);
    expect(arePortsCompatible('top', 'left')).toBe(true);
    expect(arePortsCompatible('left', 'bottom')).toBe(true);
    expect(arePortsCompatible('top', 'top')).toBe(true);
    expect(arePortsCompatible('right', 'right')).toBe(false);
    expect(arePortsCompatible('left', 'right')).toBe(false);
    expect(arePortsCompatible('top', 'right')).toBe(false);
  });

  it('resolveConnection rejects landing on output', () => {
    expect(resolveConnection('a', 'right', 'b', 'right')).toBeNull();
    expect(resolveConnection('a', 'top', 'b', 'right')).toBeNull();
    expect(resolveConnection('a', 'top', 'b', 'left')).toEqual({
      sourceId: 'a',
      targetId: 'b',
      sourceSide: 'top',
      targetSide: 'left',
    });
    expect(resolveConnection('a', 'right', 'b', 'bottom')).toEqual({
      sourceId: 'a',
      targetId: 'b',
      sourceSide: 'right',
      targetSide: 'bottom',
    });
  });

  it('createWorkflowEdge stores port sides when provided', () => {
    const e1 = createWorkflowEdge('a', 'b', sampleNodes, {
      sourceSide: 'top',
      targetSide: 'left',
    });
    expect(e1).not.toBeNull();
    expect(e1!.sourceSide).toBe('top');
    expect(e1!.targetSide).toBe('left');
    expect(isValidCreatedEdgeId(e1!.id, 'a', 'b')).toBe(true);
  });

  it('createWorkflowEdge rejects connect-to-output', () => {
    expect(
      createWorkflowEdge('a', 'b', sampleNodes, {
        sourceSide: 'right',
        targetSide: 'right',
      }),
    ).toBeNull();
  });

  it('createWorkflowEdge allows duplicates and sets empty waypoints', () => {
    const e1 = createWorkflowEdge('a', 'b', sampleNodes);
    const e2 = createWorkflowEdge('a', 'b', sampleNodes);
    expect(e1).not.toBeNull();
    expect(e2).not.toBeNull();
    expect(e1!.waypoints).toEqual([]);
    expect(e1!.condition).toBe('');
    expect(e1!.sourceSide).toBeDefined();
    expect(e1!.targetSide).toBeDefined();
    expect(isValidCreatedEdgeId(e1!.id, 'a', 'b')).toBe(true);
  });

  it('edgeRenderPoints keeps persisted sides while positions change', () => {
    const nodes: WorkflowNode[] = [
      {
        id: 'a',
        type: 'Action',
        label: 'A',
        subtitle: '',
        position: { x: 0, y: 0 },
        status: 'idle',
        data: {},
      },
      {
        id: 'b',
        type: 'Action',
        label: 'B',
        subtitle: '',
        position: { x: 0, y: 300 },
        status: 'idle',
        data: {},
      },
    ];
    const edge = createWorkflowEdge('a', 'b', nodes, {
      sourceSide: 'right',
      targetSide: 'top',
    })!;
    const moved = [
      nodes[0]!,
      { ...nodes[1]!, position: { x: 400, y: 80 } },
    ];
    const pts = edgeRenderPoints(edge, moved)!;
    expect(pts.start).toEqual({ x: 220, y: 36 });
    expect(pts.end).toEqual({ x: 510, y: 80 });
  });

  it('lockEdgePortSides does not retarget once locked', () => {
    const edge = {
      id: 'e1',
      source: 'a',
      target: 'b',
      label: '',
      condition: '',
      waypoints: [] as { x: number; y: number }[],
      sourceSide: 'top' as const,
      targetSide: 'bottom' as const,
    };
    const locked = lockEdgePortSides(edge, sampleNodes);
    expect(locked.sourceSide).toBe('top');
    expect(locked.targetSide).toBe('bottom');
  });

  it('findConnectionTargetAt body drop prefers an input port', () => {
    const nodes: WorkflowNode[] = [
      {
        id: 'a',
        type: 'Action',
        label: 'A',
        subtitle: '',
        position: { x: 0, y: 0 },
        status: 'idle',
        data: {},
      },
      {
        id: 'b',
        type: 'Action',
        label: 'B',
        subtitle: '',
        position: { x: 300, y: 0 },
        status: 'idle',
        data: {},
      },
    ];
    const hit = findConnectionTargetAt({ x: 360, y: 36 }, nodes, 'a', 'top');
    expect(hit).not.toBeNull();
    expect(hit!.id).toBe('b');
    expect(['left', 'top', 'bottom']).toContain(hit!.side);
  });

  it('Condition diamond upper tip snaps to top (not left/right)', () => {
    const nodes: WorkflowNode[] = [
      {
        id: 'src',
        type: 'Action',
        label: 'Src',
        subtitle: '',
        position: { x: 0, y: 0 },
        status: 'idle',
        data: {},
      },
      {
        id: 'cond',
        type: 'Condition',
        label: 'Condition',
        subtitle: '',
        position: { x: 200, y: 200 },
        status: 'idle',
        data: {},
      },
    ];
    // Upper tip / flank of 96×96 diamond — Euclidean used to prefer left
    const topHit = findConnectionTargetAt({ x: 248, y: 208 }, nodes, 'src', 'right');
    expect(topHit).toEqual({ id: 'cond', side: 'top' });
    const bottomHit = findConnectionTargetAt({ x: 248, y: 288 }, nodes, 'src', 'right');
    expect(bottomHit).toEqual({ id: 'cond', side: 'bottom' });
  });
});

describe('connection.math PBT', () => {
  it('snapToGrid yields multiples of grid', () => {
    fc.assert(
      fc.property(
        fc.record({
          x: fc.integer({ min: -2000, max: 2000 }),
          y: fc.integer({ min: -2000, max: 2000 }),
        }),
        (p) => {
          const s = snapToGrid(p, WAYPOINT_GRID);
          expect(Math.abs(s.x % WAYPOINT_GRID)).toBe(0);
          expect(Math.abs(s.y % WAYPOINT_GRID)).toBe(0);
        },
      ),
      { numRuns: 40 },
    );
  });

  it('validateConnection never allows self-loops for existing ids', () => {
    fc.assert(
      fc.property(fc.constantFrom('a', 'b'), (id) => {
        expect(validateConnection(id, id, sampleNodes).ok).toBe(false);
      }),
      { numRuns: 10 },
    );
  });
});
