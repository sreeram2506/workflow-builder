# Domain Entities — U-SW-01b Nested Agent Skills

## MockSkill (catalog)

| Field | Type | Notes |
|---|---|---|
| `skillId` | string | Stable id |
| `name` | string | Display |
| `description` | string | Short blurb |

Catalog: **5** fixed entries in `mock-skills.catalog.ts`.

## AgentSkillRef (on node)

| Field | Type | Notes |
|---|---|---|
| `skillId` | string | Matches catalog |
| `name` | string | Copied at add time |
| `description` | string | Optional; copied at add |

Stored as `AIAgent.data.skills: AgentSkillRef[]` (ordered).

## Helpers (pure)

| Function | Purpose |
|---|---|
| `ensureSkillsArray(data)` | Normalize missing/invalid to `[]` |
| `appendSkill(skills, mock)` | Dedupe by skillId |
| `removeSkill(skills, skillId)` | Filter out |
| `filterMockSkills(catalog, query)` | Optional search |

## Routing

| Path | Param | Meaning |
|---|---|---|
| `/` | — | Solution canvas |
| `/agent/:nodeId` | `nodeId` | Nested skills for that Blank Agent |

## Session UI (from 01a, extended)

- `OpenAgentTabsState` unchanged
- Nested may track `selectedSkillId: string | null` in UiStore for Properties focus
