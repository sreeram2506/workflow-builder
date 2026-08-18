import { Injectable, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MockWorkflowRepository } from '../data/mock-workflow.repository';
import {
  createWorkflowEdge,
  insertWaypointIndex,
  newEdgeId,
  snapToGrid,
  edgeRenderPoints,
} from '../domain/connection.math';
import { routeAllEdges } from '../domain/edge-routing';
import { nextConditionOutLabel } from '../domain/logic-node-rules';
import { applyLayoutMode, type LayoutMode } from '../domain/layout.math';
import {
  createWorkflowNode,
  createWorkflowNodeFromPaletteItem,
  findExistingAgentForPaletteItem,
  newNodeId,
} from '../domain/node.factory';
import type { PaletteItem } from '../domain/palette.catalog';
import {
  closeAgentTab,
  openAgentTab,
  pruneMissingNodeIds,
} from '../domain/agent-tabs';
import {
  appendSkill,
  ensureSkillsArray,
  removeSkill,
  withSkillsData,
  type AgentSkillRef,
} from '../domain/agent-skills';
import {
  fromAgentEditableDocument,
  readAgentNestedGraph,
  toAgentEditableDocument,
  withNestedWorkflow,
} from '../domain/agent-graph';
import { nextTheme } from '../domain/theme.utils';
import {
  clampZoom,
  fitToContent,
  panBy,
  resetZoom,
  screenToWorld,
  zoomAt,
  zoomTowardCenter,
  type Point,
  type PortSide,
} from '../domain/viewport.math';
import type {
  EditorMode,
  NodeType,
  SelectionState,
  Viewport,
  WorkflowDocument,
  WorkflowEdge,
  WorkflowNode,
} from '../domain/workflow.models';
import { AutoSaveService } from '../history/autosave.service';
import { ClipboardService } from '../history/clipboard.service';
import { HistoryService } from '../history/history.service';
import { SerializationService } from '../history/serialization.service';
import { RunSimulationService } from '../run/run-simulation.service';
import { GraphStore } from '../stores/graph.store';
import { UiStore } from '../stores/ui.store';
import { ThemeApplicator } from '../theme/theme-applicator';

export type { LayoutMode };

const PASTE_OFFSET = 40;

function cloneNode(node: WorkflowNode): WorkflowNode {
  return {
    ...node,
    position: { ...node.position },
    data: structuredClone(node.data) as Record<string, unknown>,
  };
}

function cloneEdge(edge: WorkflowEdge): WorkflowEdge {
  return {
    ...edge,
    label: edge.label ?? '',
    condition: edge.condition ?? '',
    waypoints: edge.waypoints.map((p) => ({ ...p })),
  };
}

@Injectable({ providedIn: 'root' })
export class WorkflowFacade {
  private readonly graph = inject(GraphStore);
  private readonly ui = inject(UiStore);
  private readonly repo = inject(MockWorkflowRepository);
  private readonly themeApplicator = inject(ThemeApplicator);
  private readonly history = inject(HistoryService);
  private readonly serialization = inject(SerializationService);
  private readonly autoSave = inject(AutoSaveService);
  private readonly clipboard = inject(ClipboardService);
  private readonly runSim = inject(RunSimulationService);
  private readonly router = inject(Router);
  /** Stashed solution document while GraphStore holds an agent nested canvas. */
  private solutionDocument: WorkflowDocument | null = null;

  readonly document = this.graph.document;
  readonly theme = this.ui.theme;
  readonly editorMode = this.ui.editorMode;
  readonly leftSidebarCollapsed = this.ui.leftSidebarCollapsed;
  readonly rightSidebarCollapsed = this.ui.rightSidebarCollapsed;
  readonly nodesLibraryWidth = this.ui.nodesLibraryWidth;
  readonly propertiesWidth = this.ui.propertiesWidth;
  readonly bootstrapError = this.ui.bootstrapError;
  readonly canvasError = this.ui.canvasError;
  readonly canvasStatus = this.ui.canvasStatus;
  readonly runActive = this.ui.runActive;
  readonly runAnnouncement = this.ui.runAnnouncement;
  readonly selection = this.ui.selection;
  readonly selectionFocusNodeId = this.ui.selectionFocusNodeId;
  readonly selectionFocusEdgeId = this.ui.selectionFocusEdgeId;
  readonly propertiesDraft = this.ui.propertiesDraft;
  readonly propertiesEdgeDraft = this.ui.propertiesEdgeDraft;
  readonly agentTabs = this.ui.agentTabs;
  readonly focusedAgentTabId = this.ui.focusedAgentTabId;
  readonly selectedSkillId = this.ui.selectedSkillId;
  readonly editingAgentNodeId = this.ui.editingAgentNodeId;
  readonly chromeInsetTop = this.ui.chromeInsetTop;
  readonly canUndo = this.history.canUndo;
  readonly canRedo = this.history.canRedo;
  readonly autoSaveDirty = this.autoSave.dirty;

