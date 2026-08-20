/** Built-in library property defaults when host config omits schema/seeds (U-DP-01). */

import {
  isPlainObject,
  sanitizeHostPropertiesSchema,
  type HostPropertiesField,
  type HostPropertiesSchema,
} from './host-properties.schema';
import { ALLOWED_NODE_TYPES, type NodeType } from './workflow.models';

export interface LibraryPropertiesDefaults {
  propertiesSchema: HostPropertiesSchema;
  properties: Record<string, unknown>;
}

/** Per-path enable flags (omit/`true` = on; only `false` disables). */
export type LibraryPropertyEnableMap = Readonly<Partial<Record<string, boolean>>>;

/** Global host overlay: which library defaults are on per node type. */
export type PropertiesDefaultsConfig = Readonly<
  Partial<Record<NodeType, LibraryPropertyEnableMap>>
>;

/** Shared package library defaults — name + description only for every node type. */
const PACKAGE_LIBRARY_DEFAULTS: LibraryPropertiesDefaults = {
  propertiesSchema: {
    sections: [
      {
        title: 'General',
        fields: [
          { type: 'text', path: 'name', label: 'Name', required: true },
          { type: 'textarea', path: 'description', label: 'Description' },
        ],
      },
    ],
  },
  properties: { name: '', description: '' },
};

/** Full map: every allowed type shares the same name + description defaults. */
export const LIBRARY_PROPERTIES_BY_TYPE: Readonly<
  Record<NodeType, LibraryPropertiesDefaults>
> = Object.fromEntries(
  ALLOWED_NODE_TYPES.map((type) => [type, PACKAGE_LIBRARY_DEFAULTS]),
) as Record<NodeType, LibraryPropertiesDefaults>;

function libraryPathsForType(type: NodeType): string[] {
  return LIBRARY_PROPERTIES_BY_TYPE[type].propertiesSchema.sections.flatMap((s) =>
    s.fields.map((f) => f.path),
  );
}

/** Path is enabled unless explicitly set to `false` (global then card override). */
export function isLibraryPropertyEnabled(
  path: string,
  globalForType?: LibraryPropertyEnableMap | null,
  cardOverride?: LibraryPropertyEnableMap | null,
): boolean {
  if (cardOverride && path in cardOverride) {
    return cardOverride[path] !== false;
  }
  if (globalForType && path in globalForType) {
    return globalForType[path] !== false;
  }
  return true;
}

export function resolveLibraryEnableMap(
  type: NodeType,
  global?: PropertiesDefaultsConfig | null,
  cardOverride?: LibraryPropertyEnableMap | null,
): Readonly<Record<string, boolean>> {
  const globalForType = global?.[type] ?? null;
  const out: Record<string, boolean> = {};
  for (const path of libraryPathsForType(type)) {
    out[path] = isLibraryPropertyEnabled(path, globalForType, cardOverride);
  }
  return out;
}

function filterSchemaByEnableMap(
  schema: HostPropertiesSchema,
  enableMap: Readonly<Record<string, boolean>>,
): HostPropertiesSchema {
  const sections = schema.sections
    .map((section) => ({
      ...section,
      fields: section.fields.filter((f) => enableMap[f.path] !== false),
    }))
    .filter((section) => section.fields.length > 0);
  return { sections };
}

export function libraryPropertiesSchemaForType(
  type: NodeType,
  global?: PropertiesDefaultsConfig | null,
  cardOverride?: LibraryPropertyEnableMap | null,
): HostPropertiesSchema | null {
  const enableMap = resolveLibraryEnableMap(type, global, cardOverride);
  const filtered = filterSchemaByEnableMap(
    LIBRARY_PROPERTIES_BY_TYPE[type].propertiesSchema,
    enableMap,
  );
  if (filtered.sections.length === 0) {
    return null;
  }
  return sanitizeHostPropertiesSchema(filtered);
}

export function libraryPropertiesSeedForType(
  type: NodeType,
  global?: PropertiesDefaultsConfig | null,
  cardOverride?: LibraryPropertyEnableMap | null,
): Record<string, unknown> | null {
  const enableMap = resolveLibraryEnableMap(type, global, cardOverride);
  const full = LIBRARY_PROPERTIES_BY_TYPE[type].properties;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(full)) {
    if (enableMap[key] !== false) {
      out[key] = value;
    }
  }
  return Object.keys(out).length > 0 ? out : null;
}

/** Sanitize a card/global enable overlay (unknown keys kept only if boolean). */
export function sanitizeLibraryPropertyEnableMap(
  raw: unknown,
): LibraryPropertyEnableMap | undefined {
  if (!isPlainObject(raw)) {
    return undefined;
  }
  const out: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof key === 'string' && key.trim().length > 0 && typeof value === 'boolean') {
      out[key.trim()] = value;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export function sanitizePropertiesDefaultsConfig(
  raw: unknown,
): PropertiesDefaultsConfig | undefined {
  if (!isPlainObject(raw)) {
    return undefined;
  }
  const out: Partial<Record<NodeType, LibraryPropertyEnableMap>> = {};
  for (const type of ALLOWED_NODE_TYPES) {
    if (type in raw) {
      const map = sanitizeLibraryPropertyEnableMap(raw[type]);
      if (map) {
        out[type] = map;
      }
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function fieldPathKey(field: HostPropertiesField): string {
  return field.path;
}

/** Merge library + host schemas; host fields win on the same `path`. */
export function mergePropertiesSchemas(
  library: HostPropertiesSchema | null | undefined,
  host: HostPropertiesSchema | null | undefined,
): HostPropertiesSchema | null {
  const lib = library ? sanitizeHostPropertiesSchema(library) : null;
  const hostSan = host && isPlainObject(host) ? sanitizeHostPropertiesSchema(host) : null;
  if (!lib && !hostSan) {
    return null;
  }
  if (!lib) {
    return hostSan;
  }
  if (!hostSan) {
    return lib;
  }
  const hostPaths = new Set(
    hostSan.sections.flatMap((s) => s.fields.map(fieldPathKey)),
  );
  const libSections = lib.sections
    .map((section) => ({
      ...section,
      fields: section.fields.filter((f) => !hostPaths.has(f.path)),
    }))
    .filter((s) => s.fields.length > 0);
  return {
    sections: [...libSections, ...hostSan.sections],
  };
}

export function mergePropertySeeds(
  library: Record<string, unknown> | null | undefined,
  host: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null {
  if (!library && !host) {
    return null;
  }
  return { ...(library ?? {}), ...(host ?? {}) };
}
