import { slugCategoryId, type PaletteCategory, type PaletteItem } from './palette.catalog';

/** Agent row from Enso /api/canvas/pipeline/list (pipeline_type=agent). */
export interface EnsoPipelineLike {
  pipeline_id?: string | number;
  name?: string;
  description?: string;
  type?: string;
  import_status?: string;
  [key: string]: unknown;
}

/** Pull pipeline results from known enso response shapes. */
export function extractEnsoPipelines(body: unknown): EnsoPipelineLike[] {
  if (!body || typeof body !== 'object') {
    return [];
  }
  const root = body as Record<string, unknown>;

  const candidates: unknown[] = [
    dig(root, ['result', 'metadata', 'results']),
    dig(root, ['body', 'result', 'metadata', 'results']),
    dig(root, ['data', 'result', 'metadata', 'results']),
    dig(root, ['data', 'metadata', 'results']),
    dig(root, ['metadata', 'results']),
  ];

  for (const c of candidates) {
    if (Array.isArray(c)) {
      return c.filter((t) => t && typeof t === 'object') as EnsoPipelineLike[];
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

/** Map agent pipelines to AIAgent palette rows for the solution Agents Library. */
export function mapEnsoPipelinesToAgents(pipelines: readonly EnsoPipelineLike[]): {
  categories: PaletteCategory[];
  items: PaletteItem[];
} {
  const categoryId = 'agents';
  const items: PaletteItem[] = [];

  for (const pipeline of pipelines) {
    const label = String(pipeline.name || 'Untitled agent');
    const description = String(pipeline.description || pipeline.type || 'Agent');
    const pipelineId =
      pipeline.pipeline_id != null ? String(pipeline.pipeline_id) : slugCategoryId(label) || label;
    items.push({
      key: `enso-agent-${pipelineId}`,
      type: 'AIAgent',
      label,
      description,
      categoryId,
      taskId: pipelineId,
      taskMeta: { ...pipeline },
    });
  }

  return {
    categories: [{ id: categoryId, label: 'Agents' }],
    items,
  };
}
