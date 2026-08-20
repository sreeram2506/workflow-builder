import { describe, expect, it } from 'vitest';
import { asPropertiesSchemaSource } from '../ui-config/properties-adapter';
import type { WorkflowNode } from '../domain/workflow.models';

function node(paletteKey?: string): WorkflowNode {
  return {
    id: 'n-Action-x',
    type: 'Action',
    label: 'Action',
    subtitle: '',
    position: { x: 0, y: 0 },
    status: 'idle',
    data: paletteKey ? { paletteKey } : {},
  };
}

describe('asPropertiesSchemaSource', () => {
  it('returns null for undefined', () => {
    expect(asPropertiesSchemaSource(undefined)).toBeNull();
  });

  it('passes through schemaFor adapters', () => {
    const adapter = { schemaFor: () => ({ sections: [] }) };
    expect(asPropertiesSchemaSource(adapter)).toBe(adapter);
  });

  it('looks up map entries by paletteKey', () => {
    const source = asPropertiesSchemaSource({
      'via-properties-input': {
        sections: [{ fields: [{ type: 'text', path: 'channel', label: 'Channel' }] }],
      },
    });
    expect(source?.schemaFor(node('via-properties-input'))).toEqual({
      sections: [{ fields: [{ type: 'text', path: 'channel', label: 'Channel' }] }],
    });
    expect(source?.schemaFor(node('other'))).toBeNull();
    expect(source?.schemaFor(node())).toBeNull();
  });
});
