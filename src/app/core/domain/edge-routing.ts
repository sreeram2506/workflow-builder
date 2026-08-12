import { snapToGrid } from './connection.math';
import {
  NODE_CARD_HEIGHT,
  NODE_CARD_WIDTH,
  facingPorts,
  portOnSide,
  type Point,
  type Rect,
} from './viewport.math';
import type { WorkflowEdge, WorkflowNode } from './workflow.models';

export interface RouteEdgeOptions {
  gridSize?: number;
  obstaclePadding?: number;
  nodeWidth?: number;
  nodeHeight?: number;
}

export interface RouteEdgeResult {
  waypoints: Point[];
  usedFallback: boolean;
}

export interface RouteAllResult {
  byEdgeId: Map<string, Point[]>;
  anyFallback: boolean;
}

function key(cx: number, cy: number): string {
  return `${cx},${cy}`;
}

function cellOf(p: Point, grid: number): { cx: number; cy: number } {
  return { cx: Math.round(p.x / grid), cy: Math.round(p.y / grid) };
}

function worldOf(cx: number, cy: number, grid: number): Point {
  return { x: cx * grid, y: cy * grid };
}

function inflate(rect: Rect, pad: number): Rect {
  return {
    x: rect.x - pad,
    y: rect.y - pad,
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  };
}

function rectBlocksCell(rect: Rect, cx: number, cy: number, grid: number): boolean {
  const x0 = cx * grid - grid / 2;
  const y0 = cy * grid - grid / 2;
  const x1 = x0 + grid;
  const y1 = y0 + grid;
  return x0 < rect.x + rect.width && x1 > rect.x && y0 < rect.y + rect.height && y1 > rect.y;
}

function simplifyOrthogonal(points: Point[]): Point[] {
  if (points.length <= 2) {
    return points.map((p) => ({ ...p }));
  }
  const out: Point[] = [{ ...points[0]! }];
  for (let i = 1; i < points.length - 1; i++) {
    const prev = out[out.length - 1]!;
    const cur = points[i]!;
    const next = points[i + 1]!;
    const colinear =
      (prev.x === cur.x && cur.x === next.x) || (prev.y === cur.y && cur.y === next.y);
    if (!colinear) {
      out.push({ ...cur });
    }
  }
  out.push({ ...points[points.length - 1]! });
  return out;
}

/**
 * Medium obstacle-aware orthogonal route via grid A*.
 * Returns intermediate waypoints only (ports remain implicit via edge render).
 */