  readonly workflowName = computed(() => this.graph.document()?.name ?? 'Untitled workflow');
  readonly workflowStatus = computed(() => this.graph.document()?.status ?? 'draft');
  readonly nodeCount = computed(() => this.graph.document()?.nodes.length ?? 0);
  readonly edgeCount = computed(() => this.graph.document()?.edges.length ?? 0);
  readonly viewport = computed(
    () => this.graph.document()?.viewport ?? ({ x: 0, y: 0, scale: 1 } satisfies Viewport),
  );
  readonly nodes = computed(() => this.graph.document()?.nodes ?? []);
  readonly edges = computed(() => this.graph.document()?.edges ?? []);

  initialize(): void {
    this.ui.resetSessionDefaults();
    this.history.clear();
    const doc = this.repo.getEmptyWorkflow();
    this.graph.setDocument(doc, { skipHistory: true, skipAutosave: true });
    this.themeApplicator.apply(this.ui.theme());
  }

  toggleTheme(): void {
    const next = nextTheme(this.ui.theme());
    this.ui.setTheme(next);
    this.themeApplicator.apply(next);
  }

  setLeftCollapsed(collapsed: boolean): void {
    this.ui.setLeftCollapsed(collapsed);
  }

  setChromeInsetTop(px: number): void {
    this.ui.setChromeInsetTop(px);
  }

  setRightCollapsed(collapsed: boolean): void {
    this.ui.setRightCollapsed(collapsed);
  }

  setNodesLibraryWidth(width: number): void {
    this.ui.setNodesLibraryWidth(width);
  }

  setPropertiesWidth(width: number): void {
    this.ui.setPropertiesWidth(width);
  }

  setBootstrapError(message: string | null): void {
    this.ui.setBootstrapError(message);
  }

  setCanvasError(message: string | null): void {
    this.ui.setCanvasError(message);
  }

  setCanvasStatus(message: string | null): void {
    this.ui.setCanvasStatus(message);
  }

  setViewport(viewport: Viewport): void {
    this.graph.setViewport({
      x: viewport.x,
      y: viewport.y,
      scale: clampZoom(viewport.scale),
    });
  }

  panBy(dx: number, dy: number): void {
    this.setViewport(panBy(this.viewport(), dx, dy));
  }

  zoomAtScreen(screen: Point, factor: number): void {
    this.setViewport(zoomAt(this.viewport(), screen, factor));
  }

  zoomByTowardCenter(factor: number, viewWidth: number, viewHeight: number): void {
    this.setViewport(zoomTowardCenter(this.viewport(), viewWidth, viewHeight, factor));
  }

  resetZoom(viewWidth: number, viewHeight: number): void {
    this.setViewport(resetZoom(this.viewport(), viewWidth, viewHeight));
  }

  selectNodes(nodeIds: string[]): void {
    const ids = [...nodeIds];
    this.ui.setSelection({ nodeIds: ids, edgeIds: [] });
    this.applyEdgeFocus([], null);
    const focus = ids.length > 0 ? ids[ids.length - 1]! : null;
    this.applySelectionFocus(ids, focus);
  }

  toggleNodeSelection(nodeId: string): void {
    const cur = this.ui.selection();
    const has = cur.nodeIds.includes(nodeId);
    const nodeIds = has ? cur.nodeIds.filter((id) => id !== nodeId) : [...cur.nodeIds, nodeId];
    this.ui.setSelection({ nodeIds, edgeIds: [] });
    this.applyEdgeFocus([], null);
    const focus = has ? null : nodeId;
    this.applySelectionFocus(nodeIds, focus);
  }

  selectEdges(edgeIds: string[], shift = false): void {
    if (shift) {
      const cur = this.ui.selection();
      const set = new Set(cur.edgeIds);
      for (const id of edgeIds) {
        if (set.has(id)) {
          set.delete(id);
        } else {
          set.add(id);
        }
      }
      const next = [...set];
      this.ui.setSelection({ nodeIds: cur.nodeIds, edgeIds: next });
      const preferred = edgeIds.find((id) => next.includes(id)) ?? next[next.length - 1] ?? null;
      this.applyEdgeFocus(next, preferred);
      return;
    }
    const ids = [...edgeIds];
    this.ui.setSelection({ nodeIds: [], edgeIds: ids });
    this.applySelectionFocus([], null);
    this.applyEdgeFocus(ids, ids.length > 0 ? ids[ids.length - 1]! : null);
  }

