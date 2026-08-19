import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WorkflowFacade } from './workflow.facade';
import { RunSimulationService } from '../run/run-simulation.service';
import { GraphStore } from '../stores/graph.store';
import { MockWorkflowRepository } from '../data/mock-workflow.repository';
import { blankAgentPaletteItem } from '../domain/palette.catalog';
import { provideWorkflowBuilderUi } from '../ui-config';
import { routes } from '../../app.routes';

/** App boots empty; most facade specs still need the sample fixture graph. */
function initWithSample(facade: WorkflowFacade): void {
  facade.initialize();
  TestBed.inject(GraphStore).setDocument(
    TestBed.inject(MockWorkflowRepository).getSampleWorkflow(),
    { skipHistory: true, skipAutosave: true },
  );
}

describe('WorkflowFacade.createNode', () => {
  let facade: WorkflowFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    facade = TestBed.inject(WorkflowFacade);
    initWithSample(facade);
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

  it('returns workflow status to draft after an edit following Save', () => {
    facade.saveDownload();
    expect(facade.workflowStatus()).toBe('saved');
    expect(facade.canvasStatus()).toBe('Saved');
    facade.createNode('Delay', { x: 10, y: 20 });
    expect(facade.workflowStatus()).toBe('draft');
  });
});

describe('WorkflowFacade.createEdge', () => {
  let facade: WorkflowFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    facade = TestBed.inject(WorkflowFacade);
    initWithSample(facade);
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
    expect(edge.condition).toBe('');
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

  it('labels Condition outs true then false and rejects a third', () => {
    const condId = facade.createNode('Condition', { x: 10, y: 10 })!;
    const a = facade.createNode('Action', { x: 200, y: 10 })!;
    const b = facade.createNode('Action', { x: 200, y: 80 })!;
    const c = facade.createNode('Action', { x: 200, y: 160 })!;
    const first = facade.createEdge(condId, a);
    const second = facade.createEdge(condId, b);
    const third = facade.createEdge(condId, c);
    expect(facade.edges().find((e) => e.id === first)?.label).toBe('true');
    expect(facade.edges().find((e) => e.id === second)?.label).toBe('false');
    expect(third).toBeNull();
  });

  it('creates Router edges with Blank Condition and empty condition', () => {
    const id = facade.createEdge('n-router', 'n-end');
    expect(id).toBeTruthy();
    const edge = facade.edges().find((e) => e.id === id)!;
    expect(edge.label).toBe('Blank Condition');
    expect(edge.condition).toBe('');
  });

  it('rejects a third outgoing from the seeded Condition', () => {
    expect(facade.createEdge('n-condition', 'n-action')).toBeNull();
  });
});

describe('WorkflowFacade.patchNode', () => {
  let facade: WorkflowFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    facade = TestBed.inject(WorkflowFacade);
    initWithSample(facade);
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
    expect(facade.patchEdge('e6', { label: 'High severity', condition: 'sev > 3' })).toBe(true);
    const connector = facade.edges().find((e) => e.id === 'e6')!;
    expect(connector.label).toBe('High severity');
    expect(connector.condition).toBe('sev > 3');
  });
});

