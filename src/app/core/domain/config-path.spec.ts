import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { getAtPath, setAtPath } from './config-path';
import { ALLOWED_NODE_TYPES } from './workflow.models';
import {
  LOCKED_CONFIG_PATH,
  LOGIC_NODE_TYPES,
  assertRegistryV1Invariant,
  configurationFieldsFor,
  isLogicNodeType,
} from './properties.schema';

describe('config-path', () => {
  it('getAtPath reads nested values', () => {
    const data = { config: { data: { ignore_keys_in_paragraph: true } } };
    expect(getAtPath(data, LOCKED_CONFIG_PATH)).toBe(true);
    expect(getAtPath(data, 'missing.path')).toBeUndefined();
  });

  it('setAtPath writes immutably', () => {
    const data = { other: 1 };
    const next = setAtPath(data, LOCKED_CONFIG_PATH, false);
    expect(data).toEqual({ other: 1 });
    expect(getAtPath(next, LOCKED_CONFIG_PATH)).toBe(false);
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
  it('non-logic types keep exactly one Configuration boolean at locked path', () => {
    expect(assertRegistryV1Invariant()).toBe(true);
    for (const type of ALLOWED_NODE_TYPES.filter((t) => !isLogicNodeType(t))) {
      const fields = configurationFieldsFor(type);
      expect(fields).toHaveLength(1);
      expect(fields[0]!.data_type).toBe('boolean');
      expect(fields[0]!.config_path).toBe(LOCKED_CONFIG_PATH);
    }
  });

  it('logic types have type-specific configuration fields', () => {
    expect(LOGIC_NODE_TYPES).toEqual(['Condition', 'Decision', 'Repeater']);
    expect(configurationFieldsFor('Condition').map((f) => f.config_path)).toEqual(['condition']);
    expect(configurationFieldsFor('Decision')).toEqual([]);
    expect(configurationFieldsFor('Repeater').map((f) => f.config_path)).toEqual([
      'repeater.workflowId',
      'repeater.versionId',
      'repeater.is_paused',
    ]);
  });
});
