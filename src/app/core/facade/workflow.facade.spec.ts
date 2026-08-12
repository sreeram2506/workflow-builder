import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WorkflowFacade } from './workflow.facade';
import { RunSimulationService } from '../run/run-simulation.service';
import { GraphStore } from '../stores/graph.store';

describe('WorkflowFacade.createNode', () => {
  let facade: WorkflowFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(WorkflowFacade);
    facade.initialize();
  });

  it('appends a node, selects it, and does not open properties side-effects', () => {
    const before = facade.nodeCount();
    const id = facade.createNode('Delay', { x: 100, y: 200 });
    expect(id).toBeTruthy();
    expect(facade.nodeCount()).toBe(before + 1);
    expect(facade.selection().nodeIds).toEqual([id]);
    const created = facade.nodes().find((n) => n.id === id);
    expect(created?.type).toBe('Delay');
    expect(created?.status).toBe('idle');
    expect(created?.position).toEqual({ x: 100, y: 200 });
    // Properties panel expands when a single node is selected (U5 / UX)
    expect(facade.rightSidebarCollapsed()).toBe(false);
  });

  it('creates at viewport center via click-to-add helper', () => {
    facade.setViewSize({ w: 800, h: 600 });
    const id = facade.createNodeAtViewportCenter('Trigger');
    expect(id).toBeTruthy();
    const created = facade.nodes().find((n) => n.id === id)!;
    // screen (400,300) with default viewport {0,0,1}
    expect(created.position).toEqual({ x: 400, y: 300 });
  });
});

describe('WorkflowFacade.createEdge', () => {
  let facade: WorkflowFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(WorkflowFacade);
    facade.initialize();
  });

  it('creates edge between seed nodes and selects it', () => {
    const before = facade.edgeCount();
    const id = facade.createEdge('n-trigger', 'n-end');
    expect(id).toBeTruthy();
    expect(facade.edgeCount()).toBe(before + 1);
    expect(facade.selection().edgeIds).toEqual([id]);
    expect(facade.selectionFocusEdgeId()).toBe(id);
    const edge = facade.edges().find((e) => e.id === id)!;
    expect(edge.waypoints).toEqual([]);
    expect(edge.label).toBe('');
  });

  it('rejects self-loop', () => {
    const before = facade.edgeCount();
    expect(facade.createEdge('n-action', 'n-action')).toBeNull();
    expect(facade.edgeCount()).toBe(before);
  });

  it('adds and removes waypoints', () => {
    const edgeId = facade.edges()[0].id;
    const idx = facade.addWaypoint(edgeId, { x: 17, y: 31 });
    expect(idx).toBe(0);
    const edge = facade.edges().find((e) => e.id === edgeId)!;
    expect(edge.waypoints[0]).toEqual({ x: 16, y: 32 });
    facade.removeWaypoint(edgeId, 0);
    expect(facade.edges().find((e) => e.id === edgeId)!.waypoints).toEqual([]);
  });
});

describe('WorkflowFacade.patchNode', () => {
  let facade: WorkflowFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(WorkflowFacade);
    facade.initialize();
  });

  it('patches label and nested configuration data', () => {
    facade.selectNodes(['n-action']);
    expect(facade.selectionFocusNodeId()).toBe('n-action');
    const ok = facade.patchNode('n-action', {
      label: 'Renamed Action',
      data: {
        config: { data: { ignore_keys_in_paragraph: false } },
      },
    });
    expect(ok).toBe(true);
    const node = facade.nodes().find((n) => n.id === 'n-action')!;
    expect(node.label).toBe('Renamed Action');
    expect((node.data as { config: { data: { ignore_keys_in_paragraph: boolean } } }).config.data
      .ignore_keys_in_paragraph).toBe(false);
  });

  it('no-ops for missing node', () => {
    expect(facade.patchNode('missing', { label: 'x' })).toBe(false);
  });

  it('sets focus to most recently toggled node', () => {
    facade.selectNodes(['n-trigger']);
    facade.toggleNodeSelection('n-action');
    expect(facade.selectionFocusNodeId()).toBe('n-action');
    expect(facade.selection().nodeIds).toEqual(['n-trigger', 'n-action']);
  });

  it('patches edge label and focuses edge on select', () => {
    facade.selectEdges(['e1']);
    expect(facade.selectionFocusEdgeId()).toBe('e1');
    expect(facade.selectionFocusNodeId()).toBeNull();
    expect(facade.patchEdge('e1', { label: 'Happy path' })).toBe(true);
    expect(facade.edges().find((e) => e.id === 'e1')!.label).toBe('Happy path');
  });
});