  setSelection(selection: SelectionState): void {
    const nodeIds = [...selection.nodeIds];
    const edgeIds = [...selection.edgeIds];
    this.ui.setSelection({ nodeIds, edgeIds });
    if (nodeIds.length > 0) {
      const preferred = nodeIds[nodeIds.length - 1]!;
      this.applySelectionFocus(nodeIds, preferred);
      this.applyEdgeFocus([], null);
    } else if (edgeIds.length > 0) {
      this.applySelectionFocus([], null);
      this.applyEdgeFocus(edgeIds, edgeIds[edgeIds.length - 1]!);
    } else {
      this.applySelectionFocus([], null);
      this.applyEdgeFocus([], null);
    }
  }

  clearSelection(): void {
    this.ui.clearSelection();
    this.applySelectionFocus([], null);
    this.applyEdgeFocus([], null);
  }

  /** Most-recent click among an existing multi-selection (Properties focus). */
  focusNodeInSelection(nodeId: string): void {
    const ids = this.ui.selection().nodeIds;
    if (!ids.includes(nodeId)) {
      return;
    }
    this.applyEdgeFocus([], null);
    this.applySelectionFocus(ids, nodeId);
  }

  focusEdgeInSelection(edgeId: string): void {
    const ids = this.ui.selection().edgeIds;
    if (!ids.includes(edgeId)) {
      return;
    }
    this.applySelectionFocus([], null);
    this.applyEdgeFocus(ids, edgeId);
  }

  /** Dual-write: update working Properties draft from the form. */
  setPropertiesDraft(node: WorkflowNode | null): void {
    this.ui.setPropertiesDraft(node ? cloneNode(node) : null);
  }

  setPropertiesEdgeDraft(edge: WorkflowEdge | null): void {
    this.ui.setPropertiesEdgeDraft(edge ? cloneEdge(edge) : null);
  }

  patchNode(
    id: string,
    partial: Partial<Pick<WorkflowNode, 'label' | 'subtitle' | 'status' | 'data'>>,
  ): boolean {
    try {
      if (this.ui.editorMode() === 'view') {
        return false;
      }
      const exists = this.nodes().some((n) => n.id === id);
      if (!exists) {
        return false;
      }
      this.graph.patchNode(id, partial);
      this.setCanvasError(null);
      if (this.ui.selectionFocusNodeId() === id) {
        const saved = this.nodes().find((n) => n.id === id);
        this.ui.setPropertiesDraft(saved ? cloneNode(saved) : null);
      }
      return true;
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Failed to patch node');
      return false;
    }
  }

  patchEdge(id: string, partial: Partial<Pick<WorkflowEdge, 'label' | 'condition'>>): boolean {
    try {
      if (this.ui.editorMode() === 'view') {
        return false;
      }
      const exists = this.edges().some((e) => e.id === id);
      if (!exists) {
        return false;
      }
      this.graph.patchEdge(id, partial);
      this.setCanvasError(null);
      if (this.ui.selectionFocusEdgeId() === id) {
        const saved = this.edges().find((e) => e.id === id);
        this.ui.setPropertiesEdgeDraft(saved ? cloneEdge(saved) : null);
      }
      return true;
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Failed to patch edge');
      return false;
    }
  }

  moveNodes(ids: readonly string[], delta: Point): void {
    this.graph.moveNodes(ids, delta);
  }

  setViewSize(size: { w: number; h: number }): void {
    this.ui.setViewSize(size);
  }

  /**
   * Create a node at world position. Returns new id or null on no-op / validation failure.
   * Selects the new node (auto-expands Properties when sole selection).
   */
  createNode(type: NodeType, position: Point): string | null {
    try {
      if (this.ui.editorMode() === 'view') {
        return null;
      }
      if (!this.graph.document()) {
        return null;
      }
      const node = createWorkflowNode(type, position);
      if (!node) {
        return null;
      }
      this.graph.addNode(node);
      this.selectNodes([node.id]);
      this.setCanvasError(null);
      return node.id;
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Failed to create node');
      return null;
    }
  }

