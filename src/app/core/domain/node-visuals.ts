import type { NodeStatus, NodeType } from './workflow.models';
import { LOGIC_NODE_SIZE, NODE_CARD_HEIGHT, NODE_CARD_WIDTH } from './viewport.math';

/** CSS custom property names (or fallback colors) for category accents. */
export function accentTokenForType(type: NodeType): string {
  switch (type) {
    case 'Trigger':
      return 'var(--wb-node-trigger)';
    case 'Action':
      return 'var(--wb-node-action)';
    case 'Condition':
    case 'Decision':
    case 'Repeater':
      return 'var(--wb-node-condition)';
    case 'Delay':
      return 'var(--wb-node-delay)';
    case 'Notification':
      return 'var(--wb-node-notification)';
    case 'AIAgent':
      return 'var(--wb-node-ai)';
    case 'End':
      return 'var(--wb-node-end)';
    default:
      return 'var(--wb-accent)';
  }
}

export function statusLabel(status: NodeStatus): string {
  return status;
}

/**
 * Initials from display name: "Complete" → CO, "Enrich Payload" → EP, "Webhook Trigger" → WT.
 */
export function initialsFromLabel(label: string): string {
  const words = label
    .trim()
    .split(/[\s/_-]+/)
    .map((w) => w.replace(/[^A-Za-z0-9]/g, ''))
    .filter(Boolean);
  if (words.length === 0) {
    return '?';
  }
  if (words.length === 1) {
    return words[0]!.slice(0, 2).toUpperCase();
  }
  return (words[0]!.charAt(0) + words[1]!.charAt(0)).toUpperCase();
}

/** True when label has 2+ words — allow wrapping to two lines with clamp/ellipsis. */
export function labelUsesTwoLines(label: string): boolean {
  return (
    label
      .trim()
      .split(/\s+/)
      .filter(Boolean).length >= 2
  );
}

/** @deprecated Prefer initialsFromLabel(node.label) */
export function iconGlyphForType(type: NodeType): string {
  switch (type) {
    case 'Trigger':
      return 'Tr';
    case 'Action':
      return 'Ac';
    case 'Condition':
      return 'Co';
    case 'Decision':
      return 'De';
    case 'Repeater':
      return 'Re';
    case 'Delay':
      return 'Dy';
    case 'Notification':
      return 'No';
    case 'AIAgent':
      return 'AI';
    case 'End':
      return 'En';
    default:
      return '?';
  }
}

export function isLogicNodeType(type: NodeType): boolean {
  return type === 'Condition' || type === 'Decision' || type === 'Repeater';
}

/** Canvas uses dedicated SVG shapes (not rectangle cards) for these types. */
export function isShapedNodeType(type: NodeType): boolean {
  return isLogicNodeType(type);
}

export type LogicShapeKind = 'rhombus' | 'router' | 'repeater';

export function logicShapeKind(type: NodeType): LogicShapeKind | null {
  switch (type) {
    case 'Condition':
      return 'rhombus';
    case 'Decision':
      return 'router';
    case 'Repeater':
      return 'repeater';
    default:
      return null;
  }
}

/** Card / shape size for layout, ports, and hit-testing. */
export function nodeSizeForType(type: NodeType): { width: number; height: number } {
  if (isShapedNodeType(type)) {
    return { width: LOGIC_NODE_SIZE, height: LOGIC_NODE_SIZE };
  }
  return { width: NODE_CARD_WIDTH, height: NODE_CARD_HEIGHT };
}

/** Simple inline SVG path (viewBox 0 0 24 24) per node type. */
export function iconPathForType(type: NodeType): string {
  switch (type) {
    case 'Trigger':
      return 'M13 2L4 14h7l-1 8 10-14h-7l1-6z';
    case 'Action':
      return 'M12 2a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v4h-2V8h-4v12h4v-2h2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4h2v2h4V8H6v2H4V8a2 2 0 0 1 2-2h4V4a2 2 0 0 1 2-2z';
    case 'Condition':
      // Three-way branch: longer stems, up / left / right
      return 'M12 18V3m0 0l-2.4 2.8M12 3l2.4 2.8M12 10H3m0 0l2.6-2.2M3 10l2.6 2.2M12 10h9m0 0l-2.6-2.2M21 10l-2.6 2.2';
    case 'Decision':
      // Y-fork with branch-aligned tips (matches canvas Router glyph)
      return 'M3 12h9M12 12l6-5.5M12 12l6 5.5M18 6.5l-2.6.35M18 6.5l-.35 2.6M18 17.5l-.35-2.6M18 17.5l-2.6-.35';
    case 'Repeater':
      // Dual CW sync arrows; tips on N/S arc ends (matches canvas Repeater glyph)
      return 'M7 16.5a7 7 0 0 1 5-11.5M12 5l-2.4-1.8M12 5l-2.4 1.8M17 7.5a7 7 0 0 1-5 11.5M12 19l2.4 1.8M12 19l2.4-1.8';
    case 'Delay':
      return 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 5v5.2l3.5 2.1-1 1.6L11 13V7h2z';
    case 'Notification':
      return 'M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22zm8-6V11a8 8 0 0 0-6.5-7.85V2.5a1.5 1.5 0 0 0-3 0v.65A8 8 0 0 0 4 11v5l-2 2v1h20v-1l-2-2z';
    case 'AIAgent':
      return 'M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v3a3 3 0 0 1-2 2.82V18a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-2.18A3 3 0 0 1 4 13v-3a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4zm-2 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z';
    case 'End':
      return 'M6 4h8a6 6 0 0 1 0 12h-4v4H8V4h-2zm2 2v8h6a4 4 0 0 0 0-8H8z';
    default:
      return 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z';
  }
}
