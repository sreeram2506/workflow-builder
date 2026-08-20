import { describe, expect, it } from 'vitest';
import {
  expandHostPropertiesConfig,
  isHostPropertiesConfigMap,
  resolveCardPropertiesConfig,
} from './host-properties.config';
import { createWorkflowNodeFromPaletteItem } from './node.factory';
import { sanitizeHostPaletteItems } from './palette-host.helpers';

describe('unified host properties config', () => {
  it('detects config map vs plain seed map', () => {
    expect(
      isHostPropertiesConfigMap({
        owner: { type: 'text', label: 'Owner', value: 'a' },
      }),
    ).toBe(true);
    expect(isHostPropertiesConfigMap({ owner: 'a', onCall: true })).toBe(false);
    expect(isHostPropertiesConfigMap({})).toBe(false);
  });

  it('expands config map to schema + seeds from value', () => {
    const expanded = expandHostPropertiesConfig({
      owner: { type: 'text', label: 'Owner', value: 'try-host', section: 'Host' },
      onCall: { type: 'boolean', label: 'On call', value: true, section: 'Host' },
      skipped: { type: 'text', label: 'Skip', enabled: false, value: 'x' },
    });
    expect(expanded?.propertiesSchema.sections).toEqual([
      {
        title: 'Host',
        fields: [
          { type: 'text', path: 'owner', label: 'Owner' },
          { type: 'boolean', path: 'onCall', label: 'On call' },
        ],
      },
    ]);
    expect(expanded?.properties).toEqual({ owner: 'try-host', onCall: true });
  });

  it('enabled defaults to true; false hides type/label/value/section', () => {
    const expanded = expandHostPropertiesConfig({
      shown: { type: 'text', label: 'Shown', value: 'a' },
      hidden: { type: 'text', label: 'Hidden', value: 'b', enabled: false },
    });
    expect(expanded?.propertiesSchema.sections[0]?.fields.map((f) => f.path)).toEqual(['shown']);
    expect(expanded?.properties).toEqual({ shown: 'a' });
  });

  it('resolveCardPropertiesConfig prefers unified properties over legacy schema', () => {
    const resolved = resolveCardPropertiesConfig({
      propertiesSchema: {
        sections: [{ fields: [{ type: 'text', path: 'stale', label: 'Stale' }] }],
      },
      properties: {
        owner: { type: 'text', label: 'Owner', value: 'a' },
      },
    });
    expect(resolved.propertiesSchema?.sections[0]?.fields.map((f) => f.path)).toEqual(['owner']);
    expect(resolved.properties).toEqual({ owner: 'a' });
  });

  it('sanitizeHostPaletteItems expands unified properties', () => {
    const [item] = sanitizeHostPaletteItems([
      {
        key: 'x',
        type: 'Action',
        label: 'X',
        properties: {
          channel: { type: 'text', label: 'Channel', value: 'email', section: 'Message' },
        },
      },
    ]);
    expect(item.propertiesSchema?.sections[0]?.title).toBe('Message');
    expect(item.properties).toEqual({ channel: 'email' });
  });

  it('drop merges General with unified host properties', () => {
    const node = createWorkflowNodeFromPaletteItem(
      {
        key: 'host-extra',
        type: 'Action',
        label: 'Host Extra',
        description: 'demo',
        categoryId: 'flow',
        properties: {
          owner: { type: 'text', label: 'Owner', value: 'ops', section: 'Host' },
        },
      },
      { x: 0, y: 0 },
    )!;
    const paths = (
      node.data['propertiesSchema'] as { sections: { fields: { path: string }[] }[] }
    ).sections.flatMap((s) => s.fields.map((f) => f.path));
    expect(paths).toEqual(['name', 'description', 'owner']);
    expect(node.data['properties']).toEqual({
      name: 'Host Extra',
      description: 'demo',
      owner: 'ops',
    });
  });

  it('nests dotted path seeds via setAtPath', () => {
    const expanded = expandHostPropertiesConfig({
      'config.data.retrain': {
        type: 'boolean',
        label: 'Retrain',
        value: false,
        section: 'Advanced',
      },
    });
    expect(expanded?.properties).toEqual({
      config: { data: { retrain: false } },
    });
    expect(expanded?.propertiesSchema.sections[0]?.fields[0]?.path).toBe('config.data.retrain');
  });
});