  /** Create from a palette row (static or enso-mapped). */
  createNodeFromPaletteItem(item: PaletteItem, position: Point): string | null {
    try {
      if (this.ui.editorMode() === 'view') {
        return null;
      }
      if (!this.graph.document()) {
        return null;
      }
      const existing = findExistingAgentForPaletteItem(this.solutionNodes(), item);
      if (existing) {
        this.selectNodes([existing.id]);
        this.openAgentTab(existing.id);
        this.setCanvasError(null);
        return existing.id;
      }
      const node = createWorkflowNodeFromPaletteItem(item, position);
      if (!node) {
        return null;
      }
      this.graph.addNode(node);
      this.selectNodes([node.id]);
      if (node.type === 'AIAgent') {
        this.openAgentTab(node.id);
      }
      this.setCanvasError(null);
      return node.id;
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Failed to create node');
      return null;
    }
  }

  /** Click-to-add: place at current viewport center. */
  createNodeAtViewportCenter(type: NodeType): string | null {
    const size = this.ui.viewSize();
    const screen = { x: size.w / 2, y: size.h / 2 };
    return this.createNode(type, screenToWorld(screen, this.viewport()));
  }

  createNodeAtViewportCenterFromItem(item: PaletteItem): string | null {
    const size = this.ui.viewSize();
    const screen = { x: size.w / 2, y: size.h / 2 };
    return this.createNodeFromPaletteItem(item, screenToWorld(screen, this.viewport()));
  }

  createEdge(
    sourceId: string,
    targetId: string,
    sides?: { sourceSide: PortSide; targetSide: PortSide },
  ): string | null {
    try {
      if (this.ui.editorMode() === 'view') {
        return null;
      }
      const nodes = this.nodes();
      const edge = createWorkflowEdge(sourceId, targetId, nodes, sides);
      if (!edge) {
        return null;
      }
      const source = nodes.find((n) => n.id === edge.source);
      if (source?.type === 'Condition') {
        const existing = this.edges()
          .filter((e) => e.source === edge.source)
          .map((e) => e.label);
        const next = nextConditionOutLabel(existing);
        if (next === null) {
          return null;
        }
        edge.label = next;
      } else if (source?.type === 'Decision') {
        edge.label = 'Blank Condition';
        edge.condition = '';
      }
      this.graph.addEdge(edge);
      this.selectEdges([edge.id]);
      this.setCanvasError(null);
      return edge.id;
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Failed to create edge');
      return null;
    }
  }

  deleteEdges(ids: readonly string[]): void {
    try {
      if (this.ui.editorMode() === 'view' || ids.length === 0) {
        return;
      }
      this.graph.removeEdges(ids);
      this.clearSelection();
      this.setCanvasError(null);
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Failed to delete edge');
    }
  }

  /** Delete nodes and incident edges. */
  deleteNodes(ids: readonly string[]): void {
    try {
      if (this.ui.editorMode() === 'view' || ids.length === 0) {
        return;
      }
      this.graph.removeNodes(ids);
      this.pruneAgentTabs();
      this.clearSelection();
      this.setCanvasError(null);
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Failed to delete node');
    }
  }

  /** Open or focus an agent tab for a Blank Agent (no nested navigation). */
  openAgentTab(nodeId: string): void {
    const node = this.findSolutionAgent(nodeId);
    if (!node) {
      return;
    }
    const result = openAgentTab(this.ui.agentTabs(), nodeId);
    this.ui.setAgentTabs(result.tabs, result.focusedNodeId);
    if (!this.ui.editingAgentNodeId()) {
      this.selectNodes([nodeId]);
      this.focusNodeInSelection(nodeId);
    }
  }

  /** Focus tab and navigate to nested agent canvas route. */
  selectAgentTab(nodeId: string): void {
    if (!this.findSolutionAgent(nodeId)) {
      return;
    }
    this.openAgentTab(nodeId);
    this.ui.setSelectedSkillId(null);
    void this.router.navigate(['/agent', nodeId]);
  }

  navigateBackToSolution(agentNodeId?: string | null): void {
    const id = agentNodeId ?? this.ui.focusedAgentTabId() ?? this.ui.editingAgentNodeId();
    this.ui.setSelectedSkillId(null);
    this.exitAgentCanvas();
    void this.router.navigate(['/']).then(() => {
      if (id && this.nodes().some((n) => n.id === id)) {
        this.selectNodes([id]);
        this.focusNodeInSelection(id);
        this.ui.setAgentTabs(this.ui.agentTabs(), id);
      }
    });
  }

