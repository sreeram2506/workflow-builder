import type { NodeType } from '../domain/workflow.models';
import { sanitizeIconUrl } from '../domain/icon-url';
import type {
  AllowListState,
  DefaultAgentCard,
  DefaultAgentsState,
  PaletteFeatures,
  PaletteFeaturesPartial,
  UiFeaturePath,
  UiFeatures,
  UiFeaturesPartial,
} from './ui-features.types';
import {
  CANVAS_ACTION_KEYS,
  PALETTE_ALLOW_LIST_TYPES,
  UI_FEATURE_PATHS,
} from './ui-features.types';

const PALETTE_TYPE_SET = new Set<string>(PALETTE_ALLOW_LIST_TYPES);

export function createDefaultUiFeatures(): UiFeatures {
  return {
    topBar: {
      enabled: true,
      logo: true,
      title: true,
      status: true,
      theme: true,
      editView: true,
    },
    agentTabs: { enabled: true, doubleClick: true },
    agentsLibrary: { enabled: true },
    skillsLibrary: { enabled: true },
    propertiesPanel: { enabled: true },
    canvas: {
      enabled: true,
      zoomControls: true,
      minimap: true,
      floatingActions: true,
      layoutControls: true,
      save: true,
      export: true,
      import: true,
      run: true,
      reset: true,
    },
    palette: {
      solution: {
        types: { mode: 'all' },
        defaultAgents: { mode: 'omitted' },
      },
      agent: {
        types: { mode: 'all' },
      },
    },
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function pickBooleanLeaves<T extends Record<string, boolean>>(
  raw: unknown,
  keys: readonly (keyof T)[],
): Partial<T> {
  if (!isPlainObject(raw)) {
    return {};
  }
  const out: Partial<T> = {};
  for (const key of keys) {
    const v = raw[key as string];
    if (typeof v === 'boolean') {
      out[key] = v as T[keyof T];
    }
  }
  return out;
}

/**
 * Normalize unknown JSON/provider input into a partial feature overlay.
 * Unknown keys ignored; non-boolean known leaves omitted (BR-03, BR-04).
 */
export function normalizePartial(raw: unknown): UiFeaturesPartial {
  if (!isPlainObject(raw)) {
    return {};
  }

  const partial: UiFeaturesPartial = {};

  if ('topBar' in raw) {
    partial.topBar = {
      ...pickBooleanLeaves(raw['topBar'], [
        'enabled',
        'logo',
        'title',
        'status',
        'theme',
        'editView',
      ]),
      ...pickBooleanLeaves(raw['topBar'], CANVAS_ACTION_KEYS),
    };
  }
  if ('agentTabs' in raw) {
    partial.agentTabs = pickBooleanLeaves(raw['agentTabs'], ['enabled', 'doubleClick']);
  }
  if ('agentsLibrary' in raw) {
    partial.agentsLibrary = pickBooleanLeaves(raw['agentsLibrary'], ['enabled']);
  }
  if ('skillsLibrary' in raw) {
    partial.skillsLibrary = pickBooleanLeaves(raw['skillsLibrary'], ['enabled']);
  }
  if ('propertiesPanel' in raw) {
    partial.propertiesPanel = pickBooleanLeaves(raw['propertiesPanel'], ['enabled']);
  }
  if ('canvas' in raw) {
    partial.canvas = pickBooleanLeaves(raw['canvas'], [
      'enabled',
      'zoomControls',
      'minimap',
      'floatingActions',
      'layoutControls',
      'save',
      'export',
      'import',
      'run',
      'reset',
    ]);
  }
  if (typeof raw['themeToggle'] === 'boolean') {
    partial.themeToggle = raw['themeToggle'];
  }
  const palette = normalizePalette(raw['palette']);
  if (palette) {
    partial.palette = palette;
  }

  return partial;
}

function normalizeAllowListTypes(raw: unknown): NodeType[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: NodeType[] = [];
  const seen = new Set<NodeType>();
  for (const entry of raw) {
    if (typeof entry !== 'string' || !PALETTE_TYPE_SET.has(entry)) {
      continue;
    }
    const type = entry as NodeType;
    if (seen.has(type)) {
      continue;
    }
    seen.add(type);
    out.push(type);
  }
  return out;
}

function normalizeDefaultAgentCards(raw: unknown): DefaultAgentCard[] {
  if (!Array.isArray(raw)) {
    return [];
  }
  const byKey = new Map<string, DefaultAgentCard>();
  for (const item of raw) {
    if (!isPlainObject(item)) {
      continue;
    }
    const key = typeof item['key'] === 'string' ? item['key'].trim() : '';
    const label = typeof item['label'] === 'string' ? item['label'].trim() : '';
    if (!key || !label) {
      continue;
    }
    const description = typeof item['description'] === 'string' ? item['description'] : '';
    const card: DefaultAgentCard = { key, label, description };
    const url = sanitizeIconUrl(item['iconUrl']);
    if (url) {
      card.iconUrl = url;
    }
    if (typeof item['iconPath'] === 'string' && item['iconPath'].trim().length > 0) {
      card.iconPath = item['iconPath'].trim();
    }
    if (isPlainObject(item['metadata'])) {
      card.metadata = { ...item['metadata'] };
    }
    byKey.delete(key);
    byKey.set(key, card);
  }
  return [...byKey.values()];
}

function toAllowListState(raw: unknown): AllowListState | undefined {
  if (!Array.isArray(raw)) {
    return undefined;
  }
  return { mode: 'only', types: normalizeAllowListTypes(raw) };
}

function toDefaultAgentsState(raw: unknown): DefaultAgentsState | undefined {
  if (!Array.isArray(raw)) {
    return undefined;
  }
  return { mode: 'present', cards: normalizeDefaultAgentCards(raw) };
}

function normalizePalette(raw: unknown): PaletteFeaturesPartial | undefined {
  if (!isPlainObject(raw)) {
    return undefined;
  }
  const out: PaletteFeaturesPartial = {};
  if ('solution' in raw && isPlainObject(raw['solution'])) {
    const sol = raw['solution'];
    const solution: NonNullable<PaletteFeaturesPartial['solution']> = {};
    if ('types' in sol) {
      const types = toAllowListState(sol['types']);
      if (types) {
        solution.types = types;
      }
    }
    if ('defaultAgents' in sol) {
      const defaultAgents = toDefaultAgentsState(sol['defaultAgents']);
      if (defaultAgents) {
        solution.defaultAgents = defaultAgents;
      }
    }
    if (solution.types || solution.defaultAgents) {
      out.solution = solution;
    }
  }
  if ('agent' in raw && isPlainObject(raw['agent'])) {
    const agentRaw = raw['agent'];
    if ('types' in agentRaw) {
      const types = toAllowListState(agentRaw['types']);
      if (types) {
        out.agent = { types };
      }
    }
  }
  if (!out.solution && !out.agent) {
    return undefined;
  }
  return out;
}

function mergePalette(base: PaletteFeatures, over?: PaletteFeaturesPartial): PaletteFeatures {
  if (!over) {
    return {
      solution: { ...base.solution },
      agent: { ...base.agent },
    };
  }
  return {
    solution: {
      types: over.solution?.types ?? base.solution.types,
      defaultAgents: over.solution?.defaultAgents ?? base.solution.defaultAgents,
    },
    agent: {
      types: over.agent?.types ?? base.agent.types,
    },
  };
}

function mergeGroup<T extends object>(base: T, over?: Partial<T>): T {
  if (!over) {
    return { ...base };
  }
  const next: T = { ...base };
  for (const key of Object.keys(over) as (keyof T)[]) {
    const value = over[key];
    if (value !== undefined) {
      next[key] = value as T[keyof T];
    }
  }
  return next;
}

function stripTopBarActions(
  over: UiFeaturesPartial['topBar'],
): Partial<UiFeatures['topBar']> | undefined {
  if (!over) {
    return undefined;
  }
  const next: Partial<UiFeatures['topBar']> = {};
  for (const key of Object.keys(over) as (keyof NonNullable<UiFeaturesPartial['topBar']>)[]) {
    if ((CANVAS_ACTION_KEYS as readonly string[]).includes(key as string)) {
      continue;
    }
    const value = over[key];
    if (typeof value === 'boolean') {
      (next as Record<string, boolean>)[key as string] = value;
    }
  }
  return next;
}

/**
 * Legacy `topBar.save|export|import|run|reset` alias `canvas.*`.
 * Same-layer: nested `canvas.save` applied in merge first; alias used only if canonical omitted.
 */
export function applyCanvasActionAliases(
  features: UiFeatures,
  partial: UiFeaturesPartial,
): UiFeatures {
  const canvas = { ...features.canvas };
  let changed = false;
  for (const key of CANVAS_ACTION_KEYS) {
    const canonical = partial.canvas?.[key];
    const alias = partial.topBar?.[key];
    if (typeof canonical === 'boolean') {
      continue;
    }
    if (typeof alias === 'boolean') {
      canvas[key] = alias;
      changed = true;
    }
  }
  if (!changed) {
    return features;
  }
  return { ...features, canvas };
}

/** Deep-merge partial onto full tree; omitted leaves keep base (BR-02). */
export function mergeUiFeatures(base: UiFeatures, partial: UiFeaturesPartial): UiFeatures {
  const merged: UiFeatures = {
    topBar: mergeGroup(base.topBar, stripTopBarActions(partial.topBar)),
    agentTabs: mergeGroup(base.agentTabs, partial.agentTabs),
    agentsLibrary: mergeGroup(base.agentsLibrary, partial.agentsLibrary),
    skillsLibrary: mergeGroup(base.skillsLibrary, partial.skillsLibrary),
    propertiesPanel: mergeGroup(base.propertiesPanel, partial.propertiesPanel),
    canvas: mergeGroup(base.canvas, partial.canvas),
    palette: mergePalette(base.palette, partial.palette),
  };
  const withActions = applyCanvasActionAliases(merged, partial);
  return applyThemeAlias(withActions, partial.themeToggle);
}

/**
 * BR-08: themeToggle aliases topBar.theme.
 * Same-layer: nested topBar.theme applied in merge first; themeToggle overwrites.
 */
export function applyThemeAlias(features: UiFeatures, themeToggle?: boolean): UiFeatures {
  if (typeof themeToggle !== 'boolean') {
    return features;
  }
  return {
    ...features,
    topBar: { ...features.topBar, theme: themeToggle },
  };
}

export function buildPathIndex(features: UiFeatures): ReadonlyMap<UiFeaturePath, boolean> {
  const map = new Map<UiFeaturePath, boolean>();
  map.set('topBar.enabled', features.topBar.enabled);
  map.set('topBar.logo', features.topBar.logo);
  map.set('topBar.title', features.topBar.title);
  map.set('topBar.status', features.topBar.status);
  map.set('topBar.theme', features.topBar.theme);
  map.set('topBar.editView', features.topBar.editView);
  map.set('agentTabs.enabled', features.agentTabs.enabled);
  map.set('agentTabs.doubleClick', features.agentTabs.doubleClick);
  map.set('agentsLibrary.enabled', features.agentsLibrary.enabled);
  map.set('skillsLibrary.enabled', features.skillsLibrary.enabled);
  map.set('propertiesPanel.enabled', features.propertiesPanel.enabled);
  map.set('canvas.enabled', features.canvas.enabled);
  map.set('canvas.zoomControls', features.canvas.zoomControls);
  map.set('canvas.minimap', features.canvas.minimap);
  map.set('canvas.floatingActions', features.canvas.floatingActions);
  map.set('canvas.layoutControls', features.canvas.layoutControls);
  map.set('canvas.save', features.canvas.save);
  map.set('canvas.export', features.canvas.export);
  map.set('canvas.import', features.canvas.import);
  map.set('canvas.run', features.canvas.run);
  map.set('canvas.reset', features.canvas.reset);
  map.set('topBar.save', features.canvas.save);
  map.set('topBar.export', features.canvas.export);
  map.set('topBar.import', features.canvas.import);
  map.set('topBar.run', features.canvas.run);
  map.set('topBar.reset', features.canvas.reset);
  map.set('themeToggle', features.topBar.theme);
  return map;
}

/** Resolve defaults ← json ← provider (BR-02). */
export function resolveUiFeatures(
  jsonPartial: UiFeaturesPartial = {},
  providerPartial: UiFeaturesPartial = {},
): UiFeatures {
  const withJson = mergeUiFeatures(createDefaultUiFeatures(), jsonPartial);
  return mergeUiFeatures(withJson, providerPartial);
}

/**
 * Shell-local instance overlay: global resolved ⊕ normalizePartial(ui ?? {}).
 * Does not mutate `global` (FR-HUI-05).
 */
export function mergeInstanceUiFeatures(
  global: UiFeatures,
  uiInput: UiFeaturesPartial | undefined,
): UiFeatures {
  return mergeUiFeatures(global, normalizePartial(uiInput ?? {}));
}

export function readFeaturePath(features: UiFeatures, path: string): boolean | undefined {
  const index = buildPathIndex(features);
  if ((UI_FEATURE_PATHS as readonly string[]).includes(path)) {
    return index.get(path as UiFeaturePath);
  }
  return undefined;
}
