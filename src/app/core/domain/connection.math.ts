import { nodeSizeForType } from './node-visuals';
import {
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

export function pointNearNode(
  world: Point,
  position: Point,
  width: number,
  height: number,
  pad = NODE_HIT_PADDING,
): boolean {
  return (
    world.x >= position.x - pad &&
    world.x <= position.x + width + pad &&
    world.y >= position.y - pad &&
    world.y <= position.y + height + pad
  );
}

/** Nearest port on a node to a world point. */
export function nearestPortSide(
  world: Point,
  position: Point,
  width: number,
  height: number,
): PortSide {
  let best: PortSide = 'left';
  let bestDist = Infinity;
  for (const side of PORT_SIDES) {
    const port = portOnSide(position, width, height, side);
    const dist = Math.hypot(world.x - port.x, world.y - port.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = side;
    }
  }
  return best;
}

/**
 * Pick an input port by angle from node center (fixes Condition diamond flanks
 * where Euclidean distance prefers left/right over top/bottom).
 */
export function nearestInputSideByAngle(
  world: Point,
  position: Point,
  width: number,
  height: number,
): PortSide {
  const cx = position.x + width / 2;
  const cy = position.y + height / 2;
  const dx = world.x - cx;
  const dy = world.y - cy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  let best: PortSide = 'left';
  let bestScore = -Infinity;
  for (const side of INPUT_SIDES) {
    // Outward unit vector · direction-to-pointer
    const score = side === 'left' ? -ux : side === 'top' ? -uy : uy;
    if (score > bestScore) {
      bestScore = score;
      best = side;
    }
  }
  return best;
}

/** Match Condition rhombus SVG tips (`points="50,6 …"` → ~6% inset). */
export const RHOMBUS_PORT_INSET = 0.06;

export function portOnSideForNode(
  type: WorkflowNode['type'],
  position: Point,
  width: number,
  height: number,
  side: PortSide,
): Point {
  if (type === 'Condition') {
    const ix = width * RHOMBUS_PORT_INSET;
    const iy = height * RHOMBUS_PORT_INSET;
    switch (side) {
      case 'left':
        return { x: position.x + ix, y: position.y + height / 2 };
      case 'right':
        return { x: position.x + width - ix, y: position.y + height / 2 };
      case 'top':
        return { x: position.x + width / 2, y: position.y + iy };
      case 'bottom':
        return { x: position.x + width / 2, y: position.y + height - iy };
    }
  }
  return portOnSide(position, width, height, side);
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
      condition: '',
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
    condition: '',
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
  const sw = nodeSizeForType(s.type);
  const tw = nodeSizeForType(t.type);
  return {
    start: portOnSideForNode(s.type, s.position, sw.width, sw.height, locked.sourceSide!),
    end: portOnSideForNode(t.type, t.position, tw.width, tw.height, locked.targetSide!),
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
  const sw = nodeSizeForType(s.type);
  const tw = nodeSizeForType(t.type);
  const ports = facingPorts(s.position, t.position, sw.width, sw.height);
  const sourceSide = edge.sourceSide ?? ports.sourceSide;
  const sm = {
    x: s.position.x + sw.width / 2,
    y: s.position.y + sw.height / 2,
  };
  let targetSide = edge.targetSide;
  if (!targetSide || !isInputSide(targetSide)) {
    let best: PortSide = 'left';
    let bestDist = Infinity;
    for (const side of INPUT_SIDES) {
      const p = portOnSideForNode(t.type, t.position, tw.width, tw.height, side);
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
    const { width, height } = nodeSizeForType(n.type);
    for (const side of PORT_SIDES) {
      const port = portOnSideForNode(n.type, n.position, width, height, side);
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
 * 1) over/near node body → snap by **angle** to nearest input (diamond-safe)
 * 2) else exact handle hit within radius
 */
export function findConnectionTargetAt(
  world: Point,
  nodes: readonly WorkflowNode[],
  excludeNodeId: string | undefined,
  _sourceSide?: PortSide,
): HandleHit | null {
  let bestBody: { hit: HandleHit; dist: number } | null = null;
  for (const n of nodes) {
    if (excludeNodeId && n.id === excludeNodeId) {
      continue;
    }
    const { width, height } = nodeSizeForType(n.type);
    if (!pointNearNode(world, n.position, width, height)) {
      continue;
    }
    const side = nearestInputSideByAngle(world, n.position, width, height);
    const port = portOnSideForNode(n.type, n.position, width, height, side);
    const dist = Math.hypot(world.x - port.x, world.y - port.y);
    if (!bestBody || dist < bestBody.dist) {
      bestBody = { hit: { id: n.id, side }, dist };
    }
  }
  if (bestBody) {
    return bestBody.hit;
  }

  const handle = findTargetHandleAt(world, nodes, excludeNodeId);
  if (handle && isInputSide(handle.side)) {
    return handle;
  }
  // Raw handle on output (right): still return so resolveConnection can reject clearly
  return handle;
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
