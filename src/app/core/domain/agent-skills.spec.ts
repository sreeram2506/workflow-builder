import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  appendSkill,
  ensureSkillsArray,
  removeSkill,
  withSkillsData,
} from './agent-skills';

const sampleSkill = {
  skillId: 'skill-extract-fields',
  name: 'Extract Fields',
  description: 'Pull structured fields from inbound documents',
};

describe('agent-skills', () => {
  it('ensureSkillsArray normalizes missing and junk', () => {
    expect(ensureSkillsArray(undefined)).toEqual([]);
    expect(ensureSkillsArray({})).toEqual([]);
    expect(ensureSkillsArray({ skills: 'x' as never })).toEqual([]);
    expect(
      ensureSkillsArray({
        skills: [{ skillId: 'a', name: 'A', description: 'd' }, { foo: 1 }, null],
      }),
    ).toEqual([{ skillId: 'a', name: 'A', description: 'd' }]);
  });

  it('appendSkill dedupes by skillId', () => {
    const once = appendSkill([], sampleSkill);
    expect(once.added).toBe(true);
    const twice = appendSkill(once.skills, sampleSkill);
    expect(twice.added).toBe(false);
    expect(twice.skills).toHaveLength(1);
  });

  it('removeSkill drops matching id', () => {
    const { skills } = appendSkill([], sampleSkill);
    expect(removeSkill(skills, sampleSkill.skillId)).toEqual([]);
  });

  it('withSkillsData writes skills path', () => {
    expect(withSkillsData({ x: 1 }, [{ skillId: 'a', name: 'A', description: '' }])).toEqual({
      x: 1,
      skills: [{ skillId: 'a', name: 'A', description: '' }],
    });
  });
});

describe('agent-skills PBT', () => {
  it('append is idempotent for the same skillId', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 12 }), (skillId) => {
        const skill = { skillId, name: skillId, description: '' };
        const a = appendSkill([], skill);
        const b = appendSkill(a.skills, skill);
        expect(b.skills).toHaveLength(1);
        expect(b.added).toBe(false);
      }),
      { numRuns: 20, seed: 20260817 },
    );
  });
});
