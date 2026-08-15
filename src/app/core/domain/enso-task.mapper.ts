import type { NodeType } from './workflow.models';
import { slugCategoryId, type PaletteCategory, type PaletteItem } from './palette.catalog';

export interface EnsoTaskLike {
  task_id?: string | number;
  name?: string;
  display_name?: string;
  user_category?: string;
  [key: string]: unknown;
}

/** Pull tasks array from several known enso response shapes. */
export function extractEnsoTasks(body: unknown): EnsoTaskLike[] {
  if (!body || typeof body !== 'object') {
    return [];
  }
  const root = body as Record<string, unknown>;

  const candidates: unknown[] = [
    dig(root, ['result', 'metadata', 'tasks']),
    dig(root, ['data', 'metadata', 'tasks']),
    dig(root, ['metadata', 'tasks']),
    dig(root, ['data', 'result', 'metadata', 'tasks']),
    dig(root, ['body', 'result', 'metadata', 'tasks']),
  ];

  for (const c of candidates) {
    if (Array.isArray(c)) {
      return c.filter((t) => t && typeof t === 'object') as EnsoTaskLike[];
    }
  }
  return [];
}

function dig(obj: Record<string, unknown>, path: string[]): unknown {
  let cur: unknown = obj;
  for (const key of path) {
    if (cur == null || typeof cur !== 'object') {
      return undefined;
    }
    cur = (cur as Record<string, unknown>)[key];
  }
  return cur;
}

export function mapEnsoTasksToPalette(
  tasks: readonly EnsoTaskLike[],
  options?: { nodeType?: NodeType },
): {
  categories: PaletteCategory[];
  items: PaletteItem[];
} {
  const nodeType: NodeType = options?.nodeType ?? 'Action';
  const categoryOrder: string[] = [];
  const categoryLabels = new Map<string, string>();
  const items: PaletteItem[] = [];

  for (const task of tasks) {
    const label = String(task.display_name || task.name || 'Untitled task');
    const categoryLabel = String(task.user_category || 'Other');
    const categoryId = slugCategoryId(categoryLabel) || 'other';
    if (!categoryLabels.has(categoryId)) {
      categoryLabels.set(categoryId, categoryLabel);
      categoryOrder.push(categoryId);
    }
    const taskId = task.task_id != null ? String(task.task_id) : label;
    items.push({
      key: `enso-${taskId}`,
      type: nodeType,
      label,
      description: categoryLabel,
      categoryId,
      taskId,
      taskMeta: { ...task },
    });
  }

  const categories: PaletteCategory[] = categoryOrder.map((id) => ({
    id,
    label: categoryLabels.get(id) ?? id,
  }));

  return { categories, items };
}
