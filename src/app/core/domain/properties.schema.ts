import type { NodeStatus, NodeType } from './workflow.models';
import { logicBuiltinPropertiesSchema, visibleHostSections } from './host-properties.schema';

export const LOGIC_NODE_TYPES: readonly NodeType[] = ['Condition', 'Decision', 'Repeater'];

export const NODE_STATUS_OPTIONS: readonly NodeStatus[] = [
  'idle',
  'running',
  'success',
  'error',
] as const;

/** Stable form control key for a field path (dots → underscores). */
export function controlKeyForPath(configPath: string): string {
  return configPath.replace(/\./g, '_');
}

export function isLogicNodeType(type: NodeType): boolean {
  return LOGIC_NODE_TYPES.includes(type);
}

export function configurationFieldPathsFor(type: NodeType): string[] {
  const schema = logicBuiltinPropertiesSchema(type);
  if (!schema) {
    return [];
  }
  return visibleHostSections(schema).flatMap((section) => section.fields.map((field) => field.path));
}
