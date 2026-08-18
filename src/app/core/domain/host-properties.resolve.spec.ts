import { describe, expect, it } from 'vitest';
import { logicBuiltinPropertiesSchema } from './host-properties.schema';
import { resolveHostPropertiesSchema } from './host-properties.resolve';
import type { WorkflowNode } from './workflow.models';

function node(type: WorkflowNode['type'], data: Record<string, unknown> = {}): WorkflowNode {
  return {
    id: `n-${type}-x`,
    type,
    label: type,
    subtitle: '',
    position: { x: 0, y: 0 },
    status: 'idle',
    data,
  };
}

describe('resolveHostPropertiesSchema', () => {
  it('plain-object {} wins over Condition built-in', () => {
    const resolved = resolveHostPropertiesSchema(node('Condition', { propertiesSchema: {} }), null);
    expect(resolved).toEqual({ sections: [] });
    expect(resolved).not.toEqual(logicBuiltinPropertiesSchema('Condition'));
  });

  it('adapter throw is skipped; Condition built-in still applies', () => {
    const resolved = resolveHostPropertiesSchema(node('Condition'), {
      schemaFor: () => {
        throw new Error('adapter failed');
      },
    });
    expect(resolved).toEqual(logicBuiltinPropertiesSchema('Condition'));
  });

  it('adapter non-object is skipped', () => {
    const resolved = resolveHostPropertiesSchema(node('Condition'), {
      schemaFor: () => ['nope'] as never,
    });
    expect(resolved).toEqual(logicBuiltinPropertiesSchema('Condition'));
  });

  it('Action + taskMeta with no schema returns null (does not walk taskMeta)', () => {
    const resolved = resolveHostPropertiesSchema(
      node('Action', { taskMeta: { foo: 1, nested: { a: true } } }),
      null,
    );
    expect(resolved).toBeNull();
  });
});
