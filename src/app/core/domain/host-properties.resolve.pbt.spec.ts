import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { logicBuiltinPropertiesSchema } from './host-properties.schema';
import { resolveHostPropertiesSchema } from './host-properties.resolve';
import type { WorkflowNode } from './workflow.models';

function node(type: WorkflowNode['type'], data: Record<string, unknown> = {}): WorkflowNode {
  return {
    id: `n-${type}-pbt`,
    type,
    label: type,
    subtitle: '',
    position: { x: 0, y: 0 },
    status: 'idle',
    data,
  };
}

describe('resolveHostPropertiesSchema PBT (U-HP-01)', () => {
  it('plain-object propertiesSchema is never replaced by a logic built-in (P-HP-02)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('Condition', 'Repeater') as fc.Arbitrary<'Condition' | 'Repeater'>,
        fc.oneof(fc.constant({}), fc.record({ extra: fc.string({ maxLength: 8 }) })),
        (type, schema) => {
          const resolved = resolveHostPropertiesSchema(node(type, { propertiesSchema: schema }), null);
          expect(resolved).not.toEqual(logicBuiltinPropertiesSchema(type));
          const paths = resolved?.sections.flatMap((s) => s.fields.map((f) => f.path)) ?? [];
          if (type === 'Condition') {
            expect(paths.includes('condition')).toBe(false);
          }
          if (type === 'Repeater') {
            expect(paths.includes('repeater.workflowId')).toBe(false);
          }
        },
      ),
      { numRuns: 40, seed: 20260817 },
    );
  });

  it('does not invent fields from taskMeta; library defaults may apply (P-HP-03)', () => {
    fc.assert(
      fc.property(
        fc.dictionary(
          fc.stringMatching(/^[a-z]{1,8}$/),
          fc.oneof(fc.string({ maxLength: 8 }), fc.integer(), fc.boolean()),
          { maxKeys: 4 },
        ),
        (taskMeta) => {
          const resolved = resolveHostPropertiesSchema(node('Action', { taskMeta }), null);
          const paths = resolved?.sections.flatMap((s) => s.fields.map((f) => f.path)) ?? [];
          for (const key of Object.keys(taskMeta)) {
            expect(paths.includes(key)).toBe(false);
          }
          // Library Action defaults are allowed when host schema is absent.
          expect(paths.every((p) => p === 'name' || p === 'description')).toBe(true);
        },
      ),
      { numRuns: 40, seed: 20260817 },
    );
  });
});
