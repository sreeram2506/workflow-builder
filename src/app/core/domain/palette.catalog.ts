import type { NodeType } from './workflow.models';

/** Category id is a stable slug (static: flow|logic|… or enso user_category slug). */
export type PaletteCategoryId = string;

export interface PaletteItem {
  /** Stable track key (NodeType for static; enso-{task_id} for API). */
  key: string;
  type: NodeType;
  label: string;
  description: string;
  categoryId: PaletteCategoryId;
  /** Present when sourced from enso task/list. */
  taskId?: string;
  taskMeta?: Record<string, unknown>;
}

export interface PaletteCategory {
  id: PaletteCategoryId;
  label: string;
}

export const PALETTE_CATEGORIES: readonly PaletteCategory[] = [
  { id: 'flow', label: 'Flow' },
  { id: 'integration', label: 'Integration' },
] as const;

/** Shown in the featured shapes strip (not in category lists). */
export const FEATURED_PALETTE_TYPES: readonly NodeType[] = [
  'Condition',
  'Decision',
  'Repeater',
] as const;

export const PALETTE_ITEMS: readonly PaletteItem[] = [
  {
    key: 'Trigger',
    type: 'Trigger',
    label: 'Trigger',
    description: 'Initiate workflows',
    categoryId: 'flow',
  },
  {
    key: 'Action',
    type: 'Action',
    label: 'Action',
    description: 'Perform actions based on triggers',
    categoryId: 'flow',
  },
  {
    key: 'Delay',
    type: 'Delay',
    label: 'Delay',
    description: 'Pause the workflow',
    categoryId: 'flow',
  },
  {
    key: 'End',
    type: 'End',
    label: 'End',
    description: 'Complete the workflow',
    categoryId: 'flow',
  },
  {
    key: 'Condition',
    type: 'Condition',
    label: 'Condition',
    description: 'Branch the workflow',
    categoryId: 'logic',
  },
  {
    key: 'Decision',
    type: 'Decision',
    label: 'Router',
    description: 'Route the workflow',
    categoryId: 'logic',
  },
  {
    key: 'Repeater',
    type: 'Repeater',
    label: 'Repeater',
    description: 'Repeat a section of the workflow',
    categoryId: 'logic',
  },
  {
    key: 'Notification',
    type: 'Notification',
    label: 'Notification',
    description: 'Send alerts or notifications',
    categoryId: 'integration',
  },
] as const;

export function filterPaletteItems(items: readonly PaletteItem[], query: string): PaletteItem[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [...items];
  }
  return items.filter(
    (item) =>
      item.label.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.categoryId.toLowerCase().includes(q),
  );
}

export function findPaletteItem(type: NodeType): PaletteItem | undefined {
  return PALETTE_ITEMS.find((i) => i.type === type);
}

export function slugCategoryId(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
