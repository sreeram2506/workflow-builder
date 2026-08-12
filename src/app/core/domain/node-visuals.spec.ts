import { describe, expect, it } from 'vitest';
import { iconPathForType, initialsFromLabel, isLogicNodeType } from './node-visuals';

describe('node-visuals', () => {
  it('initialsFromLabel uses first letters of words', () => {
    expect(initialsFromLabel('Complete')).toBe('CO');
    expect(initialsFromLabel('Enrich Payload')).toBe('EP');
    expect(initialsFromLabel('Webhook Trigger')).toBe('WT');
    expect(initialsFromLabel('  ')).toBe('?');
  });

  it('isLogicNodeType marks Condition and Decision', () => {
    expect(isLogicNodeType('Condition')).toBe(true);
    expect(isLogicNodeType('Decision')).toBe(true);
    expect(isLogicNodeType('Action')).toBe(false);
  });

  it('iconPathForType returns non-empty paths', () => {
    for (const t of ['Trigger', 'Action', 'Condition', 'Decision', 'Delay', 'End'] as const) {
      expect(iconPathForType(t).length).toBeGreaterThan(10);
    }
  });
});
