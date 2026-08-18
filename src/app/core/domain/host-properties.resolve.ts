import {
  isPlainObject,
  logicBuiltinPropertiesSchema,
  sanitizeHostPropertiesSchema,
  type HostPropertiesSchema,
} from './host-properties.schema';
import type { WorkflowNode } from './workflow.models';

export interface HostPropertiesSchemaSource {
  schemaFor(node: WorkflowNode): HostPropertiesSchema | null;
}

/**
 * First-win: plain-object `node.data.propertiesSchema` (including `{}`) → adapter `schemaFor`
 * (throw / non-object treated as no adapter) → logic built-in → null.
 */
export function resolveHostPropertiesSchema(
  node: WorkflowNode,
  adapter: HostPropertiesSchemaSource | null | undefined,
): HostPropertiesSchema | null {
  const raw = node.data['propertiesSchema'];
  if (isPlainObject(raw)) {
    return sanitizeHostPropertiesSchema(raw);
  }
  if (adapter) {
    try {
      const fromAdapter = adapter.schemaFor(node);
      if (isPlainObject(fromAdapter)) {
        return sanitizeHostPropertiesSchema(fromAdapter);
      }
    } catch {
      // Treat throw as no adapter; continue to built-ins / General.
    }
  }
  return logicBuiltinPropertiesSchema(node.type);
}