  /**
   * Enter nested agent canvas: stash solution doc, load agent.data.nestedWorkflow into GraphStore.
   * Call from agent route; safe to re-enter same agent or switch agents.
   */
  enterAgentCanvas(agentNodeId: string): boolean {
    if (this.ui.editingAgentNodeId() === agentNodeId) {
      this.openAgentTab(agentNodeId);
      return true;
    }

    if (this.ui.editingAgentNodeId()) {
      this.flushAgentCanvasToSolution();
    } else {
      const doc = this.graph.document();
      if (!doc) {
        return false;
      }
      this.solutionDocument = structuredClone(doc);
    }

    const solution = this.solutionDocument;
    if (!solution) {
      return false;
    }
    const agent = solution.nodes.find((n) => n.id === agentNodeId && n.type === 'AIAgent');
    if (!agent) {
      this.history.clear();
      this.graph.setDocument(solution, { skipHistory: true, skipAutosave: true });
      this.solutionDocument = null;
      this.ui.setEditingAgentNodeId(null);
      return false;
    }

    const nested = readAgentNestedGraph(agent.data);
    const editable = toAgentEditableDocument(agentNodeId, agent.label || 'Blank Agent', nested);
    this.history.clear();
    this.clearSelection();
    this.ui.setEditingAgentNodeId(agentNodeId);
    this.ui.setSelectedSkillId(null);
    this.graph.setDocument(editable, { skipHistory: true, skipAutosave: true });
    this.openAgentTab(agentNodeId);
    this.setRightCollapsed(false);
    return true;
  }

  /** Persist nested canvas onto solution agent and restore solution GraphStore. */
  exitAgentCanvas(): void {
    if (!this.ui.editingAgentNodeId()) {
      return;
    }
    this.flushAgentCanvasToSolution();
    if (this.solutionDocument) {
      this.history.clear();
      this.clearSelection();
      this.graph.setDocument(this.solutionDocument, { skipHistory: true, skipAutosave: true });
      this.solutionDocument = null;
    }
    this.ui.setEditingAgentNodeId(null);
  }

  /** Validate agent route param; load nested canvas or redirect home. */
  ensureAgentRoute(nodeId: string): boolean {
    if (!this.enterAgentCanvas(nodeId)) {
      this.setCanvasStatus('Agent not found');
      void this.router.navigate(['/']);
      return false;
    }
    return true;
  }

  private solutionNodes(): WorkflowNode[] {
    return this.solutionDocument?.nodes ?? this.graph.document()?.nodes ?? [];
  }

  private findSolutionAgent(nodeId: string): WorkflowNode | undefined {
    return this.solutionNodes().find((n) => n.id === nodeId && n.type === 'AIAgent');
  }

  private flushAgentCanvasToSolution(): void {
    const editingId = this.ui.editingAgentNodeId();
    const nestedDoc = this.graph.document();
    if (!editingId || !nestedDoc || !this.solutionDocument) {
      return;
    }
    const nested = fromAgentEditableDocument(nestedDoc);
    this.solutionDocument = {
      ...this.solutionDocument,
      updatedAt: new Date().toISOString(),
      nodes: this.solutionDocument.nodes.map((n) =>
        n.id === editingId
          ? { ...n, data: withNestedWorkflow(n.data, nested) }
          : n,
      ),
    };
  }

  agentSkills(agentNodeId: string): AgentSkillRef[] {
    const node = this.findSolutionAgent(agentNodeId);
    return ensureSkillsArray(node?.data);
  }

  addSkillToAgent(_agentNodeId: string, _skillId: string): boolean {
    return false;
  }

  /** Add a Nodes Library palette item as an agent skill (nested agent view). */
  addSkillFromPaletteItem(
    agentNodeId: string,
    item: { key: string; label: string; description: string; taskId?: string },
  ): boolean {
    const skillId = item.taskId ? `enso-${item.taskId}` : item.key;
    return this.addSkillRef(agentNodeId, {
      skillId,
      name: item.label,
      description: item.description,
    });
  }

  addSkillRef(
    agentNodeId: string,
    skill: { skillId: string; name: string; description: string },
  ): boolean {
    if (this.ui.editorMode() === 'view') {
      return false;
    }
    const node = this.nodes().find((n) => n.id === agentNodeId);
    if (!node || node.type !== 'AIAgent') {
      return false;
    }
    const current = ensureSkillsArray(node.data);
    const { skills, added } = appendSkill(current, skill);
    if (!added) {
      this.ui.setSelectedSkillId(skill.skillId);
      return false;
    }
    const ok = this.patchNode(agentNodeId, { data: withSkillsData(node.data, skills) });
    if (ok) {
      this.ui.setSelectedSkillId(skill.skillId);
    }
    return ok;
  }

  removeSkillFromAgent(agentNodeId: string, skillId: string): boolean {
    if (this.ui.editorMode() === 'view') {
      return false;
    }
    const node = this.nodes().find((n) => n.id === agentNodeId);
    if (!node || node.type !== 'AIAgent') {
      return false;
    }
    const next = removeSkill(ensureSkillsArray(node.data), skillId);
    const ok = this.patchNode(agentNodeId, { data: withSkillsData(node.data, next) });
    if (ok && this.ui.selectedSkillId() === skillId) {
      this.ui.setSelectedSkillId(null);
    }
    return ok;
  }

