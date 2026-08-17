/** UI feature configuration types (U-UI-01 + U-PAL-01 palette) */

import type { NodeType } from '../domain/workflow.models';
import { ALLOWED_NODE_TYPES } from '../domain/workflow.models';

export const PALETTE_ALLOW_LIST_TYPES: readonly NodeType[] = ALLOWED_NODE_TYPES;

export const CANVAS_ACTION_KEYS = ['save', 'export', 'import', 'run', 'reset'] as const;
export type CanvasActionKey = (typeof CANVAS_ACTION_KEYS)[number];

export interface TopBarFeatures {
  enabled: boolean;
  logo: boolean;
  title: boolean;
  status: boolean;
  theme: boolean;
  editView: boolean;
}

export interface AgentTabsFeatures {
  enabled: boolean;
}

export interface AgentsLibraryFeatures {
  enabled: boolean;
}

export interface SkillsLibraryFeatures {
  enabled: boolean;
}

export interface PropertiesPanelFeatures {
  enabled: boolean;
}

export interface CanvasFeatures {
  enabled: boolean;
  zoomControls: boolean;
  minimap: boolean;
  floatingActions: boolean;
  layoutControls: boolean;
  save: boolean;
  export: boolean;
  import: boolean;
  run: boolean;
  reset: boolean;
}

export type AllowListMode = 'all' | 'only';

export type AllowListState =
  | { mode: 'all' }
  | { mode: 'only'; types: readonly NodeType[] };

export interface DefaultAgentCard {
  key: string;
  label: string;
  description: string;
}

export type DefaultAgentsState =
  | { mode: 'omitted' }
  | { mode: 'present'; cards: readonly DefaultAgentCard[] };

export interface PaletteSolutionFeatures {
  types: AllowListState;
  defaultAgents: DefaultAgentsState;
}

export interface PaletteAgentFeatures {
  types: AllowListState;
}

export interface PaletteFeatures {
  solution: PaletteSolutionFeatures;
  agent: PaletteAgentFeatures;
}

export interface UiFeatures {
  topBar: TopBarFeatures;
  agentTabs: AgentTabsFeatures;
  agentsLibrary: AgentsLibraryFeatures;
  skillsLibrary: SkillsLibraryFeatures;
  propertiesPanel: PropertiesPanelFeatures;
  canvas: CanvasFeatures;
  palette: PaletteFeatures;
}

/** Overlay after normalize: palette arrays already converted to state when the JSON key was present. */
export interface PaletteSolutionPartial {
  types?: AllowListState;
  defaultAgents?: DefaultAgentsState;
}

export interface PaletteAgentPartial {
  types?: AllowListState;
}

export interface PaletteFeaturesPartial {
  solution?: PaletteSolutionPartial;
  agent?: PaletteAgentPartial;
}

/** Deep-partial overlay; may also carry themeToggle alias and legacy topBar action keys. */
export type UiFeaturesPartial = {
  topBar?: Partial<TopBarFeatures> & Partial<Record<CanvasActionKey, boolean>>;
  agentTabs?: Partial<AgentTabsFeatures>;
  agentsLibrary?: Partial<AgentsLibraryFeatures>;
  skillsLibrary?: Partial<SkillsLibraryFeatures>;
  propertiesPanel?: Partial<PropertiesPanelFeatures>;
  canvas?: Partial<CanvasFeatures>;
  themeToggle?: boolean;
  palette?: PaletteFeaturesPartial;
};

export type UiConfigLoadKind = 'ok' | 'missing' | 'invalid';

export interface UiConfigLoadStatus {
  kind: UiConfigLoadKind;
  message: string | null;
}

export const UI_FEATURE_PATHS = [
  'topBar.enabled',
  'topBar.logo',
  'topBar.title',
  'topBar.status',
  'topBar.theme',
  'topBar.editView',
  'agentTabs.enabled',
  'agentsLibrary.enabled',
  'skillsLibrary.enabled',
  'propertiesPanel.enabled',
  'canvas.enabled',
  'canvas.zoomControls',
  'canvas.minimap',
  'canvas.floatingActions',
  'canvas.layoutControls',
  'canvas.save',
  'canvas.export',
  'canvas.import',
  'canvas.run',
  'canvas.reset',
  'topBar.save',
  'topBar.export',
  'topBar.import',
  'topBar.run',
  'topBar.reset',
  'themeToggle',
] as const;

export type UiFeaturePath = (typeof UI_FEATURE_PATHS)[number];

export const UI_CONFIG_JSON_URL = '/assets/wb-ui-config.json';