describe('WorkflowFacade.layoutAndRoute', () => {
  let facade: WorkflowFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    facade = TestBed.inject(WorkflowFacade);
    initWithSample(facade);
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
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    facade = TestBed.inject(WorkflowFacade);
    initWithSample(facade);
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
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    facade = TestBed.inject(WorkflowFacade);
    initWithSample(facade);
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

describe('WorkflowFacade.agentTabs', () => {
  let facade: WorkflowFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    facade = TestBed.inject(WorkflowFacade);
    initWithSample(facade);
  });

  it('opens a tab for Blank Agent and focuses without nesting', () => {
    const id = facade.createNode('AIAgent', { x: 40, y: 40 })!;
    facade.openAgentTab(id);
    expect(facade.agentTabs()).toHaveLength(1);
    expect(facade.focusedAgentTabId()).toBe(id);
    expect(facade.agentTabLabel(id)).toBe('Blank Agent');
  });

  it('does not duplicate a tab when opening the same agent twice', () => {
    const id = facade.createNode('AIAgent', { x: 40, y: 40 })!;
    facade.openAgentTab(id);
    facade.openAgentTab(id);
    expect(facade.agentTabs()).toHaveLength(1);
    expect(facade.focusedAgentTabId()).toBe(id);
  });

  it('reuses a palette Blank Agent instead of creating another tab', () => {
    facade.initialize();
    const item = blankAgentPaletteItem()!;
    const first = facade.createNodeFromPaletteItem(item, { x: 10, y: 10 });
    const second = facade.createNodeFromPaletteItem(item, { x: 80, y: 80 });
    expect(second).toBe(first);
    expect(facade.nodes().filter((n) => n.type === 'AIAgent')).toHaveLength(1);
    expect(facade.agentTabs()).toHaveLength(1);
    expect(facade.agentTabs()[0]?.nodeId).toBe(first);
  });

  it('allows chrome inset below the former 72px minimum', () => {
    facade.setChromeInsetTop(16);
    expect(facade.chromeInsetTop()).toBe(16);
  });

  it('ignores non-AIAgent openAgentTab', () => {
    const id = facade.createNode('Action', { x: 1, y: 1 })!;
    facade.openAgentTab(id);
    expect(facade.agentTabs()).toHaveLength(0);
  });

  it('FIFO-evicts oldest when opening a sixth tab', () => {
    const ids: string[] = [];
    for (let i = 0; i < 6; i++) {
      ids.push(facade.createNode('AIAgent', { x: i * 10, y: 0 })!);
      facade.openAgentTab(ids[i]!);
    }
    expect(facade.agentTabs()).toHaveLength(5);
    expect(facade.agentTabs().map((t) => t.nodeId)).not.toContain(ids[0]);
    expect(facade.agentTabs().map((t) => t.nodeId)).toContain(ids[5]);
  });

  it('closes tab and prunes on delete', () => {
    const id = facade.createNode('AIAgent', { x: 0, y: 0 })!;
    facade.openAgentTab(id);
    facade.closeAgentTab(id);
    expect(facade.agentTabs()).toHaveLength(0);
    const id2 = facade.createNode('AIAgent', { x: 5, y: 5 })!;
    facade.openAgentTab(id2);
    facade.deleteNodes([id2]);
    expect(facade.agentTabs()).toHaveLength(0);
  });

  it('allows open/close in view mode', () => {
    const id = facade.createNode('AIAgent', { x: 0, y: 0 })!;
    facade.setEditorMode('view');
    facade.openAgentTab(id);
    expect(facade.agentTabs()).toHaveLength(1);
    facade.closeAgentTab(id);
    expect(facade.agentTabs()).toHaveLength(0);
  });

  it('enterAgentCanvas swaps graph and persists nestedWorkflow on exit', () => {
    const id = facade.createNode('AIAgent', { x: 0, y: 0 })!;
    const solutionCount = facade.nodeCount();
    expect(facade.enterAgentCanvas(id)).toBe(true);
    expect(facade.editingAgentNodeId()).toBe(id);
    expect(facade.nodeCount()).toBe(0);
    facade.createNode('Action', { x: 5, y: 5 });
    expect(facade.nodeCount()).toBe(1);
    facade.exitAgentCanvas();
    expect(facade.editingAgentNodeId()).toBeNull();
    expect(facade.nodeCount()).toBe(solutionCount);
    const agent = facade.nodes().find((n) => n.id === id)!;
    const nested = (agent.data['nestedWorkflow'] as { nodes: unknown[] } | undefined)?.nodes;
    expect(nested).toHaveLength(1);
  });

  it('selectAgentTab opens tab and navigates to agent route', async () => {
    const id = facade.createNode('AIAgent', { x: 40, y: 40 })!;
    const router = TestBed.inject(Router);
    facade.selectAgentTab(id);
    await Promise.resolve();
    expect(facade.agentTabs()).toHaveLength(1);
    expect(router.url).toBe(`/agent/${id}`);
  });

  it('does not add chips when agent tab chrome is off', () => {
    facade.setAgentTabsChromeEnabled(false);
    const id = facade.createNode('AIAgent', { x: 40, y: 40 })!;
    facade.openAgentTab(id);
    expect(facade.agentTabs()).toHaveLength(0);
    const item = blankAgentPaletteItem()!;
    facade.createNodeFromPaletteItem(item, { x: 80, y: 80 });
    expect(facade.agentTabs()).toHaveLength(0);
  });

  it('selectAgentTab still navigates when agent tab chrome is off', async () => {
    facade.setAgentTabsChromeEnabled(false);
    const id = facade.createNode('AIAgent', { x: 40, y: 40 })!;
    const router = TestBed.inject(Router);
    facade.selectAgentTab(id);
    await Promise.resolve();
    expect(facade.agentTabs()).toHaveLength(0);
    expect(router.url).toBe(`/agent/${id}`);
  });

  it('selectAgentTab still navigates in view mode when chrome is off', async () => {
    const id = facade.createNode('AIAgent', { x: 40, y: 40 })!;
    facade.setEditorMode('view');
    facade.setAgentTabsChromeEnabled(false);
    const router = TestBed.inject(Router);
    facade.selectAgentTab(id);
    await Promise.resolve();
    expect(router.url).toBe(`/agent/${id}`);
    expect(facade.agentTabs()).toHaveLength(0);
  });

  it('enterAgentCanvas loads nested graph without chips when chrome is off', () => {
    facade.setAgentTabsChromeEnabled(false);
    const id = facade.createNode('AIAgent', { x: 0, y: 0 })!;
    expect(facade.enterAgentCanvas(id)).toBe(true);
    expect(facade.editingAgentNodeId()).toBe(id);
    expect(facade.agentTabs()).toHaveLength(0);
  });

  it('ensureAgentRoute redirects home when the agent is missing', async () => {
    const router = TestBed.inject(Router);
    expect(facade.ensureAgentRoute('missing-agent')).toBe(false);
    await Promise.resolve();
    expect(router.url).toBe('/');
  });

  it('adds skill from palette item', () => {
    const id = facade.createNode('AIAgent', { x: 0, y: 0 })!;
    expect(
      facade.addSkillFromPaletteItem(id, {
        key: 'Trigger',
        label: 'Trigger',
        description: 'Initiate workflows',
      }),
    ).toBe(true);
    expect(facade.agentSkills(id)[0]?.skillId).toBe('Trigger');
  });

  it('adds and removes skills with dedupe', () => {
    const id = facade.createNode('AIAgent', { x: 0, y: 0 })!;
    expect(
      facade.addSkillFromPaletteItem(id, {
        key: 'skill-extract-fields',
        label: 'Extract Fields',
        description: 'Pull fields',
      }),
    ).toBe(true);
    expect(facade.agentSkills(id)).toHaveLength(1);
    expect(
      facade.addSkillFromPaletteItem(id, {
        key: 'skill-extract-fields',
        label: 'Extract Fields',
        description: 'Pull fields',
      }),
    ).toBe(false);
    expect(facade.agentSkills(id)).toHaveLength(1);
    expect(facade.removeSkillFromAgent(id, 'skill-extract-fields')).toBe(true);
    expect(facade.agentSkills(id)).toHaveLength(0);
  });

  it('addSkillToAgent returns false without mock catalog', () => {
    const id = facade.createNode('AIAgent', { x: 0, y: 0 })!;
    expect(facade.addSkillToAgent(id, 'skill-extract-fields')).toBe(false);
    expect(facade.agentSkills(id)).toHaveLength(0);
  });

  it('blocks skill mutations in view mode', () => {
    const id = facade.createNode('AIAgent', { x: 0, y: 0 })!;
    facade.setEditorMode('view');
    expect(facade.addSkillToAgent(id, 'skill-summarize')).toBe(false);
  });
});