  setSelectedSkillId(skillId: string | null): void {
    this.ui.setSelectedSkillId(skillId);
  }

  closeAgentTab(nodeId: string): void {
    const result = closeAgentTab(this.ui.agentTabs(), this.ui.focusedAgentTabId(), nodeId);
    this.ui.setAgentTabs(result.tabs, result.focusedNodeId);
  }

  focusAgentTabChrome(nodeId: string): void {
    if (!this.ui.agentTabs().some((t) => t.nodeId === nodeId)) {
      return;
    }
    this.selectAgentTab(nodeId);
  }

  agentTabLabel(nodeId: string): string {
    return this.findSolutionAgent(nodeId)?.label ?? 'Blank Agent';
  }

  private pruneAgentTabs(): void {
    const pool = this.solutionDocument ?? this.graph.document();
    const alive = new Set((pool?.nodes ?? []).map((n) => n.id));
    const result = pruneMissingNodeIds(this.ui.agentTabs(), this.ui.focusedAgentTabId(), alive);
    this.ui.setAgentTabs(result.tabs, result.focusedNodeId);
  }

  /** Delete current selection: nodes (and their edges) preferred over edges-only. */
  deleteSelection(): void {
    const sel = this.ui.selection();
    if (sel.nodeIds.length > 0) {
      this.deleteNodes(sel.nodeIds);
      return;
    }
    if (sel.edgeIds.length > 0) {
      this.deleteEdges(sel.edgeIds);
    }
  }

  addWaypoint(edgeId: string, worldPoint: Point): number | null {
    try {
      if (this.ui.editorMode() === 'view') {
        return null;
      }
      const edge = this.edges().find((e) => e.id === edgeId);
      if (!edge) {
        return null;
      }
      const pts = edgeRenderPoints(edge, this.nodes());
      if (!pts) {
        return null;
      }
      const snapped = snapToGrid(worldPoint);
      const idx = insertWaypointIndex(snapped, pts.start, pts.end, edge.waypoints);
      const next = [...edge.waypoints];
      next.splice(idx, 0, snapped);
      this.graph.setEdgeWaypoints(edgeId, next);
      this.setCanvasError(null);
      return idx;
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Failed to add waypoint');
      return null;
    }
  }

  moveWaypoint(edgeId: string, index: number, worldPoint: Point): void {
    try {
      if (this.ui.editorMode() === 'view') {
        return;
      }
      const edge = this.edges().find((e) => e.id === edgeId);
      if (!edge || index < 0 || index >= edge.waypoints.length) {
        return;
      }
      const next = edge.waypoints.map((p, i) => (i === index ? snapToGrid(worldPoint) : { ...p }));
      this.graph.setEdgeWaypoints(edgeId, next);
      this.setCanvasError(null);
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Failed to move waypoint');
    }
  }

  removeWaypoint(edgeId: string, index: number): void {
    try {
      if (this.ui.editorMode() === 'view') {
        return;
      }
      const edge = this.edges().find((e) => e.id === edgeId);
      if (!edge || index < 0 || index >= edge.waypoints.length) {
        return;
      }
      const next = edge.waypoints.filter((_, i) => i !== index);
      this.graph.setEdgeWaypoints(edgeId, next);
      this.setCanvasError(null);
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Failed to remove waypoint');
    }
  }

  /** Explicit medium obstacle-aware routing for all edges. */
  routeEdges(): void {
    try {
      if (this.ui.editorMode() === 'view') {
        return;
      }
      const nodes = this.nodes();
      const edges = this.edges();
      if (edges.length === 0) {
        this.setCanvasStatus(null);
        return;
      }
      const result = routeAllEdges(edges, nodes, {
        gridSize: environment.routingGridSize,
        obstaclePadding: environment.routingObstaclePadding,
      });
      this.graph.setAllEdgeWaypoints(result.byEdgeId);
      this.setCanvasError(null);
      this.setCanvasStatus(result.anyFallback ? 'Some edges used simple paths' : null);
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Failed to route edges');
    }
  }

