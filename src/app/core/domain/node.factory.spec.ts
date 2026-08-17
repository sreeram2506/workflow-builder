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
