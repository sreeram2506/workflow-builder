import { isAllowedNodeType } from './theme.utils';
import { findPaletteItem, type PaletteItem } from './palette.catalog';
import type { NodeType, WorkflowNode } from './workflow.models';
import type { Point } from './viewport.math';
import { sanitizeIconUrl } from './icon-url';
import { isPlainObject, sanitizeHostPropertiesSchema } from './host-properties.schema';
import { resolveCardPropertiesConfig } from './host-properties.config';
import {
  libraryPropertiesSchemaForType,
  libraryPropertiesSeedForType,
  mergePropertiesSchemas,
  mergePropertySeeds,
  type LibraryPropertyEnableMap,
  type PropertiesDefaultsConfig,
} from './host-properties.library';

const ID_PATTERN = /^n-[A-Za-z]+-[a-z0-9]+$/;

export function newNodeId(type: NodeType): string {
  const rand = Math.random().toString(36).slice(2, 6);
  return `n-${type}-${rand}`;
}

export function isValidCreatedNodeId(id: string, type: NodeType): boolean {
  return id.startsWith(`n-${type}-`) && ID_PATTERN.test(id);
}

function applyLibraryAndHostProperties(
  data: Record<string, unknown>,
  type: NodeType,
  item: {
    propertiesSchema?: unknown;
    properties?: unknown;
    libraryProperties?: LibraryPropertyEnableMap;
  },
  globalDefaults?: PropertiesDefaultsConfig | null,
  identity?: { label: string; description: string },
): void {
  const cardOverride = item.libraryProperties;
  const libSchema = libraryPropertiesSchemaForType(type, globalDefaults, cardOverride);
  const libSeed = libraryPropertiesSeedForType(type, globalDefaults, cardOverride);

  // Unified properties config map, or legacy schema + seed map.
  const resolved = resolveCardPropertiesConfig({
    propertiesSchema: item.propertiesSchema,
    properties: item.properties,
  });
  const hostSchema = resolved.propertiesSchema ?? null;
  const hostSeed = resolved.properties ?? null;

  const mergedSchema = mergePropertiesSchemas(libSchema, hostSchema);
  if (mergedSchema) {
    data['propertiesSchema'] = mergedSchema;
  }
  const mergedSeed = mergePropertySeeds(libSeed, hostSeed);
  if (mergedSeed) {
    if (identity && hostSeed && !Object.prototype.hasOwnProperty.call(hostSeed, 'name') && 'name' in mergedSeed) {
      mergedSeed['name'] = identity.label;
    } else if (identity && !hostSeed && 'name' in mergedSeed) {
      mergedSeed['name'] = identity.label;
    }
    if (
      identity &&
      hostSeed &&
      !Object.prototype.hasOwnProperty.call(hostSeed, 'description') &&
      'description' in mergedSeed
    ) {
      mergedSeed['description'] = identity.description;
    } else if (identity && !hostSeed && 'description' in mergedSeed) {
      mergedSeed['description'] = identity.description;
    }
    data['properties'] = mergedSeed;
  }
}

export function createWorkflowNode(
  type: NodeType,
  position: Point,
  globalDefaults?: PropertiesDefaultsConfig | null,
): WorkflowNode | null {
  if (!isAllowedNodeType(type)) {
    return null;
  }
  const item = findPaletteItem(type);
  if (item) {
    return createWorkflowNodeFromPaletteItem(item, position, globalDefaults);
  }
  // Allowed types omitted from Nodes Library (e.g. AIAgent) still create via type.
  const data: Record<string, unknown> = {};
  const label = type === 'AIAgent' ? 'Blank Agent' : type;
  applyLibraryAndHostProperties(data, type, {}, globalDefaults, {
    label,
    description: '',
  });
  return {
    id: newNodeId(type),
    type,
    label,
    subtitle: '',
    position: { x: position.x, y: position.y },
    status: 'idle',
    data,
  };
}

export function createWorkflowNodeFromPaletteItem(
  item: PaletteItem,
  position: Point,
  globalDefaults?: PropertiesDefaultsConfig | null,
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
  applyLibraryAndHostProperties(data, item.type, item, globalDefaults, {
    label: item.label,
    description: (item.description ?? '').trim(),
  });
  const iconUrl = sanitizeIconUrl(item.iconUrl);
  if (iconUrl) {
    data['iconUrl'] = iconUrl;
  }
  if (item.iconPath && item.iconPath.trim().length > 0) {
    data['iconPath'] = item.iconPath.trim();
  }
  const props = isPlainObject(data['properties']) ? data['properties'] : null;
  const subtitleFromProps =
    props && typeof props['description'] === 'string' ? props['description'] : '';
  return {
    id: newNodeId(item.type),
    type: item.type,
    label: item.label,
    // Keep canvas subtitle aligned with General description when seeded from library/host.
    subtitle: subtitleFromProps || (item.description ?? '').trim(),
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
