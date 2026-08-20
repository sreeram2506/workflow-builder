import { describe, expect, it } from 'vitest';
import {
  applyThemeAlias,
  buildPathIndex,
  createDefaultUiFeatures,
  mergeInstanceUiFeatures,
  mergeUiFeatures,
  normalizePartial,
  resolveUiFeatures,
} from './merge-ui-features';
import type { UiFeaturesPartial } from './ui-features.types';

describe('merge-ui-features', () => {
  it('createDefaultUiFeatures sets all leaves true', () => {
    const d = createDefaultUiFeatures();
    expect(d.topBar.theme).toBe(true);
    expect(d.canvas.save).toBe(true);
    expect(d.agentTabs.enabled).toBe(true);
    expect(d.agentTabs.doubleClick).toBe(true);
    expect(d.agentsLibrary.enabled).toBe(true);
    expect(d.skillsLibrary.enabled).toBe(true);
    expect(d.propertiesPanel.enabled).toBe(true);
    expect(d.canvas.minimap).toBe(true);
    expect(d.canvas.layoutControls).toBe(true);
  });

  it('merge retains omitted leaves from base', () => {
    const base = createDefaultUiFeatures();
    const merged = mergeUiFeatures(base, { canvas: { save: false } });
    expect(merged.canvas.save).toBe(false);
    expect(merged.canvas.export).toBe(true);
    expect(merged.canvas.enabled).toBe(true);
  });

  it('provider wins over json via resolveUiFeatures', () => {
    const resolved = resolveUiFeatures(
      { agentsLibrary: { enabled: false } },
      { agentsLibrary: { enabled: true } },
    );
    expect(resolved.agentsLibrary.enabled).toBe(true);
  });

  it('normalizePartial ignores unknown keys and non-boolean leaves', () => {
    const partial = normalizePartial({
      unknownRegion: { enabled: false },
      topBar: { save: false, export: 'nope', logo: true },
      themeToggle: true,
    });
    expect(partial.topBar).toEqual({ save: false, logo: true });
    expect(partial.themeToggle).toBe(true);
    expect((partial as { unknownRegion?: unknown }).unknownRegion).toBeUndefined();
  });

  it('legacy topBar.save aliases canvas.save when canvas.save omitted', () => {
    const merged = mergeUiFeatures(createDefaultUiFeatures(), { topBar: { save: false } });
    expect(merged.canvas.save).toBe(false);
    expect(merged.canvas.export).toBe(true);
  });

  it('canvas.save wins over legacy topBar.save in the same layer', () => {
    const merged = mergeUiFeatures(createDefaultUiFeatures(), {
      topBar: { save: false },
      canvas: { save: true },
    });
    expect(merged.canvas.save).toBe(true);
  });

  it('themeToggle overwrites topBar.theme in same layer', () => {
    const merged = mergeUiFeatures(createDefaultUiFeatures(), {
      topBar: { theme: false },
      themeToggle: true,
    });
    expect(merged.topBar.theme).toBe(true);
  });

  it('mergeInstanceUiFeatures treats undefined and {} as no overlay', () => {
    const base = createDefaultUiFeatures();
    base.agentsLibrary.enabled = false;
    expect(mergeInstanceUiFeatures(base, undefined)).toEqual(base);
    expect(mergeInstanceUiFeatures(base, {})).toEqual(base);
  });

  it('mergeInstanceUiFeatures does not mutate global', () => {
    const global = createDefaultUiFeatures();
    const snapshot = structuredClone(global);
    mergeInstanceUiFeatures(global, { agentsLibrary: { enabled: false }, themeToggle: false });
    expect(global).toEqual(snapshot);
  });

  it('mergeInstanceUiFeatures normalizes and applies themeToggle', () => {
    const global = createDefaultUiFeatures();
    const merged = mergeInstanceUiFeatures(global, {
      unknownRegion: { enabled: false },
      themeToggle: false,
      agentsLibrary: { enabled: false },
    } as UiFeaturesPartial);
    expect(merged.topBar.theme).toBe(false);
    expect(merged.agentsLibrary.enabled).toBe(false);
    expect(merged.propertiesPanel.enabled).toBe(true);
  });

  it('applyThemeAlias no-ops when undefined', () => {
    const f = createDefaultUiFeatures();
    f.topBar.theme = false;
    expect(applyThemeAlias(f, undefined).topBar.theme).toBe(false);
  });

  it('buildPathIndex maps themeToggle to topBar.theme', () => {
    const f = createDefaultUiFeatures();
    f.topBar.theme = false;
    const index = buildPathIndex(f);
    expect(index.get('themeToggle')).toBe(false);
    expect(index.get('topBar.theme')).toBe(false);
    expect(index.get('topBar.save')).toBe(true);
    expect(index.get('canvas.save')).toBe(true);
  });

  it('normalizePartial returns {} for non-object', () => {
    expect(normalizePartial(null)).toEqual({});
    expect(normalizePartial([])).toEqual({});
    expect(normalizePartial('x')).toEqual({});
  });

  it('example all-off JSON normalizes every known leaf to false', () => {
    const partial = normalizePartial({
      topBar: {
        enabled: false,
        logo: false,
        title: false,
        status: false,
        theme: false,
        editView: false,
      },
      agentTabs: { enabled: false, doubleClick: false },
      agentsLibrary: { enabled: false },
      skillsLibrary: { enabled: false },
      propertiesPanel: { enabled: false },
      canvas: {
        enabled: false,
        zoomControls: false,
        minimap: false,
        floatingActions: false,
        layoutControls: false,
        save: false,
        export: false,
        import: false,
        run: false,
        reset: false,
      },
    });
    const resolved = resolveUiFeatures(partial, {});
    expect(resolved.canvas.save).toBe(false);
    expect(resolved.agentsLibrary.enabled).toBe(false);
    expect(resolved.canvas.minimap).toBe(false);
    expect(resolved.canvas.layoutControls).toBe(false);
    expect(resolved.topBar.theme).toBe(false);
    expect(resolved.agentTabs.doubleClick).toBe(false);
  });

  it('palette defaults are show-all and omitted defaultAgents', () => {
    const d = createDefaultUiFeatures();
    expect(d.palette.solution.types).toEqual({ mode: 'all' });
    expect(d.palette.agent.types).toEqual({ mode: 'all' });
    expect(d.palette.solution.defaultAgents).toEqual({ mode: 'omitted' });
  });

  it('omitted palette keys keep defaults; empty types is only-none', () => {
    const omitted = resolveUiFeatures({}, {});
    expect(omitted.palette.solution.types.mode).toBe('all');
    const empty = normalizePartial({ palette: { solution: { types: [] } } });
    const resolved = resolveUiFeatures(empty, {});
    expect(resolved.palette.solution.types).toEqual({ mode: 'only', types: [] });
    expect(resolved.palette.agent.types).toEqual({ mode: 'all' });
  });

  it('present types replace lower layer; provider wins', () => {
    const resolved = resolveUiFeatures(
      { palette: { solution: { types: { mode: 'only', types: ['Condition'] } } } },
      { palette: { solution: { types: { mode: 'only', types: ['Condition', 'Repeater'] } } } },
    );
    expect(resolved.palette.solution.types).toEqual({
      mode: 'only',
      types: ['Condition', 'Repeater'],
    });
  });

  it('normalizePartial drops unknown type keys and Router', () => {
    const partial = normalizePartial({
      palette: {
        solution: { types: ['Condition', 'Router', 'decision', 'Foo', 'AIAgent'] },
        agent: { types: ['Action'] },
      },
    });
    expect(partial.palette?.solution?.types).toEqual({
      mode: 'only',
      types: ['Condition', 'AIAgent'],
    });
    expect(partial.palette?.agent?.types).toEqual({ mode: 'only', types: ['Action'] });
  });

  it('normalizePartial skips invalid defaultAgents cards; last key wins; [] is present', () => {
    const presentEmpty = normalizePartial({
      palette: { solution: { defaultAgents: [{ key: '', label: 'x' }] } },
    });
    expect(presentEmpty.palette?.solution?.defaultAgents).toEqual({ mode: 'present', cards: [] });

    const dups = normalizePartial({
      palette: {
        solution: {
          defaultAgents: [
            { key: 'a', label: 'First', description: '1' },
            { key: 'b', label: 'Bee' },
            { key: 'a', label: 'Last', extra: true },
            { key: 1, label: 'bad' },
          ],
        },
      },
    });
    expect(dups.palette?.solution?.defaultAgents).toEqual({
      mode: 'present',
      cards: [
        { key: 'b', label: 'Bee', description: '' },
        { key: 'a', label: 'Last', description: '' },
      ],
    });
  });

  it('normalizePartial keeps sanitized defaultAgents extras', () => {
    const partial = normalizePartial({
      palette: {
        solution: {
          defaultAgents: [
            {
              key: 'a',
              label: 'A',
              iconUrl: 'javascript:alert(1)',
              iconPath: ' M0 0 ',
              metadata: { team: 'ops' },
            },
            {
              key: 'b',
              label: 'B',
              iconUrl: 'https://cdn.example/a.png',
              metadata: ['nope'],
            },
          ],
        },
      },
    });
    expect(partial.palette?.solution?.defaultAgents).toEqual({
      mode: 'present',
      cards: [
        { key: 'a', label: 'A', description: '', iconPath: 'M0 0', metadata: { team: 'ops' } },
        { key: 'b', label: 'B', description: '', iconUrl: 'https://cdn.example/a.png' },
      ],
    });
  });

  it('malformed palette groups are ignored', () => {
    const partial = normalizePartial({
      palette: 'nope',
      topBar: { logo: false },
    });
    expect(partial.palette).toBeUndefined();
    expect(partial.topBar).toEqual({ logo: false });

    const nested = normalizePartial({
      palette: { solution: ['x'], agent: { types: 'Condition' } },
    });
    expect(nested.palette).toBeUndefined();
  });

  it('JSON empty types then omitted provider keeps empty types', () => {
    const json = normalizePartial({ palette: { solution: { types: [] } } });
    const resolved = resolveUiFeatures(json, {});
    expect(resolved.palette.solution.types).toEqual({ mode: 'only', types: [] });
  });

  it('agentTabs.doubleClick defaults true and is independent of enabled', () => {
    expect(createDefaultUiFeatures().agentTabs.doubleClick).toBe(true);
    const omitted = mergeUiFeatures(createDefaultUiFeatures(), { agentTabs: { enabled: false } });
    expect(omitted.agentTabs.enabled).toBe(false);
    expect(omitted.agentTabs.doubleClick).toBe(true);
    const bothOff = mergeUiFeatures(createDefaultUiFeatures(), {
      agentTabs: { enabled: false, doubleClick: false },
    });
    expect(bothOff.agentTabs.enabled).toBe(false);
    expect(bothOff.agentTabs.doubleClick).toBe(false);
    const explicitFalse = mergeUiFeatures(createDefaultUiFeatures(), {
      agentTabs: { doubleClick: false },
    });
    expect(explicitFalse.agentTabs.enabled).toBe(true);
    expect(explicitFalse.agentTabs.doubleClick).toBe(false);
  });
});
