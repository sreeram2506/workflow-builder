# Component Methods — Remove APIs and dummy data

High-level interfaces. Compose empty-omit invariant and nested search → Functional Design.

---

## EnsoTaskCatalogService (change, Q1=A)

| Method | Change |
|---|---|
| `loadCatalog` | Omit `hostPalettes` and no adapter → `emptyRemote` (same payload shape as `[]`). Adapter-when-omit unchanged. Host overlay unchanged. |
| `loadSolutionAgents` / `loadAgentSkills` | No Enso HTTP branch. Adapter if present; else empty-remote. |
| `loadEnsoPipelines` / `loadEnsoTasks` | **Delete** |
| `resolveAccessToken` / catalog user-id helpers | **Delete** if only used by Enso HTTP |
| `composeSolution` / `composeSkills` | Unchanged U-LIM omit-static-featured when host palettes present non-empty |
| `errorLoad` | Unchanged (static fallback on **adapter** failure only) (Q2=A) |
| HttpClient inject | **Remove** from this service |

`source` for omit-without-adapter: `'empty'` (same as empty host list). No `'enso'` source.

---

## NestedSkillsLibraryComponent (convert, Q3=A)

| API | Input | Output | Purpose |
|---|---|---|---|
| `palettes` | `PaletteItem[] \| undefined` | — | Same overlay as `wb-agent-skills-shell [palettes]` |
| `agentNodeId` | `string` (required) | — | Existing |
| `filtered` | query + sanitized palettes | `PaletteItem[]` | Search label / description / key; omit/`[]` → `[]` |
| Add click | palette item | boolean | `addSkillFromPaletteItem` |

Does not import `MOCK_SKILLS`. Not composed in `wb-agent-skills-shell`.

---

## WorkflowFacade (change)

| API | Change |
|---|---|
| `addSkillToAgent` | Must not call `findMockSkill` / `MOCK_SKILLS` |
| `addSkillFromPaletteItem` | Unchanged; used by converted nested library |

---

## Repeater Properties (Q4=A)

| API | Change |
|---|---|
| `repeaterPropertiesSchema` workflow `options` | `[]` (no mock ids) |
| Right-sidebar workflow select | Empty option list |
| Right-sidebar version select | Empty option list |
| `repeater-mock.catalog.ts` | **Delete** (including `versionsForWorkflow`) |

---

## Config / docs

| Artifact | Purpose |
|---|---|
| `environment.ts` / `environment.prod.ts` | Strip catalog URLs, IDs, categories, credentials |
| `proxy.conf.json` / serve proxyConfig | No `/enso-api` |
| `enso-pipeline.mapper.ts` / `enso-task.mapper.ts` | Delete with HTTP |
| `docs/workflow-builder-ui-embed.md` | Empty-when-omit; nested palettes; no Enso/proxy/Bearer |
| `README.md` | Same; no token instructions |

---

## Notes

- Left sidebar already forwards omit vs `[]` vs items; catalog omit path is what changes (empty-remote instead of Enso/static featured).
- UI-config `HttpClient` is out of this service (Q5=A).
- Do not document or copy access tokens.
