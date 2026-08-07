import type { Theme } from './workflow.models';
import { ALLOWED_NODE_TYPES, type NodeType } from './workflow.models';

/** Binary theme flip — pure helper for PBT. */
export function nextTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark';
}

export function isAllowedNodeType(type: string): type is NodeType {
  return (ALLOWED_NODE_TYPES as readonly string[]).includes(type);
}
