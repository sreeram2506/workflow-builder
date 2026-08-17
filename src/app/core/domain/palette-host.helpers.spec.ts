import { describe, expect, it } from 'vitest';
import { PALETTE_ITEMS, blankAgentPaletteItem } from './palette.catalog';
import {
  aiAgentAllowed,
  applySolutionDefaultAgents,
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
});
