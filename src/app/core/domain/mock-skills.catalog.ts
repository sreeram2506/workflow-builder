/** Static mock developed skills for nested agent view (U-SW-01b). */

export interface MockSkill {
  skillId: string;
  name: string;
  description: string;
}

export const MOCK_SKILLS: readonly MockSkill[] = [
  {
    skillId: 'skill-extract-fields',
    name: 'Extract Fields',
    description: 'Pull structured fields from inbound documents',
  },
  {
    skillId: 'skill-validate-policy',
    name: 'Validate Policy',
    description: 'Check policy rules against claim context',
  },
  {
    skillId: 'skill-summarize',
    name: 'Summarize Case',
    description: 'Produce a short case summary for reviewers',
  },
  {
    skillId: 'skill-notify-desk',
    name: 'Notify Desk',
    description: 'Send a desk notification with key outcomes',
  },
  {
    skillId: 'skill-route-queue',
    name: 'Route to Queue',
    description: 'Assign the case to an operations queue',
  },
] as const;

export function findMockSkill(skillId: string): MockSkill | undefined {
  return MOCK_SKILLS.find((s) => s.skillId === skillId);
}

export function filterMockSkills(catalog: readonly MockSkill[], query: string): MockSkill[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return [...catalog];
  }
  return catalog.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.skillId.toLowerCase().includes(q),
  );
}
