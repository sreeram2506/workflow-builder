/** Nested workflow graph stored on AIAgent.data.nestedWorkflow (agent canvas). */

import type { Viewport, WorkflowDocument, WorkflowEdge, WorkflowNode } from './workflow.models';

export interface AgentNestedGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport: Viewport;
}

export function emptyAgentNestedGraph(): AgentNestedGraph {
  return {
    nodes: [],
    edges: [],
    viewport: { x: 0, y: 0, scale: 1 },
  };
}

export function readAgentNestedGraph(
  data: Record<string, unknown> | undefined,
): AgentNestedGraph {
  const raw = data?.['nestedWorkflow'];
  if (!raw || typeof raw !== 'object') {
    return emptyAgentNestedGraph();
  }
  const rec = raw as Record<string, unknown>;
  const nodes = Array.isArray(rec['nodes']) ? (structuredClone(rec['nodes']) as WorkflowNode[]) : [];
  const edges = Array.isArray(rec['edges']) ? (structuredClone(rec['edges']) as WorkflowEdge[]) : [];
  const vp = rec['viewport'];
  const viewport: Viewport =
    vp && typeof vp === 'object'
      ? {
          x: Number((vp as Viewport).x) || 0,
          y: Number((vp as Viewport).y) || 0,
          scale: Number((vp as Viewport).scale) || 1,
        }
      : { x: 0, y: 0, scale: 1 };
  return { nodes, edges, viewport };
}

export function withNestedWorkflow(
  data: Record<string, unknown> | undefined,
  graph: AgentNestedGraph,
): Record<string, unknown> {
  return {
    ...(data ?? {}),
    nestedWorkflow: {
      nodes: structuredClone(graph.nodes),
      edges: structuredClone(graph.edges),
      viewport: { ...graph.viewport },
    },
  };
}

export function toAgentEditableDocument(
  agentNodeId: string,
  label: string,
  graph: AgentNestedGraph,
): WorkflowDocument {
  return {
    id: `agent-canvas-${agentNodeId}`,
    name: label,
    status: 'draft',
    version: 1,
    updatedAt: new Date().toISOString(),
    viewport: { ...graph.viewport },
    nodes: structuredClone(graph.nodes),
    edges: structuredClone(graph.edges),
  };
}

export function fromAgentEditableDocument(doc: WorkflowDocument): AgentNestedGraph {
  return {
    nodes: structuredClone(doc.nodes),
    edges: structuredClone(doc.edges),
    viewport: { ...doc.viewport },
  };
}