describe('WorkflowFacade host embed contract', () => {
  let facade: WorkflowFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    facade = TestBed.inject(WorkflowFacade);
    initWithSample(facade);
  });

  it('loadDocument applies a valid document and clears dirty', () => {
    const sample = TestBed.inject(MockWorkflowRepository).getSampleWorkflow();
    expect(facade.loadDocument(sample)).toBe(true);
    expect(facade.dirty()).toBe(false);
    expect(facade.nodes().length).toBe(sample.nodes.length);
    expect(facade.documentRevision()).toBe(1);
    expect(facade.canvasError()).toBeNull();
  });

  it('invalid load keeps last good graph and sets a non-secret error', () => {
    const before = facade.nodeCount();
    const name = facade.workflowName();
    expect(facade.loadDocument(null)).toBe(false);
    expect(facade.loadDocument(['not-an-object'])).toBe(false);
    expect(facade.nodeCount()).toBe(before);
    expect(facade.workflowName()).toBe(name);
    expect(facade.canvasError()).toBeTruthy();
    expect(String(facade.canvasError())).not.toMatch(/token|secret|password/i);
  });

  it('does not throw when loadDocument is given garbage', () => {
    expect(() => facade.loadDocument(undefined)).not.toThrow();
    expect(() => facade.loadDocument(1)).not.toThrow();
  });

  it('dirty is true after a committed edit and false after Save', () => {
    expect(facade.loadDocument(TestBed.inject(MockWorkflowRepository).getSampleWorkflow())).toBe(
      true,
    );
    expect(facade.dirty()).toBe(false);
    facade.createNode('Delay', { x: 10, y: 20 });
    expect(facade.dirty()).toBe(true);
    facade.saveDownload();
    expect(facade.dirty()).toBe(false);
  });

  it('getDocument flushes nested edits onto the solution agent', () => {
    const id = facade.createNode('AIAgent', { x: 0, y: 0 })!;
    expect(facade.enterAgentCanvas(id)).toBe(true);
    facade.createNode('Action', { x: 5, y: 5 });
    const doc = facade.getDocument();
    expect(facade.editingAgentNodeId()).toBe(id);
    const agent = doc?.nodes.find((n) => n.id === id);
    const nested = agent?.data['nestedWorkflow'] as { nodes: unknown[] } | undefined;
    expect(nested?.nodes).toHaveLength(1);
  });

  it('loadDocument exits nested edit so the solution document is shown', () => {
    const id = facade.createNode('AIAgent', { x: 0, y: 0 })!;
    expect(facade.enterAgentCanvas(id)).toBe(true);
    const sample = TestBed.inject(MockWorkflowRepository).getSampleWorkflow();
    expect(facade.loadDocument(sample)).toBe(true);
    expect(facade.editingAgentNodeId()).toBeNull();
    expect(facade.nodes().length).toBe(sample.nodes.length);
  });

  it('requestSave uses default saveDownload when no host handler is set', async () => {
    const spy = vi.spyOn(facade, 'saveDownload');
    await facade.requestSave();
    expect(spy).toHaveBeenCalled();
  });

  it('requestRun uses simulated startRun when no host handler is set', async () => {
    const spy = vi.spyOn(facade, 'startRun');
    await facade.requestRun();
    expect(spy).toHaveBeenCalled();
  });
});

