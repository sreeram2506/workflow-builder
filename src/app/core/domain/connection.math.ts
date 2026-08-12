import {
  NODE_CARD_HEIGHT,
  NODE_CARD_WIDTH,
  facingPorts,
  portOnSide,
  smoothEdgePath,
  type Point,
  type PortSide,
} from './viewport.math';
import type { WorkflowEdge, WorkflowNode } from './workflow.models';

export const WAYPOINT_GRID = 16;
/** Generous hit radius so connectors feel like workflowbuilder.io / React Flow. */
export const HANDLE_HIT_RADIUS = 28;
/** Inflate node bounds so dropping on the card snaps to a port. */
export const NODE_HIT_PADDING = 14;
export const PORT_SIDES: readonly PortSide[] = ['left', 'right', 'top', 'bottom'];
/** Only right is an output; left/top/bottom are inputs. */
export const OUTPUT_SIDES: readonly PortSide[] = ['right'];
export const INPUT_SIDES: readonly PortSide[] = ['left', 'top', 'bottom'];

export type ConnectionInvalidReason =
  | 'missing-node'
  | 'self-loop'
  | 'invalid-target'
  | 'incompatible-ports';

export type ConnectionValidation =
  | { ok: true }
  | { ok: false; reason: ConnectionInvalidReason };

export interface HandleHit {
  id: string;
  side: PortSide;
}

export interface ResolvedConnection {
  sourceId: string;
  targetId: string;
  sourceSide: PortSide;
  targetSide: PortSide;
}

export function isOutputSide(side: PortSide): boolean {
  return side === 'right';
}

export function isInputSide(side: PortSide): boolean {
  return side === 'left' || side === 'top' || side === 'bottom';
}

export function portRole(side: PortSide): 'out' | 'in' {
  return isOutputSide(side) ? 'out' : 'in';
}

/** Valid targets are always inputs (left/top/bottom) — never connect to right (output). */
export function arePortsCompatible(sourceSide: PortSide, targetSide: PortSide): boolean {
  return isInputSide(targetSide);
}

/**
 * Normalize a drag into a stored edge.
 * - Any side → left/top/bottom: keep as-is (output→input or input→input)
 * - Anything → right: invalid (output is not a drop target)
 */
export function resolveConnection(
  fromId: string,
  fromSide: PortSide,
  toId: string,
  toSide: PortSide,
): ResolvedConnection | null {
  if (fromId === toId) {
    return null;
  }
  if (arePortsCompatible(fromSide, toSide)) {
    return {
      sourceId: fromId,
      targetId: toId,
      sourceSide: fromSide,
      targetSide: toSide,
    };
  }
  return null;
}

export function pointNearNode(world: Point, position: Point, pad = NODE_HIT_PADDING): boolean {
  return (
    world.x >= position.x - pad &&
    world.x <= position.x + NODE_CARD_WIDTH + pad &&
    world.y >= position.y - pad &&
    world.y <= position.y + NODE_CARD_HEIGHT + pad
  );
}

/** Nearest port on a node to a world point. */
export function nearestPortSide(world: Point, position: Point): PortSide {
  let best: PortSide = 'left';
  let bestDist = Infinity;
  for (const side of PORT_SIDES) {
    const port = portOnSide(position, NODE_CARD_WIDTH, NODE_CARD_HEIGHT, side);
    const dist = Math.hypot(world.x - port.x, world.y - port.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = side;
    }
  }
  return best;
}

export function snapToGrid(point: Point, grid = WAYPOINT_GRID): Point {
  return {
    x: Object.is(Math.round(point.x / grid) * grid, -0) ? 0 : Math.round(point.x / grid) * grid,
    y: Object.is(Math.round(point.y / grid) * grid, -0) ? 0 : Math.round(point.y / grid) * grid,
  };
}

export function newEdgeId(sourceId: string, targetId: string): string {
  const rand = Math.random().toString(36).slice(2, 6);
  return `e-${sourceId}-${targetId}-${rand}`;
}

