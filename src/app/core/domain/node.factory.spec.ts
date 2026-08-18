import { describe, expect, it } from 'vitest';
import { blankAgentPaletteItem, PALETTE_ITEMS } from './palette.catalog';
import {
  createWorkflowNodeFromPaletteItem,
  findExistingAgentForPaletteItem,
} from './node.factory';

describe('findExistingAgentForPaletteItem', () => {
  it('matches an AIAgent by paletteKey', () => {
    const item = blankAgentPaletteItem()!;
    const created = createWorkflowNodeFromPaletteItem(item, { x: 0, y: 0 })!;
    expect(created.data['paletteKey']).toBe(item.key);
    expect(findExistingAgentForPaletteItem([created], item)?.id).toBe(created.id);
  });

  it('matches a legacy Blank Agent by label when paletteKey is missing', () => {
    const item = blankAgentPaletteItem()!;
    const legacy = {
      id: 'n-AIAgent-leg1',
      type: 'AIAgent' as const,
      label: item.label,
      subtitle: '',
      position: { x: 0, y: 0 },
      status: 'idle' as const,
      data: {},
    };
    expect(findExistingAgentForPaletteItem([legacy], item)?.id).toBe(legacy.id);
  });

  it('does not reuse non-agent palette items', () => {
    const item = PALETTE_ITEMS.find((i) => i.type === 'Action')!;
    const created = createWorkflowNodeFromPaletteItem(item, { x: 0, y: 0 })!;
    expect(findExistingAgentForPaletteItem([created], item)).toBeUndefined();
  });
});

describe('createWorkflowNodeFromPaletteItem metadata', () => {
  it('copies metadata and taskMeta onto node.data', () => {
    const base = PALETTE_ITEMS.find((i) => i.type === 'Condition')!;
    const item = {
      ...base,
      metadata: { owner: 'host' },
      taskMeta: { task_id: 't1' },
    };
    const node = createWorkflowNodeFromPaletteItem(item, { x: 1, y: 2 })!;
    expect(node.data['metadata']).toEqual({ owner: 'host' });
    expect(node.data['taskMeta']).toEqual({ task_id: 't1' });
    expect(node.data['ensoTask']).toBeUndefined();
    (node.data['metadata'] as Record<string, unknown>)['owner'] = 'mutated';
    expect(item.metadata['owner']).toBe('host');
  });

  it('copies propertiesSchema onto node.data', () => {
    const base = PALETTE_ITEMS.find((i) => i.type === 'Action')!;
    const schema = {
      sections: [{ fields: [{ type: 'text' as const, path: 'timeout', label: 'Timeout' }] }],
    };
    const node = createWorkflowNodeFromPaletteItem(
      { ...base, propertiesSchema: schema },
      { x: 0, y: 0 },
    )!;
    expect(node.data['propertiesSchema']).toEqual(schema);
  });

  it('omits metadata when absent', () => {
    const item = PALETTE_ITEMS.find((i) => i.type === 'Action')!;
    const node = createWorkflowNodeFromPaletteItem(item, { x: 0, y: 0 })!;
    expect(node.data['metadata']).toBeUndefined();
    expect(node.data['paletteKey']).toBe(item.key);
  });

  it('copies sanitized iconUrl and iconPath onto node.data', () => {
    const base = PALETTE_ITEMS.find((i) => i.type === 'Condition')!;
    const node = createWorkflowNodeFromPaletteItem(
      {
        ...base,
        iconUrl: 'https://cdn.example/c.png',
        iconPath: 'M12 2 L2 22 h20 z',
      },
      { x: 0, y: 0 },
    )!;
    expect(node.data['iconUrl']).toBe('https://cdn.example/c.png');
    expect(node.data['iconPath']).toBe('M12 2 L2 22 h20 z');
  });

  it('drops unsafe iconUrl on drop', () => {
    const base = PALETTE_ITEMS.find((i) => i.type === 'Condition')!;
    const node = createWorkflowNodeFromPaletteItem(
      { ...base, iconUrl: 'javascript:alert(1)', iconPath: 'M0 0h10' },
      { x: 0, y: 0 },
    )!;
    expect(node.data['iconUrl']).toBeUndefined();
    expect(node.data['iconPath']).toBe('M0 0h10');
  });
});
