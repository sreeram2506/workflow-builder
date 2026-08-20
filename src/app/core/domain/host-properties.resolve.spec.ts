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

function pathsOf(resolved: ReturnType<typeof resolveHostPropertiesSchema>): string[] {
  return resolved?.sections.flatMap((s) => s.fields.map((f) => f.path)) ?? [];
}

describe('resolveHostPropertiesSchema', () => {
  it('empty snapshot still keeps General library (not Condition built-in alone)', () => {
    const resolved = resolveHostPropertiesSchema(node('Condition', { propertiesSchema: {} }), null);
    expect(pathsOf(resolved)).toEqual(['name', 'description']);
    expect(resolved).not.toEqual(logicBuiltinPropertiesSchema('Condition'));
  });

  it('adapter throw is skipped; library defaults still apply for Condition', () => {
    const resolved = resolveHostPropertiesSchema(node('Condition'), {
      schemaFor: () => {
        throw new Error('adapter failed');
      },
    });
    expect(resolved?.sections[0]?.title).toBe('General');
    expect(pathsOf(resolved)).toEqual(['name', 'description']);
  });

  it('adapter non-object is skipped; library defaults apply', () => {
    const resolved = resolveHostPropertiesSchema(node('Condition'), {
      schemaFor: () => ['nope'] as never,
    });
    expect(pathsOf(resolved)).toEqual(['name', 'description']);
  });

  it('Action + taskMeta with no schema uses library defaults (does not walk taskMeta)', () => {
    const resolved = resolveHostPropertiesSchema(
      node('Action', { taskMeta: { foo: 1, nested: { a: true } } }),
      null,
    );
    expect(resolved?.sections[0]?.title).toBe('General');
    expect(pathsOf(resolved)).toEqual(['name', 'description']);
  });

  it('live host schema merges on top of General (does not drop name/description)', () => {
    const resolved = resolveHostPropertiesSchema(
      node('Condition', {
        paletteKey: 'host-if-schema',
        propertiesSchema: {
          sections: [{ fields: [{ type: 'text', path: 'oldOnly', label: 'Old' }] }],
        },
      }),
      null,
      [
        {
          key: 'host-if-schema',
          type: 'Condition',
          label: 'Host If',
          description: '',
          categoryId: 'logic',
          propertiesSchema: {
            sections: [
              {
                title: 'Branch',
                fields: [
                  { type: 'text', path: 'note', label: 'Note' },
                  { type: 'textarea', path: 'branchNote', label: 'Branch note' },
                ],
              },
            ],
          },
        },
      ],
    );
    expect(pathsOf(resolved)).toEqual(['name', 'description', 'note', 'branchNote']);
  });

  it('live defaultAgents schema merges on top of General', () => {
    const resolved = resolveHostPropertiesSchema(
      node('AIAgent', {
        paletteKey: 'sreeram',
        propertiesSchema: {
          sections: [{ fields: [{ type: 'text', path: 'stale', label: 'Stale' }] }],
        },
      }),
      null,
      null,
      null,
      [
        {
          key: 'sreeram',
          label: 'Sreeram',
          propertiesSchema: {
            sections: [{ fields: [{ type: 'text', path: 'owner', label: 'Owner' }] }],
          },
        },
      ],
    );
    expect(pathsOf(resolved)).toEqual(['name', 'description', 'owner']);
  });

  it('instance [properties] merges on top of General when palette has no schema', () => {
    const resolved = resolveHostPropertiesSchema(
      node('Action', {
        paletteKey: 'via-properties-input',
        propertiesSchema: {
          sections: [{ fields: [{ type: 'text', path: 'stale', label: 'Stale' }] }],
        },
      }),
      null,
      [{ key: 'via-properties-input', type: 'Action', label: 'Via', description: '', categoryId: 'flow' }],
      {
        schemaFor: (n) =>
          n.data['paletteKey'] === 'via-properties-input'
            ? {
                sections: [
                  { fields: [{ type: 'text', path: 'channel', label: 'Channel' }] },
                ],
              }
            : null,
      },
    );
    expect(pathsOf(resolved)).toEqual(['name', 'description', 'channel']);
  });

  it('live libraryProperties false does not strip existing snapshot fields (Q5)', () => {
    const resolved = resolveHostPropertiesSchema(
      node('Action', {
        paletteKey: 'desc-off',
        propertiesSchema: {
          sections: [
            {
              fields: [
                { type: 'text', path: 'name', label: 'Name' },
                { type: 'textarea', path: 'description', label: 'Description' },
              ],
            },
          ],
        },
      }),
      null,
      [
        {
          key: 'desc-off',
          type: 'Action',
          label: 'Desc off',
          description: '',
          categoryId: 'flow',
          libraryProperties: { description: false },
        },
      ],
    );
    expect(pathsOf(resolved)).toEqual(['name', 'description']);
  });

  it('library filter applies when there is no snapshot', () => {
    const resolved = resolveHostPropertiesSchema(
      node('Action', { paletteKey: 'desc-off' }),
      null,
      [
        {
          key: 'desc-off',
          type: 'Action',
          label: 'Desc off',
          description: '',
          categoryId: 'flow',
          libraryProperties: { description: false },
        },
      ],
    );
    expect(pathsOf(resolved)).toEqual(['name']);
  });
});
