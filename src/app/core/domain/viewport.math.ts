import type { Viewport } from './workflow.models';

export const ZOOM_MIN = 0.25;
export const ZOOM_MAX = 2.0;
export const ZOOM_STEP = 0.1;

export const NODE_CARD_WIDTH = 220;
export const NODE_CARD_HEIGHT = 72;

export interface Point {
  x: number;
  y: number;
}

export function clampZoom(scale: number): number {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, scale));
}

export function screenToWorld(screen: Point, viewport: Viewport): Point {
  return {
    x: (screen.x - viewport.x) / viewport.scale,
    y: (screen.y - viewport.y) / viewport.scale,
  };
}

export function worldToScreen(world: Point, viewport: Viewport): Point {
  return {
    x: world.x * viewport.scale + viewport.x,
    y: world.y * viewport.scale + viewport.y,
  };
}

export function panBy(viewport: Viewport, dx: number, dy: number): Viewport {
  return { ...viewport, x: viewport.x + dx, y: viewport.y + dy };
}

/** Zoom so the world point under `screen` stays fixed. */
export function zoomAt(viewport: Viewport, screen: Point, factor: number): Viewport {
  const world = screenToWorld(screen, viewport);
  const scale = clampZoom(viewport.scale * factor);
  return {
    scale,
    x: screen.x - world.x * scale,
    y: screen.y - world.y * scale,
  };
}

export function zoomTowardCenter(
  viewport: Viewport,
  viewWidth: number,
  viewHeight: number,
  factor: number,
): Viewport {
  return zoomAt(viewport, { x: viewWidth / 2, y: viewHeight / 2 }, factor);
}

export function resetZoom(viewport: Viewport, viewWidth: number, viewHeight: number): Viewport {
  const centerWorld = screenToWorld({ x: viewWidth / 2, y: viewHeight / 2 }, viewport);
  const scale = 1;
  return {
    scale,
    x: viewWidth / 2 - centerWorld.x * scale,
    y: viewHeight / 2 - centerWorld.y * scale,
  };
}

export function viewportTransformCss(viewport: Viewport): string {
  return `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function normalizeRect(a: Point, b: Point): Rect {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  return { x, y, width: Math.abs(b.x - a.x), height: Math.abs(b.y - a.y) };
}

export function rectsIntersect(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export function nodeBounds(position: Point, width = NODE_CARD_WIDTH, height = NODE_CARD_HEIGHT): Rect {
  return { x: position.x, y: position.y, width, height };
}

export function nodeMidpoint(position: Point, width = NODE_CARD_WIDTH, height = NODE_CARD_HEIGHT): Point {
  return { x: position.x + width / 2, y: position.y + height / 2 };
}

/** Outgoing port — right-center of the card (Workflow Builder–style). */
export function sourcePort(position: Point, width = NODE_CARD_WIDTH, height = NODE_CARD_HEIGHT): Point {
  return portOnSide(position, width, height, 'right');
}

/** Incoming port — left-center of the card. */
export function targetPort(position: Point, width = NODE_CARD_WIDTH, height = NODE_CARD_HEIGHT): Point {
  return portOnSide(position, width, height, 'left');
}

export type PortSide = 'left' | 'right' | 'top' | 'bottom';

export function portOnSide(
  position: Point,
  width = NODE_CARD_WIDTH,
  height = NODE_CARD_HEIGHT,
  side: PortSide,
): Point {
  switch (side) {
    case 'left':
      return { x: position.x, y: position.y + height / 2 };
    case 'right':
      return { x: position.x + width, y: position.y + height / 2 };
    case 'top':
      return { x: position.x + width / 2, y: position.y };
    case 'bottom':
      return { x: position.x + width / 2, y: position.y + height };
  }
}

/** Choose facing sides so edges leave/enter the nearer edges (helps vertical layouts). */
export function facingPorts(
  sourcePos: Point,
  targetPos: Point,
  width = NODE_CARD_WIDTH,
  height = NODE_CARD_HEIGHT,
): { start: Point; end: Point; sourceSide: PortSide; targetSide: PortSide } {
  const sm = nodeMidpoint(sourcePos, width, height);
  const tm = nodeMidpoint(targetPos, width, height);
  const dx = tm.x - sm.x;
  const dy = tm.y - sm.y;
  let sourceSide: PortSide;
  let targetSide: PortSide;
  if (Math.abs(dx) >= Math.abs(dy)) {
    sourceSide = dx >= 0 ? 'right' : 'left';
    targetSide = dx >= 0 ? 'left' : 'right';
  } else {
    sourceSide = dy >= 0 ? 'bottom' : 'top';
    targetSide = dy >= 0 ? 'top' : 'bottom';
  }
  return {
    start: portOnSide(sourcePos, width, height, sourceSide),
    end: portOnSide(targetPos, width, height, targetSide),
    sourceSide,
    targetSide,
  };
}

/** Cubic bezier that works for horizontal or vertical-dominant spans. */
export function smoothEdgePath(a: Point, b: Point): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    const c = Math.max(40, Math.abs(dx) * 0.5);
    const sx = dx >= 0 ? 1 : -1;
    return `M ${a.x} ${a.y} C ${a.x + sx * c} ${a.y}, ${b.x - sx * c} ${b.y}, ${b.x} ${b.y}`;
  }
  const c = Math.max(40, Math.abs(dy) * 0.5);
  const sy = dy >= 0 ? 1 : -1;
  return `M ${a.x} ${a.y} C ${a.x} ${a.y + sy * c}, ${b.x} ${b.y - sy * c}, ${b.x} ${b.y}`;
}

/** Horizontal cubic bezier between source (right) and target (left) ports. */
export function horizontalBezierPath(a: Point, b: Point): string {
  return smoothEdgePath(a, b);
}

export interface FitToContentOptions {
  nodeWidth?: number;
  nodeHeight?: number;
  /** Screen-space padding around content. */
  padding?: number;
}

/**
 * Fit all node cards into the view (world AABB → viewport), clamping zoom.
 * Empty graph → centered identity-ish viewport at scale 1.
 */
export function fitToContent(
  nodes: readonly { position: Point }[],
  viewWidth: number,
  viewHeight: number,
  options: FitToContentOptions = {},
): Viewport {
  const w = options.nodeWidth ?? NODE_CARD_WIDTH;
  const h = options.nodeHeight ?? NODE_CARD_HEIGHT;
  const pad = options.padding ?? 48;

  if (nodes.length === 0 || viewWidth <= 0 || viewHeight <= 0) {
    return { x: viewWidth / 2, y: viewHeight / 2, scale: 1 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const n of nodes) {
    minX = Math.min(minX, n.position.x);
    minY = Math.min(minY, n.position.y);
    maxX = Math.max(maxX, n.position.x + w);
    maxY = Math.max(maxY, n.position.y + h);
  }

  const contentW = Math.max(1, maxX - minX);
  const contentH = Math.max(1, maxY - minY);
  const availW = Math.max(1, viewWidth - pad * 2);
  const availH = Math.max(1, viewHeight - pad * 2);
  const scale = clampZoom(Math.min(availW / contentW, availH / contentH));

  const worldCx = (minX + maxX) / 2;
  const worldCy = (minY + maxY) / 2;
  return {
    scale,
    x: viewWidth / 2 - worldCx * scale,
    y: viewHeight / 2 - worldCy * scale,
  };
}