  /** Apply layout, then route once, then fit-to-content. */
  applyLayout(mode: LayoutMode, viewWidth?: number, viewHeight?: number): void {
    try {
      if (this.ui.editorMode() === 'view') {
        return;
      }
      const nodes = this.nodes();
      const edges = this.edges();
      if (nodes.length === 0) {
        return;
      }
      this.history.beginGesture();
      try {
        const positions = applyLayoutMode(mode, nodes, edges);
        this.graph.setNodePositions(positions);
        this.routeEdges();
      } finally {
        this.history.endGesture();
      }
      const size = this.ui.viewSize();
      const w = viewWidth ?? size.w;
      const h = viewHeight ?? size.h;
      this.fitToContent(w, h);
    } catch (err) {
      this.history.endGesture();
      this.setCanvasError(err instanceof Error ? err.message : 'Failed to apply layout');
    }
  }

  fitToContent(viewWidth: number, viewHeight: number): void {
    try {
      const next = fitToContent(this.nodes(), viewWidth, viewHeight);
      this.setViewport(next);
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Failed to fit content');
    }
  }

  beginHistoryGesture(): void {
    this.history.beginGesture();
  }

  endHistoryGesture(): void {
    this.history.endGesture();
  }

  undo(): void {
    try {
      if (this.ui.editorMode() === 'view') {
        return;
      }
      const current = this.graph.document();
      if (!current) {
        return;
      }
      const prev = this.history.undo(current);
      if (!prev) {
        return;
      }
      this.history.setSuppressRecording(true);
      this.graph.setDocument(prev, { skipHistory: true });
      this.history.setSuppressRecording(false);
      this.clearSelection();
      this.setCanvasError(null);
    } catch (err) {
      this.history.setSuppressRecording(false);
      this.setCanvasError(err instanceof Error ? err.message : 'Undo failed');
    }
  }

  redo(): void {
    try {
      if (this.ui.editorMode() === 'view') {
        return;
      }
      const current = this.graph.document();
      if (!current) {
        return;
      }
      const next = this.history.redo(current);
      if (!next) {
        return;
      }
      this.history.setSuppressRecording(true);
      this.graph.setDocument(next, { skipHistory: true });
      this.history.setSuppressRecording(false);
      this.clearSelection();
      this.setCanvasError(null);
    } catch (err) {
      this.history.setSuppressRecording(false);
      this.setCanvasError(err instanceof Error ? err.message : 'Redo failed');
    }
  }

  /** Save: mark document saved + toast — does not download (use Export for that). */
  saveDownload(): void {
    try {
      const doc = this.graph.document();
      if (!doc) {
        return;
      }
      this.graph.setDocument(
        {
          ...doc,
          status: 'saved',
          updatedAt: new Date().toISOString(),
        },
        { skipHistory: true },
      );
      this.setCanvasStatus('Saved');
      this.setCanvasError(null);
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  exportDownload(): void {
    try {
      const doc = this.graph.document();
      if (!doc) {
        return;
      }
      this.serialization.download(doc, 'Exported');
      this.setCanvasError(null);
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Export failed');
    }
  }

  /**
   * Import JSON text. Returns null on success, error message on failure.
   * Does not mutate store on failure.
   */
  importJson(text: string): string | null {
    try {
      if (this.ui.editorMode() === 'view') {
        return 'Import disabled in view mode';
      }
      const parsed = this.serialization.parse(text);
      if (parsed.ok === false) {
        this.setCanvasError(parsed.error);
        return parsed.error;
      }
      this.history.clear();
      this.history.setSuppressRecording(true);
      this.graph.setDocument(parsed.document, { skipHistory: true });
      this.history.setSuppressRecording(false);
      this.clearSelection();
      this.setCanvasError(null);
      this.setCanvasStatus('Imported workflow');
      return null;
    } catch (err) {
      this.history.setSuppressRecording(false);
      const msg = err instanceof Error ? err.message : 'Import failed';
      this.setCanvasError(msg);
      return msg;
    }
  }

  copySelection(): void {
    try {
      if (this.ui.editorMode() === 'view') {
        return;
      }
      const nodeIds = new Set(this.ui.selection().nodeIds);
      if (nodeIds.size === 0) {
        return;
      }
      const nodes = this.nodes().filter((n) => nodeIds.has(n.id)).map(cloneNode);
      const edges = this.edges()
        .filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target))
        .map(cloneEdge);
      this.clipboard.set({ nodes, edges });
      this.setCanvasError(null);
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Copy failed');
    }
  }

