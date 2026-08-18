import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { getAtPath, setAtPath } from './config-path';
import { ALLOWED_NODE_TYPES } from './workflow.models';
import {
  LOGIC_NODE_TYPES,
  configurationFieldPathsFor,
  isLogicNodeType,
} from './properties.schema';

const NESTED_PATH = 'config.data.flag';

describe('config-path', () => {
  it('getAtPath reads nested values', () => {
    const data = { config: { data: { flag: true } } };
    expect(getAtPath(data, NESTED_PATH)).toBe(true);
    expect(getAtPath(data, 'missing.path')).toBeUndefined();
  });

  it('setAtPath writes immutably', () => {
    const data = { other: 1 };
    const next = setAtPath(data, NESTED_PATH, false);
    expect(data).toEqual({ other: 1 });
    expect(getAtPath(next, NESTED_PATH)).toBe(false);
    expect(next['other']).toBe(1);
  });

  it('round-trip: set then get equals value (PBT)', () => {
    fc.assert(
      fc.property(
        fc.array(fc.stringMatching(/^[a-z][a-z0-9_]{0,8}$/), { minLength: 1, maxLength: 4 }),
        fc.oneof(fc.boolean(), fc.string({ maxLength: 20 }), fc.integer()),
        (segments, value) => {
          const path = segments.join('.');
          const next = setAtPath({}, path, value);
          expect(getAtPath(next, path)).toEqual(value);
        },
      ),
      { numRuns: 40 },
    );
  });
});

describe('properties.schema registry', () => {
  it('non-logic types have no built-in configuration fields', () => {
    for (const type of ALLOWED_NODE_TYPES.filter((t) => !isLogicNodeType(t))) {
      expect(configurationFieldPathsFor(type)).toEqual([]);
    }
  });

  it('logic types have type-specific configuration fields', () => {
    expect(LOGIC_NODE_TYPES).toEqual(['Condition', 'Decision', 'Repeater']);
    expect(configurationFieldPathsFor('Condition')).toEqual(['condition']);
    expect(configurationFieldPathsFor('Decision')).toEqual([]);
    expect(configurationFieldPathsFor('Repeater')).toEqual([
      'repeater.workflowId',
      'repeater.versionId',
      'repeater.is_paused',
    ]);
  });
});
