import {
  ALLOWED_NODE_TYPES,
  type NodeStatus,
  type NodeType,
  type Viewport,
  type WorkflowDocument,
  type WorkflowEdge,
  type WorkflowNode,
  type WorkflowStatus,
} from './workflow.models';

export const WORKFLOW_SCHEMA_VERSION = 1;

export interface SerializedWorkflow extends WorkflowDocument {
  schemaVersion: number;
}

export type ParseWorkflowResult =
  | { ok: true; document: WorkflowDocument }
  | { ok: false; error: string };

const NODE_STATUSES: readonly NodeStatus[] = ['idle', 'running', 'success', 'error'];
const WORKFLOW_STATUSES: readonly WorkflowStatus[] = ['draft', 'saved', 'ready', 'running'];

export function serializeWorkflow(doc: WorkflowDocument): string {
  const payload: SerializedWorkflow = {
    schemaVersion: WORKFLOW_SCHEMA_VERSION,
    id: doc.id,
    name: doc.name,
    status: doc.status,
    version: doc.version,
    updatedAt: doc.updatedAt,
    viewport: { ...doc.viewport },
    nodes: doc.nodes.map((n) => ({
      ...n,
      position: { ...n.position },
      data: structuredClone(n.data) as Record<string, unknown>,
    })),
    edges: doc.edges.map((e) => ({
      ...e,
      label: e.label ?? '',
      condition: e.condition ?? '',
      waypoints: e.waypoints.map((p) => ({ ...p })),
    })),
  };
  return JSON.stringify(payload, null, 2);
}

/** Strip unknown top-level keys; keep schemaVersion + document fields. */
export function allowlistSerialized(raw: unknown): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }
  const o = raw as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of [
    'schemaVersion',
    'id',
    'name',
    'status',
    'version',
    'updatedAt',
    'viewport',
    'nodes',
    'edges',
  ]) {
    if (key in o) {
      out[key] = o[key];
    }
  }
  return out;
}

/** Parse a host `[document]` object or deserialized JSON. Never throws. */
export function parseWorkflowUnknown(raw: unknown): ParseWorkflowResult {
  const allowed = allowlistSerialized(raw);
  if (!allowed) {
    return { ok: false, error: 'Workflow must be an object' };
  }
  if (!('schemaVersion' in allowed)) {
    allowed['schemaVersion'] = WORKFLOW_SCHEMA_VERSION;
  }
  return validateSerialized(allowed);
}

export function parseWorkflowJson(text: string): ParseWorkflowResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: 'Invalid JSON' };
  }
  return parseWorkflowUnknown(parsed);
}

export function validateSerialized(raw: Record<string, unknown>): ParseWorkflowResult {
  const version = raw['schemaVersion'];
  if (version !== WORKFLOW_SCHEMA_VERSION) {
    return { ok: false, error: `Unsupported schemaVersion (expected ${WORKFLOW_SCHEMA_VERSION})` };
  }
  if (typeof raw['id'] !== 'string' || !raw['id']) {
    return { ok: false, error: 'Missing id' };
  }
  if (typeof raw['name'] !== 'string') {
    return { ok: false, error: 'Missing name' };
  }
  if (!WORKFLOW_STATUSES.includes(raw['status'] as WorkflowStatus)) {
    return { ok: false, error: 'Invalid status' };
  }
  if (typeof raw['version'] !== 'number' || !Number.isFinite(raw['version'])) {
    return { ok: false, error: 'Invalid version' };
  }
  if (typeof raw['updatedAt'] !== 'string') {
    return { ok: false, error: 'Missing updatedAt' };
  }
  const viewport = parseViewport(raw['viewport']);
  if (!viewport) {
    return { ok: false, error: 'Invalid viewport' };
  }
  if (!Array.isArray(raw['nodes']) || !Array.isArray(raw['edges'])) {
    return { ok: false, error: 'nodes and edges must be arrays' };
  }

  const nodes: WorkflowNode[] = [];
  const nodeIds = new Set<string>();
  for (const item of raw['nodes']) {
    const n = parseNode(item);
    if (!n) {
      return { ok: false, error: 'Invalid node in nodes[]' };
    }
    if (nodeIds.has(n.id)) {
      return { ok: false, error: `Duplicate node id: ${n.id}` };
    }
    nodeIds.add(n.id);
    nodes.push(n);
  }

  const edges: WorkflowEdge[] = [];
  const edgeIds = new Set<string>();
  for (const item of raw['edges']) {
    const e = parseEdge(item);
    if (!e) {
      return { ok: false, error: 'Invalid edge in edges[]' };
    }
    if (edgeIds.has(e.id)) {
      return { ok: false, error: `Duplicate edge id: ${e.id}` };
    }
    if (!nodeIds.has(e.source) || !nodeIds.has(e.target)) {
      return { ok: false, error: `Edge ${e.id} has missing endpoints` };
    }
    edgeIds.add(e.id);
    edges.push(e);
  }

  return {
    ok: true,
    document: {
      id: raw['id'] as string,
      name: raw['name'] as string,
      status: raw['status'] as WorkflowStatus,
      version: raw['version'] as number,
      updatedAt: raw['updatedAt'] as string,
      viewport,
      nodes,
      edges,
    },
  };
}