export function routeEdge(
  edge: WorkflowEdge,
  nodes: readonly WorkflowNode[],
  options: RouteEdgeOptions = {},
): RouteEdgeResult {
  const grid = options.gridSize ?? 16;
  const pad = options.obstaclePadding ?? 8;
  const w = options.nodeWidth ?? NODE_CARD_WIDTH;
  const h = options.nodeHeight ?? NODE_CARD_HEIGHT;

  const byId = new Map(nodes.map((n) => [n.id, n]));
  const src = byId.get(edge.source);
  const tgt = byId.get(edge.target);
  if (!src || !tgt) {
    return { waypoints: [], usedFallback: true };
  }

  const ports =
    edge.sourceSide && edge.targetSide
      ? {
          start: portOnSide(src.position, w, h, edge.sourceSide),
          end: portOnSide(tgt.position, w, h, edge.targetSide),
        }
      : facingPorts(src.position, tgt.position, w, h);
  const start = ports.start;
  const end = ports.end;
  const startCell = cellOf(start, grid);
  const endCell = cellOf(end, grid);

  const obstacles: Rect[] = [];
  for (const n of nodes) {
    if (n.id === edge.source || n.id === edge.target) {
      continue;
    }
    obstacles.push(inflate({ x: n.position.x, y: n.position.y, width: w, height: h }, pad));
  }

  const blocked = (cx: number, cy: number): boolean => {
    if (cx === startCell.cx && cy === startCell.cy) {
      return false;
    }
    if (cx === endCell.cx && cy === endCell.cy) {
      return false;
    }
    return obstacles.some((r) => rectBlocksCell(r, cx, cy, grid));
  };

  let minX = Math.min(start.x, end.x);
  let minY = Math.min(start.y, end.y);
  let maxX = Math.max(start.x, end.x);
  let maxY = Math.max(start.y, end.y);
  for (const n of nodes) {
    minX = Math.min(minX, n.position.x);
    minY = Math.min(minY, n.position.y);
    maxX = Math.max(maxX, n.position.x + w);
    maxY = Math.max(maxY, n.position.y + h);
  }
  const margin = grid * 8;
  const minCx = Math.floor((minX - margin) / grid);
  const maxCx = Math.ceil((maxX + margin) / grid);
  const minCy = Math.floor((minY - margin) / grid);
  const maxCy = Math.ceil((maxY + margin) / grid);

  type Rec = { cx: number; cy: number; g: number; f: number };
  const open: Rec[] = [];
  const openMap = new Map<string, Rec>();
  const closed = new Set<string>();
  const parent = new Map<string, string>();

  const hCost = (cx: number, cy: number) => Math.abs(cx - endCell.cx) + Math.abs(cy - endCell.cy);
  const startRec: Rec = {
    cx: startCell.cx,
    cy: startCell.cy,
    g: 0,
    f: hCost(startCell.cx, startCell.cy),
  };
  open.push(startRec);
  openMap.set(key(startCell.cx, startCell.cy), startRec);

  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ] as const;

  let foundKey: string | null = null;
  const maxIters = Math.max(64, (maxCx - minCx + 1) * (maxCy - minCy + 1) * 2);
  let iters = 0;

  while (open.length > 0 && iters++ < maxIters) {
    open.sort((a, b) => a.f - b.f || a.g - b.g);
    const cur = open.shift()!;
    const ck = key(cur.cx, cur.cy);
    openMap.delete(ck);
    if (closed.has(ck)) {
      continue;
    }
    closed.add(ck);

    if (cur.cx === endCell.cx && cur.cy === endCell.cy) {
      foundKey = ck;
      break;
    }

    for (const [dx, dy] of dirs) {
      const nx = cur.cx + dx;
      const ny = cur.cy + dy;
      if (nx < minCx || nx > maxCx || ny < minCy || ny > maxCy) {
        continue;
      }
      if (blocked(nx, ny)) {
        continue;
      }
      const nk = key(nx, ny);
      if (closed.has(nk)) {
        continue;
      }
      const g = cur.g + 1;
      const existing = openMap.get(nk);
      if (existing && existing.g <= g) {
        continue;
      }
      const rec: Rec = { cx: nx, cy: ny, g, f: g + hCost(nx, ny) };
      open.push(rec);
      openMap.set(nk, rec);
      parent.set(nk, ck);
    }
  }

  if (!foundKey) {
    return { waypoints: [], usedFallback: true };
  }

  const cells: { cx: number; cy: number }[] = [];
  let curK: string | undefined = foundKey;
  const startK = key(startCell.cx, startCell.cy);
  while (curK) {
    const parts = curK.split(',');
    cells.push({ cx: Number(parts[0]), cy: Number(parts[1]) });
    if (curK === startK) {
      break;
    }
    curK = parent.get(curK);
  }
  cells.reverse();

  const world = cells.map((c) => snapToGrid(worldOf(c.cx, c.cy, grid), grid));
  const simplified = simplifyOrthogonal(world);
  const mid =
    simplified.length <= 2 ? [] : simplified.slice(1, -1).map((p) => snapToGrid(p, grid));
  return { waypoints: mid, usedFallback: false };
}

export function routeAllEdges(
  edges: readonly WorkflowEdge[],
  nodes: readonly WorkflowNode[],
  options: RouteEdgeOptions = {},
): RouteAllResult {
  const byEdgeId = new Map<string, Point[]>();
  let anyFallback = false;
  for (const e of edges) {
    const r = routeEdge(e, nodes, options);
    byEdgeId.set(e.id, r.waypoints);
    if (r.usedFallback) {
      anyFallback = true;
    }
  }
  return { byEdgeId, anyFallback };
}