export function isValidCreatedEdgeId(id: string, sourceId: string, targetId: string): boolean {
  return id.startsWith(`e-${sourceId}-${targetId}-`) && /^e-.+-.+-[a-z0-9]+$/.test(id);
}

export function validateConnection(
  sourceId: string,
  targetId: string,
  nodes: readonly WorkflowNode[],
  sourceSide?: PortSide,
  targetSide?: PortSide,
): ConnectionValidation {
  const ids = new Set(nodes.map((n) => n.id));
  if (!ids.has(sourceId) || !ids.has(targetId)) {
    return { ok: false, reason: 'missing-node' };
  }
  if (sourceId === targetId) {
    return { ok: false, reason: 'self-loop' };
  }
  if (sourceSide && targetSide && !resolveConnection(sourceId, sourceSide, targetId, targetSide)) {
    return { ok: false, reason: 'incompatible-ports' };
  }
  return { ok: true };
}

export function createWorkflowEdge(
  sourceId: string,
  targetId: string,
  nodes: readonly WorkflowNode[],
  sides?: { sourceSide: PortSide; targetSide: PortSide },
): WorkflowEdge | null {
  if (sides) {
    const resolved = resolveConnection(sourceId, sides.sourceSide, targetId, sides.targetSide);
    if (!resolved) {
      return null;
    }
    const v = validateConnection(resolved.sourceId, resolved.targetId, nodes);
    if (!v.ok) {
      return null;
    }
    return {
      id: newEdgeId(resolved.sourceId, resolved.targetId),
      source: resolved.sourceId,
      target: resolved.targetId,
      label: '',
      waypoints: [],
      sourceSide: resolved.sourceSide,
      targetSide: resolved.targetSide,
    };
  }
  const v = validateConnection(sourceId, targetId, nodes);
  if (!v.ok) {
    return null;
  }
  const draft: WorkflowEdge = {
    id: newEdgeId(sourceId, targetId),
    source: sourceId,
    target: targetId,
    label: '',
    waypoints: [],
  };
  return lockEdgePortSides(draft, nodes);
}