function parseViewport(v: unknown): Viewport | null {
  if (!v || typeof v !== 'object') {
    return null;
  }
  const o = v as Record<string, unknown>;
  if (
    typeof o['x'] !== 'number' ||
    typeof o['y'] !== 'number' ||
    typeof o['scale'] !== 'number' ||
    !Number.isFinite(o['x']) ||
    !Number.isFinite(o['y']) ||
    !Number.isFinite(o['scale'])
  ) {
    return null;
  }
  return { x: o['x'], y: o['y'], scale: o['scale'] };
}

function parseNode(item: unknown): WorkflowNode | null {
  if (!item || typeof item !== 'object') {
    return null;
  }
  const o = item as Record<string, unknown>;
  if (typeof o['id'] !== 'string' || !o['id']) {
    return null;
  }
  if (!(ALLOWED_NODE_TYPES as readonly string[]).includes(o['type'] as string)) {
    return null;
  }
  if (typeof o['label'] !== 'string' || typeof o['subtitle'] !== 'string') {
    return null;
  }
  if (!NODE_STATUSES.includes(o['status'] as NodeStatus)) {
    return null;
  }
  const pos = o['position'];
  if (!pos || typeof pos !== 'object') {
    return null;
  }
  const p = pos as Record<string, unknown>;
  if (typeof p['x'] !== 'number' || typeof p['y'] !== 'number') {
    return null;
  }
  const data =
    o['data'] && typeof o['data'] === 'object' && !Array.isArray(o['data'])
      ? structuredClone(o['data']) as Record<string, unknown>
      : {};
  return {
    id: o['id'],
    type: o['type'] as NodeType,
    label: o['label'],
    subtitle: o['subtitle'],
    position: { x: p['x'], y: p['y'] },
    status: o['status'] as NodeStatus,
    data,
  };
}

function parseEdge(item: unknown): WorkflowEdge | null {
  if (!item || typeof item !== 'object') {
    return null;
  }
  const o = item as Record<string, unknown>;
  if (typeof o['id'] !== 'string' || typeof o['source'] !== 'string' || typeof o['target'] !== 'string') {
    return null;
  }
  const label = typeof o['label'] === 'string' ? o['label'] : '';
  const condition = typeof o['condition'] === 'string' ? o['condition'] : '';
  const waypoints: { x: number; y: number }[] = [];
  if (Array.isArray(o['waypoints'])) {
    for (const wp of o['waypoints']) {
      if (!wp || typeof wp !== 'object') {
        return null;
      }
      const w = wp as Record<string, unknown>;
      if (typeof w['x'] !== 'number' || typeof w['y'] !== 'number') {
        return null;
      }
      waypoints.push({ x: w['x'], y: w['y'] });
    }
  }
  const sourceSide = parsePortSide(o['sourceSide']);
  const targetSide = parsePortSide(o['targetSide']);
  return {
    id: o['id'],
    source: o['source'],
    target: o['target'],
    label,
    condition,
    waypoints,
    ...(sourceSide ? { sourceSide } : {}),
    ...(targetSide ? { targetSide } : {}),
  };
}

const PORT_SIDES = new Set(['left', 'right', 'top', 'bottom']);

function parsePortSide(v: unknown): 'left' | 'right' | 'top' | 'bottom' | undefined {
  return typeof v === 'string' && PORT_SIDES.has(v)
    ? (v as 'left' | 'right' | 'top' | 'bottom')
    : undefined;
}

export function toDownloadFilename(workflowName: string, date = new Date()): string {
  const sanitized =
    workflowName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'workflow';
  const iso = date.toISOString().slice(0, 10);
  return `${sanitized}-${iso}.json`;
}
