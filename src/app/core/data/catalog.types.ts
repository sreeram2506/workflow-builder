import type { PaletteCategory, PaletteItem } from '../domain/palette.catalog';
import type { DefaultAgentCard } from '../ui-config/ui-features.types';
import type { NodeType } from '../domain/workflow.models';

export type CatalogLoadMode = 'agent-skills' | 'solution-agents';

export interface CatalogLoadOptions {
  mode?: CatalogLoadMode;
  userCategories?: readonly string[];
  includeAgentId?: boolean;
  itemNodeType?: NodeType;
  /** Present (including []) replaces Enso / provider adapter. */
  hostPalettes?: readonly unknown[];
  /** Present (including []) replaces JSON/provider defaultAgents. Ignored when host palettes is []. */
  hostDefaultAgents?: readonly DefaultAgentCard[] | readonly unknown[];
}

export interface PaletteCatalogLoad {
  categories: PaletteCategory[];
  items: PaletteItem[];
  source: 'enso' | 'static' | 'adapter' | 'empty' | 'host';
  error: string | null;
  emptyRemote: boolean;
}