/** Build SVG path through source port → waypoints → target port. */
export function edgePathThroughWaypoints(start: Point, end: Point, waypoints: readonly Point[]): string {
  const points = [start, ...waypoints, end];
  if (points.length < 2) {
    return '';
  }
  if (points.length === 2) {
    return smoothEdgePath(points[0]!, points[1]!);
  }
  let d = `M ${points[0]!.x} ${points[0]!.y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!;
    const b = points[i + 1]!;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    if (Math.abs(dx) >= Math.abs(dy)) {
      const c = Math.max(40, Math.abs(dx) * 0.5);
      const sx = dx >= 0 ? 1 : -1;
      d += ` C ${a.x + sx * c} ${a.y}, ${b.x - sx * c} ${b.y}, ${b.x} ${b.y}`;
    } else {
      const c = Math.max(40, Math.abs(dy) * 0.5);
      const sy = dy >= 0 ? 1 : -1;
      d += ` C ${a.x} ${a.y + sy * c}, ${b.x} ${b.y - sy * c}, ${b.x} ${b.y}`;
    }
  }
  return d;
}

export function edgeRenderPoints(
  edge: WorkflowEdge,
  nodes: readonly WorkflowNode[],
): { start: Point; end: Point; waypoints: Point[] } | null {
  const s = nodes.find((n) => n.id === edge.source);
  const t = nodes.find((n) => n.id === edge.target);
  if (!s || !t) {
    return null;
  }
  const locked = lockEdgePortSides(edge, nodes);
  return {
    start: portOnSide(s.position, NODE_CARD_WIDTH, NODE_CARD_HEIGHT, locked.sourceSide!),
    end: portOnSide(t.position, NODE_CARD_WIDTH, NODE_CARD_HEIGHT, locked.targetSide!),
    waypoints: edge.waypoints.map((p) => ({ ...p })),
  };
}

/**
 * Ensure an edge has stable sourceSide/targetSide so attachments don't jump while nodes move.
 * Target is never right (output).
 */
export function lockEdgePortSides(
  edge: WorkflowEdge,
  nodes: readonly WorkflowNode[],
): WorkflowEdge {
  if (edge.sourceSide && edge.targetSide && isInputSide(edge.targetSide)) {
    return edge;
  }
  const s = nodes.find((n) => n.id === edge.source);
  const t = nodes.find((n) => n.id === edge.target);
  if (!s || !t) {
    return edge;
  }
  const ports = facingPorts(s.position, t.position, NODE_CARD_WIDTH, NODE_CARD_HEIGHT);
  const sourceSide = edge.sourceSide ?? ports.sourceSide;
  const sm = {
    x: s.position.x + NODE_CARD_WIDTH / 2,
    y: s.position.y + NODE_CARD_HEIGHT / 2,
  };
  let targetSide = edge.targetSide;
  if (!targetSide || !isInputSide(targetSide)) {
    let best: PortSide = 'left';
    let bestDist = Infinity;
    for (const side of INPUT_SIDES) {
      const p = portOnSide(t.position, NODE_CARD_WIDTH, NODE_CARD_HEIGHT, side);
      const d = Math.hypot(sm.x - p.x, sm.y - p.y);
      if (d < bestDist) {
        bestDist = d;
        best = side;
      }
    }
    targetSide = best;
  }
  return { ...edge, sourceSide, targetSide };
}

export function findTargetHandleAt(
  world: Point,
  nodes: readonly WorkflowNode[],
  excludeNodeId?: string,
): HandleHit | null {
  let best: { hit: HandleHit; dist: number } | null = null;
  for (const n of nodes) {
    if (excludeNodeId && n.id === excludeNodeId) {
      continue;
    }
    for (const side of PORT_SIDES) {
      const port = portOnSide(n.position, NODE_CARD_WIDTH, NODE_CARD_HEIGHT, side);
      const dist = Math.hypot(world.x - port.x, world.y - port.y);
      if (dist <= HANDLE_HIT_RADIUS && (!best || dist < best.dist)) {
        best = { hit: { id: n.id, side }, dist };
      }
    }
  }
  return best?.hit ?? null;
}

/**
 * Resolve a connection drop/hover target:
 * 1) exact handle hit, else
 * 2) drop on/near node body → snap to nearest **input** port (never right).
 */
export function findConnectionTargetAt(
  world: Point,
  nodes: readonly WorkflowNode[],
  excludeNodeId: string | undefined,
  _sourceSide?: PortSide,
): HandleHit | null {
  const handle = findTargetHandleAt(world, nodes, excludeNodeId);
  if (handle) {
    return handle;
  }

  let best: { hit: HandleHit; dist: number } | null = null;
  for (const n of nodes) {
    if (excludeNodeId && n.id === excludeNodeId) {
      continue;
    }
    if (!pointNearNode(world, n.position)) {
      continue;
    }
    for (const side of INPUT_SIDES) {
      const port = portOnSide(n.position, NODE_CARD_WIDTH, NODE_CARD_HEIGHT, side);
      const dist = Math.hypot(world.x - port.x, world.y - port.y);
      if (!best || dist < best.dist) {
        best = { hit: { id: n.id, side }, dist };
      }
    }
  }
  return best?.hit ?? null;
}

/** Insert index for a new waypoint along the path (nearest segment midpoint heuristic). */
export function insertWaypointIndex(
  click: Point,
  start: Point,
  end: Point,
  waypoints: readonly Point[],
): number {
  const pts = [start, ...waypoints, end];
  let bestIdx = 0;
  let bestDist = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    const mid = { x: (pts[i]!.x + pts[i + 1]!.x) / 2, y: (pts[i]!.y + pts[i + 1]!.y) / 2 };
    const d = Math.hypot(click.x - mid.x, click.y - mid.y);
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  }
  return bestIdx;
}
