import type { Point } from './viewport.math';
import { NODE_CARD_HEIGHT, NODE_CARD_WIDTH } from './viewport.math';
import type { WorkflowEdge, WorkflowNode } from './workflow.models';

export type LayoutMode = 'vertical' | 'horizontal' | 'layered';

export const LAYOUT_NODE_GAP_X = 140;
export const LAYOUT_NODE_GAP_Y = 96;
export const LAYOUT_RANK_GAP_X = 340;
export const LAYOUT_ORIGIN_X = 80;
export const LAYOUT_ORIGIN_Y = 80;

export type PositionMap = ReadonlyMap<string, Point>;

/** Pack nodes along Y (top → bottom), preserving relative X order lightly by sorting x then id. */
export function layoutVertical(
  nodes: readonly WorkflowNode[],
  gapY = LAYOUT_NODE_GAP_Y,
  originX = LAYOUT_ORIGIN_X,
  originY = LAYOUT_ORIGIN_Y,
): PositionMap {
  const sorted = [...nodes].sort((a, b) => a.position.x - b.position.x || a.id.localeCompare(b.id));
  const out = new Map<string, Point>();
  sorted.forEach((n, i) => {
    out.set(n.id, {
      x: originX,
      y: originY + i * (NODE_CARD_HEIGHT + gapY),
    });
  });
  return out;
}

/** Pack nodes along X (left → right), preserving relative Y order lightly by sorting y then id. */
export function layoutHorizontal(
  nodes: readonly WorkflowNode[],
  gapX = LAYOUT_NODE_GAP_X,
  originX = LAYOUT_ORIGIN_X,
  originY = LAYOUT_ORIGIN_Y,
): PositionMap {
  const sorted = [...nodes].sort((a, b) => a.position.y - b.position.y || a.id.localeCompare(b.id));
  const out = new Map<string, Point>();
  sorted.forEach((n, i) => {
    out.set(n.id, {
      x: originX + i * (NODE_CARD_WIDTH + gapX),
      y: originY,
    });
  });
  return out;
}

/**
 * Left→right layered layout: BFS ranks from indegree-0 (prefer Trigger seeds).
 * Within a rank, stack on Y.
 */
export function layoutLayered(
  nodes: readonly WorkflowNode[],
  edges: readonly WorkflowEdge[],
  rankGapX = LAYOUT_RANK_GAP_X,
  gapY = LAYOUT_NODE_GAP_Y,
  originX = LAYOUT_ORIGIN_X,
  originY = LAYOUT_ORIGIN_Y,
): PositionMap {
  if (nodes.length === 0) {
    return new Map();
  }

  const ids = new Set(nodes.map((n) => n.id));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const outgoing = new Map<string, string[]>();
  const indegree = new Map<string, number>();
  for (const id of ids) {
    outgoing.set(id, []);
    indegree.set(id, 0);
  }
  for (const e of edges) {
    if (!ids.has(e.source) || !ids.has(e.target) || e.source === e.target) {
      continue;
    }
    outgoing.get(e.source)!.push(e.target);
    indegree.set(e.target, (indegree.get(e.target) ?? 0) + 1);
  }

  const seeds = [...ids].filter((id) => (indegree.get(id) ?? 0) === 0);
  seeds.sort((a, b) => {
    const ta = byId.get(a)?.type === 'Trigger' ? 0 : 1;
    const tb = byId.get(b)?.type === 'Trigger' ? 0 : 1;
    return ta - tb || a.localeCompare(b);
  });

  const rank = new Map<string, number>();
  const queue = [...seeds];
  for (const s of seeds) {
    rank.set(s, 0);
  }

  while (queue.length > 0) {
    const id = queue.shift()!;
    const r = rank.get(id) ?? 0;
    for (const t of outgoing.get(id) ?? []) {
      const next = r + 1;
      const prev = rank.get(t);
      if (prev === undefined || next > prev) {
        // Prefer longer path ranks for left→right layering on DAGs; cycles: take max seen once visited carefully
        if (prev === undefined) {
          rank.set(t, next);
          queue.push(t);
        } else if (next > prev && next < nodes.length) {
          rank.set(t, next);
          queue.push(t);
        }
      }
    }
  }

  // Disconnected / unreachable nodes → trailing ranks
  let maxRank = 0;
  for (const r of rank.values()) {
    maxRank = Math.max(maxRank, r);
  }
  for (const id of ids) {
    if (!rank.has(id)) {
      maxRank += 1;
      rank.set(id, maxRank);
    }
  }

  const buckets = new Map<number, string[]>();
  for (const [id, r] of rank) {
    const list = buckets.get(r) ?? [];
    list.push(id);
    buckets.set(r, list);
  }
  for (const list of buckets.values()) {
    list.sort((a, b) => a.localeCompare(b));
  }

  const out = new Map<string, Point>();
  const ranks = [...buckets.keys()].sort((a, b) => a - b);
  for (const r of ranks) {
    const list = buckets.get(r)!;
    list.forEach((id, i) => {
      out.set(id, {
        x: originX + r * rankGapX,
        y: originY + i * (NODE_CARD_HEIGHT + gapY),
      });
    });
  }
  return out;
}

export function applyLayoutMode(
  mode: LayoutMode,
  nodes: readonly WorkflowNode[],
  edges: readonly WorkflowEdge[],
): PositionMap {
  switch (mode) {
    case 'vertical':
      return layoutVertical(nodes);
    case 'horizontal':
      return layoutHorizontal(nodes);
    case 'layered':
      return layoutLayered(nodes, edges);
  }
}

/** Rank index for layered layout (for tests / PBT). */
export function layeredRanks(
  nodes: readonly WorkflowNode[],
  edges: readonly WorkflowEdge[],
): Map<string, number> {
  const positions = layoutLayered(nodes, edges);
  // Reconstruct ranks from x columns
  const xs = [...new Set([...positions.values()].map((p) => p.x))].sort((a, b) => a - b);
  const xToRank = new Map(xs.map((x, i) => [x, i]));
  const ranks = new Map<string, number>();
  for (const [id, p] of positions) {
    ranks.set(id, xToRank.get(p.x) ?? 0);
  }
  return ranks;
}
