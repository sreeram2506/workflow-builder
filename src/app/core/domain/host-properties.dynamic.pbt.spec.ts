import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  getPropertiesMap,
  inferControlKind,
  listRemainingPropertyKeys,
  withPropertiesMap,
} from './host-properties.dynamic';

describe('host-properties.dynamic PBT (U-DP-01)', () => {
  it('inferControlKind matches FR-DP-03 for primitives (P-DP-01)', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.string({ maxLength: 20 }),
          fc.double({ noNaN: true, noDefaultInfinity: true }),
          fc.boolean(),
          fc.constant(null),
          fc.constant(undefined),
          fc.dictionary(fc.stringMatching(/^[a-z]{1,4}$/), fc.integer(), { maxKeys: 2 }),
          fc.array(fc.integer(), { maxLength: 3 }),
        ),
        (value) => {
          const kind = inferControlKind(value);
          if (value === null || value === undefined || typeof value === 'string') {
            expect(kind).toBe('text');
          } else if (typeof value === 'number') {
            expect(kind).toBe('number');
          } else if (typeof value === 'boolean') {
            expect(kind).toBe('boolean');
          } else {
            expect(kind).toBe('readonlyJson');
          }
        },
      ),
      { numRuns: 40, seed: 20260819 },
    );
  });

  it('listRemainingPropertyKeys never returns covered or collision keys (P-DP-02)', () => {
    fc.assert(
      fc.property(
        fc.dictionary(fc.stringMatching(/^[a-z]{1,8}$/), fc.string({ maxLength: 8 }), { maxKeys: 6 }),
        fc.array(fc.stringMatching(/^[a-z]{1,8}$/), { maxLength: 4 }),
        fc.array(fc.stringMatching(/^[a-z]{1,8}$/), { maxLength: 4 }),
        (map, coveredArr, collisionArr) => {
          const covered = new Set(coveredArr);
          const collisions = new Set(collisionArr);
          for (const key of listRemainingPropertyKeys(map, covered, collisions)) {
            expect(covered.has(key)).toBe(false);
            expect(collisions.has(key)).toBe(false);
            expect(Object.prototype.hasOwnProperty.call(map, key)).toBe(true);
          }
        },
      ),
      { numRuns: 40, seed: 20260819 },
    );
  });

  it('withPropertiesMap / getPropertiesMap round-trip plain string maps (P-DP-03)', () => {
    fc.assert(
      fc.property(
        fc.dictionary(fc.stringMatching(/^[a-z]{1,8}$/), fc.string({ maxLength: 12 }), { maxKeys: 5 }),
        (map) => {
          const next = withPropertiesMap({}, map);
          expect(getPropertiesMap(next)).toEqual(map);
        },
      ),
      { numRuns: 40, seed: 20260819 },
    );
  });
});
