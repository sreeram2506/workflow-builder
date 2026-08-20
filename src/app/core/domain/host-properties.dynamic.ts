/** Dynamic `node.data.properties` map helpers (U-DP-01). */

import {
  isPlainObject,
  logicBuiltinPropertiesSchema,
  visibleHostSections,
  type HostPropertiesSchema,
} from './host-properties.schema';
import type { NodeType } from './workflow.models';

export type DynamicControlKind = 'text' | 'number' | 'boolean' | 'readonlyJson';

export function getPropertiesMap(data: Record<string, unknown> | null | undefined): Record<string, unknown> {
  const raw = data?.['properties'];
  if (!isPlainObject(raw)) {
    return {};
  }
  return { ...raw };
}

export function withPropertiesMap(
  data: Record<string, unknown>,
  map: Record<string, unknown>,
): Record<string, unknown> {
  return { ...data, properties: { ...map } };
}

export function inferControlKind(value: unknown): DynamicControlKind {
  if (value === null || value === undefined) {
    return 'text';
  }
  if (typeof value === 'string') {
    return 'text';
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return 'number';
  }
  if (typeof value === 'boolean') {
    return 'boolean';
  }
  return 'readonlyJson';
}

export function schemaCoveredPaths(schema: HostPropertiesSchema | null | undefined): Set<string> {
  if (!schema) {
    return new Set();
  }
  const paths = new Set<string>();
  for (const section of visibleHostSections(schema)) {
    for (const field of section.fields) {
      paths.add(field.path);
    }
  }
  return paths;
}

/** Built-in field paths that must not appear in the dynamic remaining list. */
export function builtInCollisionIds(type: NodeType): Set<string> {
  const builtin = logicBuiltinPropertiesSchema(type);
  if (!builtin) {
    return new Set();
  }
  return schemaCoveredPaths(builtin);
}

/**
 * Top-level keys of the properties map not covered by host schema paths
 * and not colliding with logic built-in field paths (exact string match).
 * Also skips roots of nested objects covered by dotted schema paths
 * (e.g. key `config` when covered includes `config.data.retrain`).
 */
export function listRemainingPropertyKeys(
  map: Record<string, unknown>,
  covered: ReadonlySet<string>,
  collisions: ReadonlySet<string>,
): string[] {
  return Object.keys(map).filter((key) => {
    if (covered.has(key) || collisions.has(key)) {
      return false;
    }
    for (const path of covered) {
      if (path.startsWith(`${key}.`)) {
        return false;
      }
    }
    return true;
  });
}
