import { isAllowedNodeType } from './theme.utils';
import { findPaletteItem, type PaletteItem } from './palette.catalog';
import type { NodeType, WorkflowNode } from './workflow.models';
import type { Point } from './viewport.math';

const ID_PATTERN = /^n-[A-Za-z]+-[a-z0-9]+$/;

export function newNodeId(type: NodeType): string {
  const rand = Math.random().toString(36).slice(2, 6);
  return `n-${type}-${rand}`;
}

export function isValidCreatedNodeId(id: string, type: NodeType): boolean {
  return id.startsWith(`n-${type}-`) && ID_PATTERN.test(id);
}

export function createWorkflowNode(type: NodeType, position: Point): WorkflowNode | null {
  if (!isAllowedNodeType(type)) {
    return null;
  }
  const item = findPaletteItem(type);
  if (!item) {
    return null;
  }
  return createWorkflowNodeFromPaletteItem(item, position);
}

export function createWorkflowNodeFromPaletteItem(
  item: PaletteItem,
  position: Point,
): WorkflowNode | null {
  if (!isAllowedNodeType(item.type)) {
    return null;
  }
  const data: Record<string, unknown> = {};
  if (item.taskMeta) {
    data['ensoTask'] = { ...item.taskMeta };
  }
  return {
    id: newNodeId(item.type),
    type: item.type,
    label: item.label,
    subtitle: item.description,
    position: { x: position.x, y: position.y },
    status: 'idle',
    data,
  };
}
