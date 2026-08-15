import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  appendSkill,
  ensureSkillsArray,
  removeSkill,
  withSkillsData,
} from './agent-skills';
import { MOCK_SKILLS, filterMockSkills } from './mock-skills.catalog';

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
    const mock = MOCK_SKILLS[0]!;
    const once = appendSkill([], mock);
    expect(once.added).toBe(true);
    const twice = appendSkill(once.skills, mock);
    expect(twice.added).toBe(false);
    expect(twice.skills).toHaveLength(1);
  });

  it('removeSkill drops matching id', () => {
    const mock = MOCK_SKILLS[0]!;
    const { skills } = appendSkill([], mock);
    expect(removeSkill(skills, mock.skillId)).toEqual([]);
  });

  it('withSkillsData writes skills path', () => {
    expect(withSkillsData({ x: 1 }, [{ skillId: 'a', name: 'A', description: '' }])).toEqual({
      x: 1,
      skills: [{ skillId: 'a', name: 'A', description: '' }],
    });
  });

  it('filterMockSkills filters catalog', () => {
    expect(filterMockSkills(MOCK_SKILLS, 'policy').some((s) => s.skillId === 'skill-validate-policy')).toBe(
      true,
    );
    expect(filterMockSkills(MOCK_SKILLS, '')).toHaveLength(5);
  });
});

describe('agent-skills PBT', () => {
  it('append is idempotent for the same skillId', () => {
    fc.assert(
      fc.property(fc.constantFrom(...MOCK_SKILLS), (mock) => {
        const a = appendSkill([], mock);
        const b = appendSkill(a.skills, mock);
        expect(b.skills).toHaveLength(1);
        expect(b.added).toBe(false);
      }),
      { numRuns: 20 },
    );
  });
});
