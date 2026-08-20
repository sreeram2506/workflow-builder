import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  createDefaultUiFeatures,
  mergeInstanceUiFeatures,
  mergeUiFeatures,
  normalizePartial,
  resolveUiFeatures,
} from './merge-ui-features';
import type { UiFeatures, UiFeaturesPartial } from './ui-features.types';

const bool = fc.boolean();

const partialArb: fc.Arbitrary<UiFeaturesPartial> = fc.record(
  {
    topBar: fc.option(
      fc.record(
        {
          enabled: fc.option(bool, { nil: undefined }),
          theme: fc.option(bool, { nil: undefined }),
          save: fc.option(bool, { nil: undefined }),
        },
        { requiredKeys: [] },
      ),
      { nil: undefined },
    ),
    agentsLibrary: fc.option(
      fc.record(
        {
          enabled: fc.option(bool, { nil: undefined }),
        },
        { requiredKeys: [] },
      ),
      { nil: undefined },
    ),
    agentTabs: fc.option(
      fc.record(
        {
          enabled: fc.option(bool, { nil: undefined }),
          doubleClick: fc.option(bool, { nil: undefined }),
        },
        { requiredKeys: [] },
      ),
      { nil: undefined },
    ),
    canvas: fc.option(
      fc.record(
        {
          enabled: fc.option(bool, { nil: undefined }),
          minimap: fc.option(bool, { nil: undefined }),
          layoutControls: fc.option(bool, { nil: undefined }),
          save: fc.option(bool, { nil: undefined }),
        },
        { requiredKeys: [] },
      ),
      { nil: undefined },
    ),
    themeToggle: fc.option(bool, { nil: undefined }),
    palette: fc.option(
      fc.record(
        {
          solution: fc.option(
            fc.record(
              {
                types: fc.option(
                  fc.constantFrom(
                    { mode: 'all' as const },
                    { mode: 'only' as const, types: ['Condition'] as const },
                    { mode: 'only' as const, types: [] as const },
                  ),
                  { nil: undefined },
                ),
              },
              { requiredKeys: [] },
            ),
            { nil: undefined },
          ),
        },
        { requiredKeys: [] },
      ),
      { nil: undefined },
    ),
  },
  { requiredKeys: [] },
);

describe('merge-ui-features PBT', () => {
  it('merge(defaults, {}) equals defaults', () => {
    const d = createDefaultUiFeatures();
    expect(mergeUiFeatures(d, {})).toEqual(d);
  });

  it('omitted leaves retain base (BR-11)', () => {
    fc.assert(
      fc.property(partialArb, (partial) => {
        const base = createDefaultUiFeatures();
        const merged = mergeUiFeatures(base, partial);
        if (partial.canvas?.save === undefined && partial.topBar?.save === undefined) {
          expect(merged.canvas.save).toBe(base.canvas.save);
        } else if (partial.canvas?.save !== undefined) {
          expect(merged.canvas.save).toBe(partial.canvas.save);
        } else {
          expect(merged.canvas.save).toBe(partial.topBar?.save);
        }
        if (partial.canvas?.minimap === undefined) {
          expect(merged.canvas.minimap).toBe(base.canvas.minimap);
        }
        if (partial.canvas?.layoutControls === undefined) {
          expect(merged.canvas.layoutControls).toBe(base.canvas.layoutControls);
        }
        if (partial.palette?.solution?.types === undefined) {
          expect(merged.palette.solution.types).toEqual(base.palette.solution.types);
        } else {
          expect(merged.palette.solution.types).toEqual(partial.palette.solution.types);
        }
      }),
      { numRuns: 50 },
    );
  });

  it('provider overlay wins when set (BR-11)', () => {
    fc.assert(
      fc.property(bool, bool, (jsonVal, providerVal) => {
        const resolved = resolveUiFeatures(
          { agentsLibrary: { enabled: jsonVal } },
          { agentsLibrary: { enabled: providerVal } },
        );
        expect(resolved.agentsLibrary.enabled).toBe(providerVal);
      }),
      { numRuns: 30 },
    );
  });

  it('nested groups merge independently', () => {
    fc.assert(
      fc.property(bool, bool, (save, minimap) => {
        const merged = mergeUiFeatures(createDefaultUiFeatures(), {
          canvas: { save, minimap },
        });
        expect(merged.canvas.save).toBe(save);
        expect(merged.canvas.minimap).toBe(minimap);
        expect(merged.canvas.export).toBe(true);
        expect(merged.palette.solution.types.mode).toBe('all');
      }),
      { numRuns: 30 },
    );
  });

  it('provider palette types replace JSON when set', () => {
    fc.assert(
      fc.property(fc.boolean(), (useEmpty) => {
        const jsonTypes = { mode: 'only' as const, types: ['Condition'] as const };
        const providerTypes = useEmpty
          ? { mode: 'only' as const, types: [] as const }
          : { mode: 'only' as const, types: ['Repeater'] as const };
        const resolved = resolveUiFeatures(
          { palette: { solution: { types: jsonTypes } } },
          { palette: { solution: { types: providerTypes } } },
        );
        expect(resolved.palette.solution.types).toEqual(providerTypes);
        expect(resolved.palette.agent.types.mode).toBe('all');
      }),
      { numRuns: 20 },
    );
  });

  it('mergeInstanceUiFeatures: defined partial leaves win; never mutates base clone', () => {
    fc.assert(
      fc.property(partialArb, (partial) => {
        const base = createDefaultUiFeatures();
        base.agentsLibrary.enabled = false;
        base.canvas.minimap = false;
        const snapshot: UiFeatures = structuredClone(base);
        const merged = mergeInstanceUiFeatures(base, partial);
        expect(base).toEqual(snapshot);
        const normalized = normalizePartial(partial);
        if (normalized.agentsLibrary?.enabled !== undefined) {
          expect(merged.agentsLibrary.enabled).toBe(normalized.agentsLibrary.enabled);
        } else {
          expect(merged.agentsLibrary.enabled).toBe(base.agentsLibrary.enabled);
        }
        if (normalized.canvas?.minimap !== undefined) {
          expect(merged.canvas.minimap).toBe(normalized.canvas.minimap);
        } else {
          expect(merged.canvas.minimap).toBe(base.canvas.minimap);
        }
      }),
      { numRuns: 50 },
    );
  });

  it('agentTabs.doubleClick: omit keeps true; explicit false wins; independent of enabled', () => {
    fc.assert(
      fc.property(bool, bool, (enabled, doubleClick) => {
        const omitted = mergeUiFeatures(createDefaultUiFeatures(), { agentTabs: { enabled } });
        expect(omitted.agentTabs.doubleClick).toBe(true);
        const merged = mergeUiFeatures(createDefaultUiFeatures(), {
          agentTabs: { enabled, doubleClick },
        });
        expect(merged.agentTabs.enabled).toBe(enabled);
        expect(merged.agentTabs.doubleClick).toBe(doubleClick);
        const fromFalse = mergeUiFeatures(createDefaultUiFeatures(), {
          agentTabs: { doubleClick: false },
        });
        expect(fromFalse.agentTabs.doubleClick).toBe(false);
      }),
      { numRuns: 30 },
    );
  });
});
