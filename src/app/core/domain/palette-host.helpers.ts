import {
  isPlainObject,
  sanitizeHostPropertiesSchema,
  type HostPropertiesSchema,
} from './host-properties.schema';
import {
  BLANK_AGENT_TYPE,
  FEATURED_PALETTE_TYPES,
  blankAgentPaletteItem,
  type PaletteItem,
} from './palette.catalog';
import type { AllowListState, DefaultAgentCard, DefaultAgentsState } from '../ui-config/ui-features.types';
import { ALLOWED_NODE_TYPES, type NodeType } from './workflow.models';
import { sanitizeIconUrl } from './icon-url';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isAllowedNodeType(value: unknown): value is NodeType {
  return typeof value === 'string' && (ALLOWED_NODE_TYPES as readonly string[]).includes(value);
}

function applyHostExtras(
  rec: Record<string, unknown>,
  target: {
    iconUrl?: string;
    iconPath?: string;
    metadata?: Record<string, unknown>;
    taskMeta?: Record<string, unknown>;
    propertiesSchema?: HostPropertiesSchema;
  },
  copyTaskMeta: boolean,
): void {
  const url = sanitizeIconUrl(rec['iconUrl']);
  if (url) {
    target.iconUrl = url;
  }
  if (isNonEmptyString(rec['iconPath'])) {
    target.iconPath = rec['iconPath'].trim();
  }
  if (isPlainObject(rec['metadata'])) {
    target.metadata = { ...rec['metadata'] };
  }
  if (copyTaskMeta && isPlainObject(rec['taskMeta'])) {
    target.taskMeta = { ...rec['taskMeta'] };
  }
  if (copyTaskMeta && isPlainObject(rec['propertiesSchema'])) {
    target.propertiesSchema = sanitizeHostPropertiesSchema(rec['propertiesSchema']);
  }
}

/** Drop unknown types and invalid shapes. Remaining rows are canvas-safe PaletteItems. */
export function sanitizeHostPaletteItems(
  raw: readonly unknown[],
  fallbackCategoryId = 'agents',
): PaletteItem[] {
  const out: PaletteItem[] = [];
  for (const row of raw) {
    if (!row || typeof row !== 'object') {
      continue;
    }
    const rec = row as Record<string, unknown>;
    if (!isNonEmptyString(rec['key']) || !isNonEmptyString(rec['label']) || !isAllowedNodeType(rec['type'])) {
      continue;
    }
    const item: PaletteItem = {
      key: rec['key'].trim(),
      type: rec['type'],
      label: rec['label'].trim(),
      description: typeof rec['description'] === 'string' ? rec['description'] : '',
      categoryId: isNonEmptyString(rec['categoryId']) ? rec['categoryId'].trim() : fallbackCategoryId,
    };
    if (typeof rec['taskId'] === 'string') {
      item.taskId = rec['taskId'];
    }
    if (rec['origin'] === 'default-agent') {
      item.origin = 'default-agent';
    }
    applyHostExtras(rec, item, true);
    out.push(item);
  }
  return out;
}

export function sanitizeHostDefaultAgents(raw: readonly unknown[]): DefaultAgentCard[] {
  const out: DefaultAgentCard[] = [];
  for (const row of raw) {
    if (!row || typeof row !== 'object') {
      continue;
    }
    const rec = row as Record<string, unknown>;
    if (!isNonEmptyString(rec['key']) || !isNonEmptyString(rec['label'])) {
      continue;
    }
    const card: DefaultAgentCard = {
      key: rec['key'].trim(),
      label: rec['label'].trim(),
      description: typeof rec['description'] === 'string' ? rec['description'] : '',
    };
    applyHostExtras(rec, card, false);
    out.push(card);
  }
  return out;
}

export function aiAgentAllowed(state: AllowListState): boolean {
  return state.mode === 'all' || state.types.includes('AIAgent');
}

export function filterPaletteItemsByAllowList(
  items: readonly PaletteItem[],
  state: AllowListState,
): PaletteItem[] {
  if (state.mode === 'all') {
    return [...items];
  }
  const allowed = new Set(state.types);
  return items.filter((item) => allowed.has(item.type));
}

export function defaultAgentCardToPaletteItem(card: DefaultAgentCard): PaletteItem {
  const item: PaletteItem = {
    key: card.key,
    type: BLANK_AGENT_TYPE,
    label: card.label,
    description: (card.description ?? '').trim(),
    categoryId: 'logic',
    origin: 'default-agent',
  };
  if (card.iconUrl) {
    item.iconUrl = card.iconUrl;
  }
  if (card.iconPath) {
    item.iconPath = card.iconPath;
  }
  if (card.metadata) {
    item.metadata = { ...card.metadata };
  }
  return item;
}

/** Featured strip: first-of-type built-ins, or every remaining logic card when host palettes are present. */
export function featuredLogicItems(
  items: readonly PaletteItem[],
  hostPalettesPresent: boolean,
): PaletteItem[] {
  const featured = new Set<string>(FEATURED_PALETTE_TYPES);
  if (hostPalettesPresent) {
    return items.filter((i) => featured.has(i.type));
  }
  const order: NodeType[] = ['Condition', 'Decision', 'Repeater'];
  return order.map((t) => items.find((i) => i.type === t)).filter((i): i is PaletteItem => !!i);
}

export function resolveDefaultAgents(
  state: DefaultAgentsState,
  agentAllowed: boolean,
): PaletteItem[] {
  if (!agentAllowed) {
    return [];
  }
  if (state.mode === 'omitted') {
    const blank = blankAgentPaletteItem();
    return blank ? [{ ...blank, origin: 'default-agent' }] : [];
  }
  return state.cards.map(defaultAgentCardToPaletteItem);
}

/** Replace built-in Blank Agent with resolved default-agent rows; keep other AIAgent items. */
export function applySolutionDefaultAgents(
  filteredItems: readonly PaletteItem[],
  resolvedDefaults: readonly PaletteItem[],
): PaletteItem[] {
  const blankKey = blankAgentPaletteItem()?.key ?? 'AIAgent';
  const withoutBlank = filteredItems.filter(
    (item) => !(item.type === BLANK_AGENT_TYPE && item.key === blankKey),
  );
  return [...withoutBlank, ...resolvedDefaults];
}