describe('WorkflowFacade.layoutAndRoute', () => {
  let facade: WorkflowFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(WorkflowFacade);
    facade.initialize();
  });

  it('routeEdges replaces waypoints without throwing', () => {
    facade.routeEdges();
    for (const e of facade.edges()) {
      expect(Array.isArray(e.waypoints)).toBe(true);
    }
  });

  it('applyLayout repositions nodes, routes, and fits', () => {
    facade.applyLayout('layered', 800, 600);
    const nodes = facade.nodes();
    expect(nodes.every((n) => Number.isFinite(n.position.x) && Number.isFinite(n.position.y))).toBe(
      true,
    );
    expect(Number.isFinite(facade.viewport().scale)).toBe(true);
  });
});

describe('WorkflowFacade.historyAndClipboard', () => {
  let facade: WorkflowFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(WorkflowFacade);
    facade.initialize();
  });

  it('undo restores after createNode', () => {
    const before = facade.nodeCount();
    facade.createNode('Delay', { x: 10, y: 10 });
    expect(facade.nodeCount()).toBe(before + 1);
    expect(facade.canUndo()).toBe(true);
    facade.undo();
    expect(facade.nodeCount()).toBe(before);
  });

  it('importJson rejects invalid and preserves graph', () => {
    const before = facade.nodeCount();
    const err = facade.importJson('{not-json');
    expect(err).toBeTruthy();
    expect(facade.nodeCount()).toBe(before);
  });

  it('copy and paste duplicates selected nodes', () => {
    facade.selectNodes(['n-trigger']);
    facade.copySelection();
    const before = facade.nodeCount();
    facade.pasteClipboard();
    expect(facade.nodeCount()).toBe(before + 1);
  });

  it('deleteNodes removes node and incident edges', () => {
    const beforeNodes = facade.nodeCount();
    const beforeEdges = facade.edgeCount();
    facade.deleteNodes(['n-action']);
    expect(facade.nodeCount()).toBe(beforeNodes - 1);
    expect(facade.nodes().some((n) => n.id === 'n-action')).toBe(false);
    expect(facade.edgeCount()).toBeLessThan(beforeEdges);
  });
});

describe('WorkflowFacade.runAndViewMode', () => {
  let facade: WorkflowFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(WorkflowFacade);
    facade.initialize();
  });

  it('startRun then stopRun clears runActive and leaves statuses', () => {
    const sim = TestBed.inject(RunSimulationService);
    vi.spyOn(sim, 'resolveStepDelayMs').mockReturnValue(10_000);

    facade.startRun();
    expect(facade.runActive()).toBe(true);
    facade.stopRun();
    expect(facade.runActive()).toBe(false);
    expect(facade.nodes().some((n) => n.status !== 'idle')).toBe(true);
  });

  it('resetStatuses sets all idle', () => {
    const sim = TestBed.inject(RunSimulationService);
    vi.spyOn(sim, 'resolveStepDelayMs').mockReturnValue(10_000);
    facade.startRun();
    facade.stopRun();
    facade.resetStatuses();
    expect(facade.nodes().every((n) => n.status === 'idle')).toBe(true);
  });

  it('view mode blocks mutate but allows startRun', () => {
    const sim = TestBed.inject(RunSimulationService);
    vi.spyOn(sim, 'resolveStepDelayMs').mockReturnValue(10_000);

    facade.setEditorMode('view');
    expect(facade.editorMode()).toBe('view');
    const before = facade.nodeCount();
    expect(facade.createNode('Delay', { x: 1, y: 1 })).toBeNull();
    expect(facade.nodeCount()).toBe(before);

    facade.startRun();
    expect(facade.runActive()).toBe(true);
    facade.stopRun();
  });

  it('mode switch stops active run', () => {
    const sim = TestBed.inject(RunSimulationService);
    vi.spyOn(sim, 'resolveStepDelayMs').mockReturnValue(10_000);

    facade.startRun();
    expect(facade.runActive()).toBe(true);
    facade.setEditorMode('view');
    expect(facade.runActive()).toBe(false);
  });

  it('empty document soft-fails with canvasStatus', () => {
    const graph = TestBed.inject(GraphStore);
    const empty = {
      ...facade.document()!,
      nodes: [],
      edges: [],
    };
    graph.setDocument(empty, { skipHistory: true, skipAutosave: true });
    facade.startRun();
    expect(facade.runActive()).toBe(false);
    expect(facade.canvasStatus()).toBe('Nothing to run');
  });
});