describe('WorkflowFacade persist provider hooks', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('requestSave calls persist.save and does not saveDownload', async () => {
    const save = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideWorkflowBuilderUi({ persist: { save } }),
      ],
    });
    const facade = TestBed.inject(WorkflowFacade);
    initWithSample(facade);
    const spy = vi.spyOn(facade, 'saveDownload');
    await facade.requestSave();
    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.calls[0]![0]).toMatchObject({ id: facade.getDocument()?.id });
    expect(spy).not.toHaveBeenCalled();
    expect(facade.dirty()).toBe(false);
  });

  it('requestRun calls persist.run and does not startRun', async () => {
    const run = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideWorkflowBuilderUi({ persist: { run } }),
      ],
    });
    const facade = TestBed.inject(WorkflowFacade);
    initWithSample(facade);
    const spy = vi.spyOn(facade, 'startRun');
    await facade.requestRun();
    expect(run).toHaveBeenCalledTimes(1);
    expect(spy).not.toHaveBeenCalled();
  });

  it('instance save output wins over provider persist.save', async () => {
    const persistSave = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideWorkflowBuilderUi({ persist: { save: persistSave } }),
      ],
    });
    const facade = TestBed.inject(WorkflowFacade);
    initWithSample(facade);
    const instanceSave = vi.fn();
    facade.registerInstancePersist({
      saveObserved: () => true,
      emitSave: instanceSave,
      runObserved: () => false,
      emitRun: () => undefined,
    });
    const spy = vi.spyOn(facade, 'saveDownload');
    await facade.requestSave();
    expect(instanceSave).toHaveBeenCalledTimes(1);
    expect(persistSave).not.toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });
});
