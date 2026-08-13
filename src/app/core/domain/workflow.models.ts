export type NodeType =
  | 'Trigger'
  | 'Action'
  | 'Condition'
  | 'Delay'
  | 'End'
  | 'Decision'
  | 'Repeater'
  | 'Notification'
  | 'AIAgent';

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
  'Decision',
  'Repeater',
  'Notification',
  'AIAgent',
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
  /** Display label shown in Properties (and later on canvas if desired). */
  label: string;
  /** Ordered world-space reshape points between source and target ports. */
  waypoints: { x: number; y: number }[];
  /** Port side on the source node; when set, rendering prefers this over facingPorts. */
  sourceSide?: 'left' | 'right' | 'top' | 'bottom';
  /** Port side on the target node; when set, rendering prefers this over facingPorts. */
  targetSide?: 'left' | 'right' | 'top' | 'bottom';
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
