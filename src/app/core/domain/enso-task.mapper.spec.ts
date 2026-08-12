import { describe, expect, it } from 'vitest';
import { extractEnsoTasks, mapEnsoTasksToPalette } from './enso-task.mapper';

describe('enso-task.mapper', () => {
  it('extracts tasks from result.metadata.tasks', () => {
    const tasks = extractEnsoTasks({
      result: { metadata: { tasks: [{ task_id: 1, display_name: 'A', user_category: 'GenAI' }] } },
    });
    expect(tasks).toHaveLength(1);
    expect(tasks[0]!.display_name).toBe('A');
  });

  it('maps tasks into category groups', () => {
    const { categories, items } = mapEnsoTasksToPalette([
      { task_id: 't1', display_name: 'Ignore Keys', user_category: 'Domain Extraction' },
      { task_id: 't2', name: 'Other', user_category: 'GenAI' },
      { task_id: 't3', display_name: 'More', user_category: 'Domain Extraction' },
    ]);
    expect(categories.map((c) => c.label)).toEqual(['Domain Extraction', 'GenAI']);
    expect(items).toHaveLength(3);
    expect(items[0]!.type).toBe('Action');
    expect(items[0]!.key).toBe('enso-t1');
    expect(items.filter((i) => i.categoryId === 'domain-extraction')).toHaveLength(2);
  });
});
