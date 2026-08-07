export type NodeType = 'Trigger' | 'Action' | 'Condition' | 'Delay' | 'End';

export type NodeStatus = 'idle' | 'running' | 'success' | 'error';

export type WorkflowStatus = 'draft' | 'ready' | 'running';

export type Theme = 'dark' | 'light';

export type EditorMode = 'edit' | 'view';

export const ALLOWED_NODE_TYPES: readonly NodeType[] = [
  'Trigger',
  'Action',
  'Condition',
  'Delay',
  'End',
] as const;

export interface Viewport {
  x: number;
  y: number;
  scale: number;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  subtitle: string;
  position: { x: number; y: number };
  status: NodeStatus;
  data: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface WorkflowDocument {
  id: string;
  name: string;
  status: WorkflowStatus;
  version: number;
  updatedAt: string;
  viewport: Viewport;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface SelectionState {
  nodeIds: string[];
  edgeIds: string[];
}
