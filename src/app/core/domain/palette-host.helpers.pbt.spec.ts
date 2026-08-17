import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { ALLOWED_NODE_TYPES } from './workflow.models';
import {
  aiAgentAllowed,
  featuredLogicItems,
  filterPaletteItemsByAllowList,
  resolveDefaultAgents,
  sanitizeHostDefaultAgents,
  sanitizeHostPaletteItems,
} from './palette-host.helpers';
import { FEATURED_PALETTE_TYPES, PALETTE_ITEMS, type PaletteItem } from './palette.catalog';
import type { AllowListState, DefaultAgentCard } from '../ui-config/ui-features.types';

const nodeTypeArb = fc.constantFrom(...ALLOWED_NODE_TYPES);

const allowListArb: fc.Arbitrary<AllowListState> = fc.oneof(
  fc.constant({ mode: 'all' } as const),
  fc.array(nodeTypeArb, { maxLength: 9 }).map((types) => ({
    mode: 'only' as const,
    types,
  })),
);

const itemArb: fc.Arbitrary<PaletteItem> = fc.record({
  key: fc.string({ minLength: 1, maxLength: 12 }),
  type: nodeTypeArb,
  label: fc.string({ minLength: 1, maxLength: 20 }),
  description: fc.string({ maxLength: 40 }),
  categoryId: fc.constantFrom('flow', 'logic', 'integration'),
});

const cardArb: fc.Arbitrary<DefaultAgentCard> = fc.record({
  key: fc.string({ minLength: 1, maxLength: 12 }).filter((s) => s.trim().length > 0),
  label: fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
  description: fc.string({ maxLength: 40 }),
});