  pasteClipboard(): void {
    try {
      if (this.ui.editorMode() === 'view') {
        return;
      }
      const payload = this.clipboard.payload();
      if (!payload || payload.nodes.length === 0) {
        return;
      }
      const idMap = new Map<string, string>();
      const nodes: WorkflowNode[] = payload.nodes.map((n) => {
        const id = newNodeId(n.type);
        idMap.set(n.id, id);
        return {
          ...cloneNode(n),
          id,
          position: { x: n.position.x + PASTE_OFFSET, y: n.position.y + PASTE_OFFSET },
        };
      });
      const edges: WorkflowEdge[] = payload.edges.map((e) => ({
        ...cloneEdge(e),
        id: newEdgeId(idMap.get(e.source) ?? e.source, idMap.get(e.target) ?? e.target),
        source: idMap.get(e.source)!,
        target: idMap.get(e.target)!,
        waypoints: e.waypoints.map((p) => ({ x: p.x + PASTE_OFFSET, y: p.y + PASTE_OFFSET })),
      }));
      this.graph.addNodesAndEdges(nodes, edges);
      this.selectNodes(nodes.map((n) => n.id));
      this.setCanvasError(null);
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Paste failed');
    }
  }

  /** Toggle edit ↔ view. Switching modes stops an active Run. */
  setEditorMode(mode: EditorMode): void {
    if (this.ui.editorMode() === mode) {
      return;
    }
    if (this.ui.runActive()) {
      this.stopRun();
    }
    this.ui.setEditorMode(mode);
  }

  toggleEditorMode(): void {
    this.setEditorMode(this.ui.editorMode() === 'view' ? 'edit' : 'view');
  }

  startRun(): void {
    try {
      if (this.ui.runActive()) {
        return;
      }
      this.runSim.start();
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Run failed');
      this.ui.setRunActive(false);
    }
  }

  stopRun(): void {
    try {
      this.runSim.stop();
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Stop failed');
      this.ui.setRunActive(false);
    }
  }

  /** Reset all node statuses to idle (allowed in view). Does not change structure. */
  resetStatuses(): void {
    try {
      const doc = this.graph.document();
      if (!doc || doc.nodes.length === 0) {
        return;
      }
      const updates: Record<string, WorkflowNode['status']> = {};
      for (const n of doc.nodes) {
        updates[n.id] = 'idle';
      }
      this.graph.patchNodeStatuses(updates, { skipHistory: true, skipAutosave: true });
      this.ui.setRunAnnouncement(null);
      this.setCanvasError(null);
    } catch (err) {
      this.setCanvasError(err instanceof Error ? err.message : 'Reset statuses failed');
    }
  }

  private applySelectionFocus(nodeIds: string[], preferredFocus: string | null): void {
    let focus: string | null = null;
    if (preferredFocus && nodeIds.includes(preferredFocus)) {
      focus = preferredFocus;
    } else if (nodeIds.length === 1) {
      focus = nodeIds[0]!;
    } else if (nodeIds.length > 1) {
      const cur = this.ui.selectionFocusNodeId();
      focus = cur && nodeIds.includes(cur) ? cur : nodeIds[nodeIds.length - 1]!;
    }

    const prev = this.ui.selectionFocusNodeId();
    this.ui.setSelectionFocusNodeId(focus);

    if (focus) {
      this.ui.setSelectionFocusEdgeId(null);
      this.ui.setPropertiesEdgeDraft(null);
    }

    if (focus !== prev) {
      if (!focus) {
        this.ui.setPropertiesDraft(null);
      } else {
        const node = this.nodes().find((n) => n.id === focus);
        this.ui.setPropertiesDraft(node ? cloneNode(node) : null);
      }
    } else if (!focus) {
      this.ui.setPropertiesDraft(null);
    }

    if (nodeIds.length === 1) {
      this.ui.setRightCollapsed(false);
    }
  }

  private applyEdgeFocus(edgeIds: string[], preferredFocus: string | null): void {
    let focus: string | null = null;
    if (preferredFocus && edgeIds.includes(preferredFocus)) {
      focus = preferredFocus;
    } else if (edgeIds.length === 1) {
      focus = edgeIds[0]!;
    } else if (edgeIds.length > 1) {
      const cur = this.ui.selectionFocusEdgeId();
      focus = cur && edgeIds.includes(cur) ? cur : edgeIds[edgeIds.length - 1]!;
    }

    const prev = this.ui.selectionFocusEdgeId();
    this.ui.setSelectionFocusEdgeId(focus);

    if (focus) {
      this.ui.setSelectionFocusNodeId(null);
      this.ui.setPropertiesDraft(null);
    }

    if (focus !== prev) {
      if (!focus) {
        this.ui.setPropertiesEdgeDraft(null);
      } else {
        const edge = this.edges().find((e) => e.id === focus);
        this.ui.setPropertiesEdgeDraft(edge ? cloneEdge(edge) : null);
      }
    } else if (!focus) {
      this.ui.setPropertiesEdgeDraft(null);
    }

    if (edgeIds.length === 1) {
      this.ui.setRightCollapsed(false);
    }
  }
}
