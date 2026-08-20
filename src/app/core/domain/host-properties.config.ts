/** Unified host property config: one map entry = schema metadata + display value. */

import { setAtPath } from './config-path';
import {
  HOST_PROPERTIES_FIELD_TYPES,
  isPlainObject,
  isUnsafeFieldPath,
  sanitizeHostPropertiesSchema,
  type HostPropertiesField,
  type HostPropertiesFieldType,
  type HostPropertiesOption,
  type HostPropertiesSchema,
} from './host-properties.schema';

const FIELD_TYPE_SET = new Set<string>(HOST_PROPERTIES_FIELD_TYPES);

/**
 * Per-path host property definition (consumer-facing).
 * Key of the map is the field `path` under `node.data.properties`.
 */
export interface HostPropertyConfigEntry {
  type: HostPropertiesFieldType;
  label: string;
  required?: boolean;
  hidden?: boolean;
  options?: HostPropertiesOption[];
  placeholder?: string | null;
  ui_component?: string;
  /** Display / seed value on drop (written to `node.data.properties[path]`). */
  value?: unknown;
  /**
   * Whether this whole property (type, label, value, section, …) is shown.
   * Omit or `true` = show; `false` = omit from schema and seeds.
   */
  enabled?: boolean;
  /** Section title in the Properties panel (default: `Configuration`). */
  section?: string;
}

export type HostPropertiesConfigMap = Readonly<Record<string, HostPropertyConfigEntry>>;

export interface ExpandedHostProperties {
  propertiesSchema: HostPropertiesSchema;
  properties: Record<string, unknown>;
}

function asFieldType(value: unknown): HostPropertiesFieldType | null {
  return typeof value === 'string' && FIELD_TYPE_SET.has(value)
    ? (value as HostPropertiesFieldType)
    : null;
}

/** True when `properties` looks like a unified config map (entry objects with `type`). */
export function isHostPropertiesConfigMap(raw: unknown): raw is Record<string, unknown> {
  if (!isPlainObject(raw)) {
    return false;
  }
  const values = Object.values(raw);
  if (values.length === 0) {
    return false;
  }
  return values.every(
    (v) => isPlainObject(v) && typeof v['type'] === 'string' && FIELD_TYPE_SET.has(v['type']),
  );
}

function sanitizeEntry(
  path: string,
  raw: unknown,
): (HostPropertyConfigEntry & { path: string }) | null {
  if (!isPlainObject(raw) || isUnsafeFieldPath(path)) {
    return null;
  }
  const type = asFieldType(raw['type']);
  if (!type) {
    return null;
  }
  // Whole-property visibility (default true).
  if (raw['enabled'] === false) {
    return null;
  }
  const label =
    typeof raw['label'] === 'string' && raw['label'].trim().length > 0
      ? raw['label'].trim()
      : path.trim();
  const entry: HostPropertyConfigEntry & { path: string } = {
    path: path.trim(),
    type,
    label,
    enabled: true,
  };
  if (raw['required'] === true) {
    entry.required = true;
  }
  if (raw['hidden'] === true) {
    entry.hidden = true;
  }
  if (Array.isArray(raw['options'])) {
    entry.options = raw['options'] as HostPropertiesOption[];
  }
  if (typeof raw['placeholder'] === 'string') {
    entry.placeholder = raw['placeholder'];
  } else if (raw['placeholder'] === null) {
    entry.placeholder = null;
  }
  if (typeof raw['ui_component'] === 'string') {
    entry.ui_component = raw['ui_component'];
  }
  if ('value' in raw) {
    entry.value = raw['value'];
  }
  if (typeof raw['section'] === 'string' && raw['section'].trim().length > 0) {
    entry.section = raw['section'].trim();
  }
  return entry;
}

/**
 * Expand a unified `properties` config map into schema + seed values.
 * Entries with `enabled: false` are skipped entirely.
 */
export function expandHostPropertiesConfig(raw: unknown): ExpandedHostProperties | null {
  if (!isHostPropertiesConfigMap(raw)) {
    return null;
  }
  const bySection = new Map<string, HostPropertiesField[]>();
  let seeds: Record<string, unknown> = {};

  for (const [path, value] of Object.entries(raw)) {
    const entry = sanitizeEntry(path, value);
    if (!entry) {
      continue;
    }
    const field: HostPropertiesField = {
      type: entry.type,
      path: entry.path,
      label: entry.label,
    };
    if (entry.required) {
      field.required = true;
    }
    if (entry.hidden) {
      field.hidden = true;
    }
    if (entry.options) {
      field.options = entry.options;
    }
    if (entry.placeholder !== undefined) {
      field.placeholder = entry.placeholder;
    }
    if (entry.ui_component) {
      field.ui_component = entry.ui_component;
    }
    const sectionTitle = entry.section ?? 'Configuration';
    const list = bySection.get(sectionTitle) ?? [];
    list.push(field);
    bySection.set(sectionTitle, list);
    if ('value' in entry) {
      // Nest dotted paths so getAtPath/setAtPath in Properties match drop seeds.
      seeds = setAtPath(seeds, entry.path, entry.value);
    }
  }

  if (bySection.size === 0) {
    return null;
  }

  const sections = [...bySection.entries()].map(([title, fields]) => ({
    title,
    fields,
  }));
  return {
    propertiesSchema: sanitizeHostPropertiesSchema({ sections }),
    properties: seeds,
  };
}

/**
 * Apply host property config from a palette/agent row.
 * Prefers unified `properties` config map; otherwise uses legacy
 * `propertiesSchema` + plain seed `properties`.
 */
export function resolveCardPropertiesConfig(rec: Record<string, unknown>): {
  propertiesSchema?: HostPropertiesSchema;
  properties?: Record<string, unknown>;
} {
  const expanded = expandHostPropertiesConfig(rec['properties']);
  if (expanded) {
    return {
      propertiesSchema: expanded.propertiesSchema,
      properties: Object.keys(expanded.properties).length > 0 ? expanded.properties : undefined,
    };
  }
  const out: {
    propertiesSchema?: HostPropertiesSchema;
    properties?: Record<string, unknown>;
  } = {};
  if (isPlainObject(rec['propertiesSchema'])) {
    out.propertiesSchema = sanitizeHostPropertiesSchema(rec['propertiesSchema']);
  }
  if (isPlainObject(rec['properties']) && !isHostPropertiesConfigMap(rec['properties'])) {
    out.properties = { ...(rec['properties'] as Record<string, unknown>) };
  }
  return out;
}
