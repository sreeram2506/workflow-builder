import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isUnsafeFieldPath, sanitizeHostPropertiesSchema } from './host-properties.schema';

describe('host-properties.schema PBT (U-HP-01)', () => {
  it('sanitize never keeps a field whose path is empty or contains .. (P-HP-01)', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            type: fc.constantFrom('text', 'number', 'boolean', 'select', 'mystery', ''),
            path: fc.oneof(
              fc.constant(''),
              fc.constant('..'),
              fc.constant('a..b'),
              fc.constantFrom('timeout', 'taskMeta.foo', 'retries'),
            ),
            label: fc.string({ maxLength: 12 }),
          }),
          { minLength: 0, maxLength: 8 },
        ),
        (fields) => {
          const out = sanitizeHostPropertiesSchema({ sections: [{ fields }] });
          for (const field of out.sections.flatMap((s) => s.fields)) {
            expect(isUnsafeFieldPath(field.path)).toBe(false);
            expect(['text', 'number', 'boolean', 'select', 'multiselect', 'textarea']).toContain(
              field.type,
            );
          }
        },
      ),
      { numRuns: 40, seed: 20260817 },
    );
  });
});
