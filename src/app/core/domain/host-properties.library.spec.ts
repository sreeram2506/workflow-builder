import { describe, expect, it } from 'vitest';
import {
  isLibraryPropertyEnabled,
  libraryPropertiesSchemaForType,
  libraryPropertiesSeedForType,
  mergePropertiesSchemas,
  mergePropertySeeds,
  resolveLibraryEnableMap,
} from './host-properties.library';
import { createWorkflowNodeFromPaletteItem } from './node.factory';
import { PALETTE_ITEMS } from './palette.catalog';
import { ALLOWED_NODE_TYPES } from './workflow.models';

describe('library properties defaults', () => {
  it('provides name + description for every allowed type', () => {
    for (const type of ALLOWED_NODE_TYPES) {
      expect(
        libraryPropertiesSchemaForType(type)?.sections[0]?.fields.map((f) => f.path),
      ).toEqual(['name', 'description']);
      expect(libraryPropertiesSeedForType(type)).toEqual({ name: '', description: '' });
    }
  });

  it('isLibraryPropertyEnabled defaults to true unless explicit false', () => {
    expect(isLibraryPropertyEnabled('name')).toBe(true);
    expect(isLibraryPropertyEnabled('name', { name: true })).toBe(true);
    expect(isLibraryPropertyEnabled('name', { name: false })).toBe(false);
    expect(isLibraryPropertyEnabled('name', { name: false }, { name: true })).toBe(true);
    expect(
      isLibraryPropertyEnabled('description', { description: true }, { description: false }),
    ).toBe(false);
  });

  it('filters library schema/seeds by enable map', () => {
    expect(
      libraryPropertiesSchemaForType('Action', { Action: { description: false } })?.sections[0]
        ?.fields.map((f) => f.path),
    ).toEqual(['name']);
    expect(
      libraryPropertiesSeedForType('Action', null, { name: false, description: false }),
    ).toBeNull();
    expect(resolveLibraryEnableMap('Action', { Action: { description: false } })).toEqual({
      name: true,
      description: false,
    });
  });

  it('seeds Action from library when palette omits properties config', () => {
    const base = PALETTE_ITEMS.find((i) => i.type === 'Action')!;
    const node = createWorkflowNodeFromPaletteItem(
      { ...base, key: 'plain-action', propertiesSchema: undefined, properties: undefined },
      { x: 0, y: 0 },
    )!;
    expect(node.data['propertiesSchema']).toEqual(libraryPropertiesSchemaForType('Action'));
    expect(node.data['properties']).toEqual({
      name: 'Action',
      description: 'Perform actions based on triggers',
    });
  });

  it('card libraryProperties disables paths on new drop', () => {
    const base = PALETTE_ITEMS.find((i) => i.type === 'Action')!;
    const node = createWorkflowNodeFromPaletteItem(
      {
        ...base,
        key: 'desc-off',
        propertiesSchema: undefined,
        properties: undefined,
        libraryProperties: { description: false },
      },
      { x: 0, y: 0 },
    )!;
    expect(
      (node.data['propertiesSchema'] as { sections: { fields: { path: string }[] }[] }).sections[0]
        .fields.map((f) => f.path),
    ).toEqual(['name']);
    expect(node.data['properties']).toEqual({ name: 'Action' });
  });

  it('merges host schema/seeds with enabled library defaults', () => {
    const base = PALETTE_ITEMS.find((i) => i.type === 'Action')!;
    const node = createWorkflowNodeFromPaletteItem(
      {
        ...base,
        key: 'host-action',
        propertiesSchema: {
          sections: [{ fields: [{ type: 'text', path: 'custom', label: 'Custom' }] }],
        },
        properties: { custom: 'host' },
      },
      { x: 0, y: 0 },
    )!;
    const paths = (
      node.data['propertiesSchema'] as { sections: { fields: { path: string }[] }[] }
    ).sections.flatMap((s) => s.fields.map((f) => f.path));
    expect(paths).toEqual(['name', 'description', 'custom']);
    expect(node.data['properties']).toEqual({
      name: 'Action',
      description: 'Perform actions based on triggers',
      custom: 'host',
    });
  });

  it('mergePropertiesSchemas prefers host field on same path', () => {
    const merged = mergePropertiesSchemas(
      {
        sections: [{ fields: [{ type: 'text', path: 'name', label: 'Lib' }] }],
      },
      {
        sections: [{ fields: [{ type: 'textarea', path: 'name', label: 'Host' }] }],
      },
    );
    expect(merged?.sections.flatMap((s) => s.fields.map((f) => f.label))).toEqual(['Host']);
    expect(mergePropertySeeds({ name: 'a', description: 'x' }, { name: 'b' })).toEqual({
      name: 'b',
      description: 'x',
    });
  });
});
