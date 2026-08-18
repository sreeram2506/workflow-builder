import { describe, expect, it } from 'vitest';
import { PALETTE_ITEMS, blankAgentPaletteItem } from './palette.catalog';
import {
  aiAgentAllowed,
  applySolutionDefaultAgents,
  defaultAgentCardToPaletteItem,
  featuredLogicItems,
  filterPaletteItemsByAllowList,
  resolveDefaultAgents,
  sanitizeHostDefaultAgents,
  sanitizeHostPaletteItems,
} from './palette-host.helpers';

describe('palette-host.helpers', () => {
  it('mode all passes through items in order', () => {
    const out = filterPaletteItemsByAllowList(PALETTE_ITEMS, { mode: 'all' });
    expect(out.map((i) => i.key)).toEqual(PALETTE_ITEMS.map((i) => i.key));
  });

  it('mode only keeps matching types; empty types yields none', () => {
    const only = filterPaletteItemsByAllowList(PALETTE_ITEMS, {
      mode: 'only',
      types: ['Condition', 'Repeater'],
    });
    expect(only.map((i) => i.type)).toEqual(['Condition', 'Repeater']);
    expect(filterPaletteItemsByAllowList(PALETTE_ITEMS, { mode: 'only', types: [] })).toEqual([]);
  });

  it('aiAgentAllowed is true for all or AIAgent in only-list', () => {
    expect(aiAgentAllowed({ mode: 'all' })).toBe(true);
    expect(aiAgentAllowed({ mode: 'only', types: ['AIAgent'] })).toBe(true);
    expect(aiAgentAllowed({ mode: 'only', types: ['Condition'] })).toBe(false);
  });

  it('omitted defaultAgents returns Blank Agent when allowed', () => {
    const items = resolveDefaultAgents({ mode: 'omitted' }, true);
    const blank = blankAgentPaletteItem();
    expect(items).toEqual([{ ...blank!, origin: 'default-agent' }]);
  });

  it('omitted defaultAgents returns empty when AIAgent not allowed', () => {
    expect(resolveDefaultAgents({ mode: 'omitted' }, false)).toEqual([]);
  });

  it('present [] returns no cards even when allowed', () => {
    expect(resolveDefaultAgents({ mode: 'present', cards: [] }, true)).toEqual([]);
  });

  it('present cards replace Blank Agent and map to AIAgent items', () => {
    const items = resolveDefaultAgents(
      {
        mode: 'present',
        cards: [{ key: 'claims', label: 'Claims Agent', description: 'Triage' }],
      },
      true,
    );
    expect(items).toEqual([
      {
        key: 'claims',
        type: 'AIAgent',
        label: 'Claims Agent',
        description: 'Triage',
        categoryId: 'logic',
        origin: 'default-agent',
      },
    ]);
  });

  it('present cards hidden when AIAgent not allowed', () => {
    expect(
      resolveDefaultAgents(
        {
          mode: 'present',
          cards: [{ key: 'claims', label: 'Claims Agent', description: '' }],
        },
        false,
      ),
    ).toEqual([]);
  });

  it('applySolutionDefaultAgents drops Blank Agent and appends resolved defaults', () => {
    const filtered = filterPaletteItemsByAllowList(PALETTE_ITEMS, { mode: 'all' });
    const defaults = resolveDefaultAgents(
      {
        mode: 'present',
        cards: [{ key: 'claims', label: 'Claims Agent', description: 'Triage' }],
      },
      true,
    );
    const applied = applySolutionDefaultAgents(filtered, defaults);
    expect(applied.some((i) => i.key === 'AIAgent')).toBe(false);
    expect(applied.some((i) => i.type === 'Condition')).toBe(true);
    expect(applied.filter((i) => i.type === 'AIAgent').map((i) => i.key)).toEqual(['claims']);
  });

  it('sanitizeHostPaletteItems drops Stream and keeps a valid AIAgent sibling', () => {
    const out = sanitizeHostPaletteItems([
      { key: 'stream', type: 'Stream', label: 'Stream' },
      { key: 'host-a', type: 'AIAgent', label: 'Host Agent', description: 'From parent' },
    ]);
    expect(out.map((i) => i.key)).toEqual(['host-a']);
    expect(out[0]?.type).toBe('AIAgent');
  });

  it('sanitizeHostPaletteItems skips missing fields and non-objects', () => {
    const out = sanitizeHostPaletteItems([
      null,
      3,
      { type: 'AIAgent', label: 'No key' },
      { key: 'x', type: 'AIAgent' },
      { key: 'ok', type: 'Action', label: 'Do' },
    ]);
    expect(out).toEqual([
      {
        key: 'ok',
        type: 'Action',
        label: 'Do',
        description: '',
        categoryId: 'agents',
      },
    ]);
  });

  it('sanitizeHostDefaultAgents skips cards without key or label', () => {
    expect(
      sanitizeHostDefaultAgents([
        { key: 'policy', label: 'Policy Agent', description: 'X' },
        { key: 'no-label' },
        null,
      ]),
    ).toEqual([{ key: 'policy', label: 'Policy Agent', description: 'X' }]);
  });

  it('sanitizeHostPaletteItems copies extras and drops unsafe iconUrl / non-object metadata', () => {
    const out = sanitizeHostPaletteItems([
      {
        key: 'ok',
        type: 'Condition',
        label: 'If',
        iconUrl: 'javascript:alert(1)',
        iconPath: ' M1 1 ',
        metadata: { owner: 'host' },
        taskMeta: { task_id: 't1' },
        propertiesSchema: {
          sections: [{ fields: [{ type: 'text', path: 'timeout', label: 'Timeout' }] }],
        },
      },
      {
        key: 'url',
        type: 'Decision',
        label: 'Router',
        iconUrl: 'https://cdn.example/r.png',
        metadata: ['nope'],
        taskMeta: null,
      },
    ]);
    expect(out).toEqual([
      {
        key: 'ok',
        type: 'Condition',
        label: 'If',
        description: '',
        categoryId: 'agents',
        iconPath: 'M1 1',
        metadata: { owner: 'host' },
        taskMeta: { task_id: 't1' },
        propertiesSchema: {
          sections: [{ fields: [{ type: 'text', path: 'timeout', label: 'Timeout' }] }],
        },
      },
      {
        key: 'url',
        type: 'Decision',
        label: 'Router',
        description: '',
        categoryId: 'agents',
        iconUrl: 'https://cdn.example/r.png',
      },
    ]);
  });

  it('sanitizeHostDefaultAgents copies extras and not taskMeta', () => {
    const out = sanitizeHostDefaultAgents([
      {
        key: 'policy',
        label: 'Policy',
        iconUrl: '/assets/a.png',
        metadata: { team: 'ops' },
        taskMeta: { ignored: true },
      },
    ]);
    expect(out).toEqual([
      {
        key: 'policy',
        label: 'Policy',
        description: '',
        iconUrl: '/assets/a.png',
        metadata: { team: 'ops' },
      },
    ]);
    expect(out[0]).not.toHaveProperty('taskMeta');
  });

  it('defaultAgentCardToPaletteItem copies extras', () => {
    expect(
      defaultAgentCardToPaletteItem({
        key: 'claims',
        label: 'Claims',
        description: 'Triage',
        iconUrl: 'https://cdn.example/a.png',
        iconPath: 'M0 0',
        metadata: { owner: 'host' },
      }),
    ).toEqual({
      key: 'claims',
      type: 'AIAgent',
      label: 'Claims',
      description: 'Triage',
      categoryId: 'logic',
      origin: 'default-agent',
      iconUrl: 'https://cdn.example/a.png',
      iconPath: 'M0 0',
      metadata: { owner: 'host' },
    });
  });

  it('featuredLogicItems first-of-type vs all remaining', () => {
    const items = [
      { key: 'c1', type: 'Condition' as const, label: 'A', description: '', categoryId: 'logic' },
      { key: 'c2', type: 'Condition' as const, label: 'B', description: '', categoryId: 'logic' },
      { key: 'd1', type: 'Decision' as const, label: 'R', description: '', categoryId: 'logic' },
      { key: 'a1', type: 'AIAgent' as const, label: 'Agent', description: '', categoryId: 'agents' },
    ];
    expect(featuredLogicItems(items, false).map((i) => i.key)).toEqual(['c1', 'd1']);
    expect(featuredLogicItems(items, true).map((i) => i.key)).toEqual(['c1', 'c2', 'd1']);
  });
});
