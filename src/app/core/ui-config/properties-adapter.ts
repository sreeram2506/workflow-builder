import { InjectionToken } from '@angular/core';
import {
  isPlainObject,
  type HostPropertiesSchema,
} from '../domain/host-properties.schema';
import type { WorkflowNode } from '../domain/workflow.models';

export interface WorkflowBuilderPropertiesAdapter {
  schemaFor(node: WorkflowNode): HostPropertiesSchema | null;
}

/**
 * Instance `[properties]` on `wb-shell-layout` / agent shell.
 * Optional schema lookup for existing palette/agent `paletteKey`s — not a third catalog.
 * Prefer `propertiesSchema` on `[palettes]` / `[defaultAgents]` when possible.
 * Either a `schemaFor` adapter or a map keyed by `node.data.paletteKey`.
 */
export type HostPropertiesInput =
  | WorkflowBuilderPropertiesAdapter
  | Readonly<Record<string, HostPropertiesSchema>>;

export const WORKFLOW_BUILDER_PROPERTIES = new InjectionToken<WorkflowBuilderPropertiesAdapter>(
  'WORKFLOW_BUILDER_PROPERTIES',
);

/** Normalize instance `[properties]` to a schema source (or null). */
export function asPropertiesSchemaSource(
  input: HostPropertiesInput | null | undefined,
): WorkflowBuilderPropertiesAdapter | null {
  if (input == null) {
    return null;
  }
  if (typeof (input as WorkflowBuilderPropertiesAdapter).schemaFor === 'function') {
    return input as WorkflowBuilderPropertiesAdapter;
  }
  if (!isPlainObject(input)) {
    return null;
  }
  const map = input as Readonly<Record<string, HostPropertiesSchema>>;
  return {
    schemaFor(node: WorkflowNode): HostPropertiesSchema | null {
      const key = node.data['paletteKey'];
      if (typeof key !== 'string' || key.length === 0) {
        return null;
      }
      const schema = map[key];
      return isPlainObject(schema) ? schema : null;
    },
  };
}
