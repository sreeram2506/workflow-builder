import { describe, expect, it } from 'vitest';
import {
  builtInCollisionIds,
  getPropertiesMap,
  inferControlKind,
  listRemainingPropertyKeys,
  schemaCoveredPaths,
  withPropertiesMap,
} from './host-properties.dynamic';
import type { HostPropertiesSchema } from './host-properties.schema';

describe('host-properties.dynamic', () => {
  it('getPropertiesMap treats missing/non-object as {}', () => {
    expect(getPropertiesMap({})).toEqual({});
    expect(getPropertiesMap({ properties: null })).toEqual({});
    expect(getPropertiesMap({ properties: [] as unknown as Record<string, unknown> })).toEqual({});
    expect(getPropertiesMap({ properties: { a: 1 } })).toEqual({ a: 1 });
  });

  it('withPropertiesMap round-trips plain entries', () => {
    const next = withPropertiesMap({ label: 'x' }, { timeout: '30', enabled: true });
    expect(getPropertiesMap(next)).toEqual({ timeout: '30', enabled: true });
    expect(next['label']).toBe('x');
  });

  it('inferControlKind matches FR-DP-03', () => {
    expect(inferControlKind('hi')).toBe('text');
    expect(inferControlKind(3)).toBe('number');
    expect(inferControlKind(true)).toBe('boolean');
    expect(inferControlKind(null)).toBe('text');
    expect(inferControlKind(undefined)).toBe('text');
    expect(inferControlKind({ a: 1 })).toBe('readonlyJson');
    expect(inferControlKind([1, 2])).toBe('readonlyJson');
  });

  it('listRemainingPropertyKeys keeps insertion order and filters covered/collision', () => {
    const map = { timeout: '1', tag: 'vip', condition: 'x', z: true };
    const covered = new Set(['timeout']);
    const collisions = new Set(['condition']);
    expect(listRemainingPropertyKeys(map, covered, collisions)).toEqual(['tag', 'z']);
  });

  it('listRemainingPropertyKeys skips nested roots covered by dotted paths', () => {
    const map = { config: { data: { retrain: false } }, tag: 'x' };
    const covered = new Set(['config.data.retrain']);
    expect(listRemainingPropertyKeys(map, covered, new Set())).toEqual(['tag']);
  });

  it('schemaCoveredPaths uses visible fields only', () => {
    const schema: HostPropertiesSchema = {
      sections: [
        {
          fields: [
            { type: 'text', path: 'a', label: 'A' },
            { type: 'text', path: 'b', label: 'B', hidden: true },
          ],
        },
      ],
    };
    expect([...schemaCoveredPaths(schema)]).toEqual(['a']);
  });

  it('builtInCollisionIds for Condition includes condition', () => {
    expect(builtInCollisionIds('Condition').has('condition')).toBe(true);
    expect(builtInCollisionIds('Decision').size).toBe(0);
    expect(builtInCollisionIds('Repeater').has('repeater.workflowId')).toBe(true);
  });
});
