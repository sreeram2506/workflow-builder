import { isAllowedNodeType } from './theme.utils';
import { findPaletteItem, type PaletteItem } from './palette.catalog';
import type { NodeType, WorkflowNode } from './workflow.models';
import type { Point } from './viewport.math';
import { sanitizeIconUrl } from './icon-url';
import { isPlainObject, sanitizeHostPropertiesSchema } from './host-properties.schema';

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
  if (item) {
    return createWorkflowNodeFromPaletteItem(item, position);
  }
  // Allowed types omitted from Nodes Library (e.g. AIAgent) still create via type.
  return {
    id: newNodeId(type),
    type,
    label: type === 'AIAgent' ? 'Blank Agent' : type,
    subtitle: '',
    position: { x: position.x, y: position.y },
    status: 'idle',
    data: {},
  };
}

export function createWorkflowNodeFromPaletteItem(
  item: PaletteItem,
  position: Point,
): WorkflowNode | null {
  if (!isAllowedNodeType(item.type)) {
    return null;
  }
    const data: Record<string, unknown> = {
    paletteKey: item.key,
  };
  if (item.taskMeta) {
    data['taskMeta'] = { ...item.taskMeta };
  }
  if (item.metadata) {
    data['metadata'] = { ...item.metadata };
  }
  if (isPlainObject(item.propertiesSchema)) {
    data['propertiesSchema'] = sanitizeHostPropertiesSchema(item.propertiesSchema);
  }
  const iconUrl = sanitizeIconUrl(item.iconUrl);
  if (iconUrl) {
    data['iconUrl'] = iconUrl;
  }
  if (item.iconPath && item.iconPath.trim().length > 0) {
    data['iconPath'] = item.iconPath.trim();
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

/** Reuse an existing AIAgent that was created from the same palette row. */
export function findExistingAgentForPaletteItem(
  nodes: readonly WorkflowNode[],
  item: PaletteItem,
): WorkflowNode | undefined {
  if (item.type !== 'AIAgent') {
    return undefined;
  }
  return nodes.find((n) => {
    if (n.type !== 'AIAgent') {
      return false;
    }
    const key = n.data?.['paletteKey'];
    if (typeof key === 'string' && key.length > 0) {
      return key === item.key;
    }
    return n.label === item.label;
  });
}
