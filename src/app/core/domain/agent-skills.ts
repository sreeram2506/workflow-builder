/** Agent skill list helpers on AIAgent.data.skills (U-SW-01b). */

export interface AgentSkillRef {
  skillId: string;
  name: string;
  description: string;
}

export function ensureSkillsArray(data: Record<string, unknown> | undefined): AgentSkillRef[] {
  const raw = data?.['skills'];
  if (!Array.isArray(raw)) {
    return [];
  }
  const out: AgentSkillRef[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') {
      continue;
    }
    const rec = item as Record<string, unknown>;
    const skillId = String(rec['skillId'] ?? '').trim();
    if (!skillId) {
      continue;
    }
    out.push({
      skillId,
      name: String(rec['name'] ?? skillId),
      description: String(rec['description'] ?? ''),
    });
  }
  return out;
}

/** Append skill; no-op if skillId already present. */
export function appendSkill(
  skills: readonly AgentSkillRef[],
  skill: Pick<AgentSkillRef, 'skillId' | 'name' | 'description'>,
): { skills: AgentSkillRef[]; added: boolean } {
  if (skills.some((s) => s.skillId === skill.skillId)) {
    return { skills: [...skills], added: false };
  }
  return {
    skills: [
      ...skills,
      {
        skillId: skill.skillId,
        name: skill.name,
        description: skill.description,
      },
    ],
    added: true,
  };
}

export function removeSkill(
  skills: readonly AgentSkillRef[],
  skillId: string,
): AgentSkillRef[] {
  return skills.filter((s) => s.skillId !== skillId);
}

export function withSkillsData(
  data: Record<string, unknown> | undefined,
  skills: readonly AgentSkillRef[],
): Record<string, unknown> {
  return { ...(data ?? {}), skills: [...skills] };
}