describe('palette-host.helpers PBT', () => {
  it('only-mode output types are in the allow-list (NFR-PAL-04)', () => {
    fc.assert(
      fc.property(fc.array(itemArb, { maxLength: 20 }), fc.array(nodeTypeArb, { maxLength: 9 }), (items, types) => {
        const state: AllowListState = { mode: 'only', types };
        const allowed = new Set(types);
        const out = filterPaletteItemsByAllowList(items, state);
        expect(out.every((item) => allowed.has(item.type))).toBe(true);
      }),
      { numRuns: 80 },
    );
  });

  it('filter is a subsequence of input', () => {
    fc.assert(
      fc.property(fc.array(itemArb, { maxLength: 16 }), allowListArb, (items, state) => {
        const out = filterPaletteItemsByAllowList(items, state);
        let i = 0;
        for (const item of out) {
          const idx = items.indexOf(item, i);
          expect(idx).toBeGreaterThanOrEqual(0);
          i = idx + 1;
        }
      }),
      { numRuns: 60 },
    );
  });

  it('filter is idempotent', () => {
    fc.assert(
      fc.property(fc.array(itemArb, { maxLength: 16 }), allowListArb, (items, state) => {
        const once = filterPaletteItemsByAllowList(items, state);
        const twice = filterPaletteItemsByAllowList(once, state);
        expect(twice).toEqual(once);
      }),
      { numRuns: 40 },
    );
  });

  it('mode all preserves length', () => {
    fc.assert(
      fc.property(fc.array(itemArb, { maxLength: 16 }), (items) => {
        expect(filterPaletteItemsByAllowList(items, { mode: 'all' })).toHaveLength(items.length);
      }),
      { numRuns: 30 },
    );
  });

  it('resolveDefaultAgents items are AIAgent; false gate yields empty', () => {
    fc.assert(
      fc.property(fc.array(cardArb, { maxLength: 5 }), fc.boolean(), (cards, allowed) => {
        const omitted = resolveDefaultAgents({ mode: 'omitted' }, allowed);
        const present = resolveDefaultAgents({ mode: 'present', cards }, allowed);
        const emptyPresent = resolveDefaultAgents({ mode: 'present', cards: [] }, allowed);
        expect(omitted.every((i) => i.type === 'AIAgent')).toBe(true);
        expect(present.every((i) => i.type === 'AIAgent')).toBe(true);
        if (!allowed) {
          expect(omitted).toEqual([]);
          expect(present).toEqual([]);
          expect(emptyPresent).toEqual([]);
        } else {
          expect(emptyPresent).toEqual([]);
        }
      }),
      { numRuns: 50 },
    );
  });

  it('static catalog only-mode never emits disallowed featured types', () => {
    fc.assert(
      fc.property(fc.uniqueArray(nodeTypeArb, { maxLength: 9 }), (types) => {
        const out = filterPaletteItemsByAllowList(PALETTE_ITEMS, { mode: 'only', types });
        const allowed = new Set(types);
        expect(out.every((i) => allowed.has(i.type))).toBe(true);
        expect(aiAgentAllowed({ mode: 'only', types })).toBe(types.includes('AIAgent'));
      }),
      { numRuns: 40 },
    );
  });

  it('featuredLogicItems(false) is at most one per type in Condition/Decision/Repeater order (P-LIM-03)', () => {
    fc.assert(
      fc.property(fc.array(itemArb, { maxLength: 16 }), (items) => {
        const out = featuredLogicItems(items, false);
        const types = out.map((i) => i.type);
        expect(new Set(types).size).toBe(types.length);
        const order = ['Condition', 'Decision', 'Repeater'] as const;
        const ranks = types.map((t) => order.indexOf(t as (typeof order)[number]));
        expect(ranks.every((r) => r >= 0)).toBe(true);
        expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
        for (const item of out) {
          expect(items.find((i) => i.type === item.type)).toEqual(item);
        }
      }),
      { numRuns: 60 },
    );
  });

  it('featuredLogicItems(true) is all logic-typed items in input order (P-LIM-04)', () => {
    fc.assert(
      fc.property(fc.array(itemArb, { maxLength: 16 }), (items) => {
        const expected = items.filter((i) =>
          (FEATURED_PALETTE_TYPES as readonly string[]).includes(i.type),
        );
        expect(featuredLogicItems(items, true)).toEqual(expected);
      }),
      { numRuns: 60 },
    );
  });

  it('non-object metadata omitted; plain object shallow-copied (P-LIM-05)', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(null),
          fc.constant(1),
          fc.constant('x'),
          fc.array(fc.string(), { maxLength: 3 }),
          fc.dictionary(fc.string({ minLength: 1, maxLength: 6 }), fc.string(), { maxKeys: 3 }),
        ),
        (metadata) => {
          const palette = sanitizeHostPaletteItems([
            { key: 'k', type: 'Condition', label: 'If', metadata },
          ]);
          const agents = sanitizeHostDefaultAgents([{ key: 'k', label: 'If', metadata }]);
          const isPlain =
            metadata !== null && typeof metadata === 'object' && !Array.isArray(metadata);
          if (isPlain) {
            expect(palette[0]?.metadata).toEqual({ ...(metadata as Record<string, unknown>) });
            expect(agents[0]?.metadata).toEqual({ ...(metadata as Record<string, unknown>) });
            expect(palette[0]?.metadata).not.toBe(metadata);
          } else {
            expect(palette[0]?.metadata).toBeUndefined();
            expect(agents[0]?.metadata).toBeUndefined();
          }
        },
      ),
      { numRuns: 50 },
    );
  });

  it('sanitizeHostPaletteItems never emits unknown types or blank key/type/label (NFR-HPI-04)', () => {
    const garbageArb = fc.oneof(
      fc.constant(null),
      fc.constant(0),
      fc.constant(''),
      fc.constant('Stream'),
      fc.record({
        key: fc.string(),
        type: fc.oneof(nodeTypeArb, fc.constantFrom('Stream', 'Router', '')),
        label: fc.string(),
      }),
      itemArb,
    );
    fc.assert(
      fc.property(fc.array(garbageArb, { maxLength: 20 }), (rows) => {
        const out = sanitizeHostPaletteItems(rows);
        for (const item of out) {
          expect((ALLOWED_NODE_TYPES as readonly string[]).includes(item.type)).toBe(true);
          expect(item.key.trim().length).toBeGreaterThan(0);
          expect(item.label.trim().length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 80 },
    );
  });
});
