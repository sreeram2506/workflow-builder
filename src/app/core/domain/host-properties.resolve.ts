import {
  isPlainObject,
  logicBuiltinPropertiesSchema,
  sanitizeHostPropertiesSchema,
  type HostPropertiesSchema,
} from './host-properties.schema';
import { resolveCardPropertiesConfig } from './host-properties.config';
import {
  libraryPropertiesSchemaForType,
  mergePropertiesSchemas,
  type LibraryPropertyEnableMap,
  type PropertiesDefaultsConfig,
} from './host-properties.library';
import type { PaletteItem } from './palette.catalog';
import type { DefaultAgentCard } from '../ui-config/ui-features.types';
import type { WorkflowNode } from './workflow.models';

export interface HostPropertiesSchemaSource {
  schemaFor(node: WorkflowNode): HostPropertiesSchema | null;
}

function schemaFromAdapter(
  adapter: HostPropertiesSchemaSource | null | undefined,
  node: WorkflowNode,
): HostPropertiesSchema | null {
  if (!adapter) {
    return null;
  }
  try {
    const fromAdapter = adapter.schemaFor(node);
    if (isPlainObject(fromAdapter)) {
      return sanitizeHostPropertiesSchema(fromAdapter);
    }
  } catch {
    // Treat throw as no adapter.
  }
  return null;
}

function liveCardForPaletteKey(
  paletteKey: string,
  hostPalettes?: readonly PaletteItem[] | null,
  hostDefaultAgents?: readonly DefaultAgentCard[] | null,
): PaletteItem | DefaultAgentCard | null {
  if (hostPalettes?.length) {
    const live = hostPalettes.find((item) => item.key === paletteKey);
    if (live) {
      return live;
    }
  }
  if (hostDefaultAgents?.length) {
    const card = hostDefaultAgents.find((c) => c.key === paletteKey);
    if (card) {
      return card;
    }
  }
  return null;
}

/**
 * Host-provided schema only (not logic built-ins).
 *
 * Always starts from package General defaults (`name` + `description`, enable-filtered),
 * then merges the first host contribution found:
 * 1. Live `[palettes]` / `[defaultAgents]` `propertiesSchema`
 * 2. Instance `[properties]`
 * 3. Drop snapshot `node.data.propertiesSchema`
 * 4. DI `provideWorkflowBuilderUi({ properties })`
 *
 * Host fields win on the same path. Consumer apps add sections only via those host sources.
 */
export function resolveHostProvidedPropertiesSchema(
  node: WorkflowNode,
  diAdapter: HostPropertiesSchemaSource | null | undefined,
  hostPalettes?: readonly PaletteItem[] | null,
  instanceAdapter?: HostPropertiesSchemaSource | null,
  hostDefaultAgents?: readonly DefaultAgentCard[] | null,
  propertiesDefaults?: PropertiesDefaultsConfig | null,
): HostPropertiesSchema | null {
  const paletteKey = node.data['paletteKey'];
  let cardOverride: LibraryPropertyEnableMap | undefined;
  let liveHostSchema: HostPropertiesSchema | null = null;
  if (typeof paletteKey === 'string' && paletteKey.length > 0) {
    const liveCard = liveCardForPaletteKey(paletteKey, hostPalettes, hostDefaultAgents);
    if (liveCard) {
      cardOverride = liveCard.libraryProperties;
      const fromCard = resolveCardPropertiesConfig({
        propertiesSchema: liveCard.propertiesSchema,
        properties: liveCard.properties,
      });
      if (fromCard.propertiesSchema) {
        liveHostSchema = fromCard.propertiesSchema;
      }
    }
  }

  const library = libraryPropertiesSchemaForType(node.type, propertiesDefaults, cardOverride);

  const hostExtra =
    liveHostSchema ??
    schemaFromAdapter(instanceAdapter, node) ??
    (isPlainObject(node.data['propertiesSchema'])
      ? sanitizeHostPropertiesSchema(node.data['propertiesSchema'])
      : null) ??
    schemaFromAdapter(diAdapter, node);

  return mergePropertiesSchemas(library, hostExtra);
}

/**
 * First-win host / library schema (see {@link resolveHostProvidedPropertiesSchema}),
 * then logic built-in, else null.
 */
export function resolveHostPropertiesSchema(
  node: WorkflowNode,
  diAdapter: HostPropertiesSchemaSource | null | undefined,
  hostPalettes?: readonly PaletteItem[] | null,
  instanceAdapter?: HostPropertiesSchemaSource | null,
  hostDefaultAgents?: readonly DefaultAgentCard[] | null,
  propertiesDefaults?: PropertiesDefaultsConfig | null,
): HostPropertiesSchema | null {
  return (
    resolveHostProvidedPropertiesSchema(
      node,
      diAdapter,
      hostPalettes,
      instanceAdapter,
      hostDefaultAgents,
      propertiesDefaults,
    ) ?? logicBuiltinPropertiesSchema(node.type)
  );
}
