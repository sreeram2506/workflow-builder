# Components — Remove APIs and dummy data

**Additive to** U-HPI / U-PAL / U-LIM catalog compose.  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  
**Unit**: U-RAD-01 (HTTP/env/proxy + empty omit + nested palettes + Repeater mocks + docs)

---

## Component catalog (changed)

| ID | Name | Layer | Role |
|---|---|---|---|
| C-RAD-CAT | `EnsoTaskCatalogService` | core/data | Keep name. No HttpClient. Omit-without-adapter = `emptyRemote`. Adapter-when-omit kept. Host overlay + U-LIM featured replace when palettes present. |
| C-RAD-ENV | `environment.ts` / `environment.prod.ts` | environments | Remove catalog URLs, IDs, categories, stored credentials |
| C-RAD-PROXY | `proxy.conf.json` / `angular.json` | tooling | Remove `/enso-api` proxy |
| C-RAD-MAP | Enso pipeline/task mappers | core/domain | Delete modules used only by catalog HTTP (`enso-pipeline.mapper`, `enso-task.mapper`) |
| C-RAD-LEFT | `LeftSidebarComponent` | features/shell | Unchanged overlay forwarding; omit now yields empty-remote from catalog (featured hidden) |
| C-RAD-NEST | `NestedSkillsLibraryComponent` | features/agent | Convert: `[palettes]` input; search; Add via `addSkillFromPaletteItem`. Do not mount in shell. |
| C-RAD-MOCK | `mock-skills.catalog.ts` | core/domain | Delete `MOCK_SKILLS` / `findMockSkill` / `filterMockSkills` |
| C-RAD-FAC | `WorkflowFacade` | core/facade | `addSkillToAgent` must not look up mock skills |
| C-RAD-REP | Repeater Properties | schema + right-sidebar | Delete `repeater-mock.catalog.ts`; empty workflow/version options |
| C-RAD-DOCS | Embed + README | docs | No Enso HTTP, proxy, or Bearer; empty-when-omit; nested palettes |

No new Angular injectable (Q5=A). Keep `enso-task-form.ts` (Properties for dropped `ensoTask`, not catalog HTTP). `HttpClient` stays for `UiConfigService` JSON only.

---

## Responsibilities

### C-RAD-CAT (Q1=A, Q2=A)

- `loadCatalog`:
  - `hostPalettes` defined (including `[]`) → existing host overlay (`emptyRemote` when sanitized list empty).
  - `hostPalettes` omitted + solution/agent adapter present → U-PAL-02 adapter load.
  - `hostPalettes` omitted + no adapter → **`emptyRemote`** (no HTTP, no static `PALETTE_ITEMS` featured compose).
- Delete `loadEnsoPipelines`, `loadEnsoTasks`, catalog token/user-id helpers used only for those posts.
- Adapter **failure** still `errorLoad` static fallback + banner (US-PAL-06). Do not treat adapter failure as empty-remote.
- When host palettes present and non-empty after sanitize: keep U-LIM omit-static-featured compose.

### C-RAD-ENV / C-RAD-PROXY

- Remove `ensoTaskListUrl`, `ensoPipelineListUrl`, solution/user/agent/workflow IDs, `ensoUserCategories`, `ensoAccessToken` from both environment files.
- Keep routing/run timing keys that are not catalog.
- Remove `/enso-api` from `proxy.conf.json` and Angular serve `proxyConfig` if that was the only proxy entry (or drop that path).

### C-RAD-MAP

- Delete `enso-pipeline.mapper.ts` and `enso-task.mapper.ts` (and their specs) if nothing else imports them after HTTP removal.
- Do **not** delete `enso-task-form.ts`.

### C-RAD-NEST (Q3=A)

- `palettes` input: `PaletteItem[] | undefined` (same contract as agent-skills-shell).
- Sanitize via existing `sanitizeHostPaletteItems`.
- Omit or `[]` → empty list.
- Search filters label / description / key.
- Add calls `facade.addSkillFromPaletteItem(agentNodeId, item)`.
- Do **not** add this component to `wb-agent-skills-shell` (left sidebar remains the visible nested Skills Library).

### C-RAD-FAC

- Remove `findMockSkill` from `addSkillToAgent` (method may return false without a mock row, or only keep view-mode / type guards). Nested Add uses `addSkillFromPaletteItem`.

### C-RAD-REP (Q4=A)

- Delete `repeater-mock.catalog.ts`.
- Repeater schema `options` for workflow = `[]`; version stays `[]`.
- Right-sidebar: no `REPEATER_MOCK_WORKFLOWS`; version list always empty until a real source exists.

### C-RAD-DOCS

- Embed and README: no live Enso catalog, `/enso-api`, or Bearer token for this SPA.
- Document omit `[palettes]` with no adapter = empty-remote (same as `[]`).
- Document nested Skills Library = agent-shell `[palettes]` (left sidebar); optional `wb-nested-skills-library [palettes]`.
- No secrets in examples.

---

## Out of scope

- New backend to replace Enso
- Removing `provideWorkflowBuilderUi({ catalog })`
- Removing `SAMPLE_WORKFLOW` test fixture
- Removing `PALETTE_ITEMS` type definitions
- Changing adapter-failure to empty-remote (Q2=A)
- Renaming `EnsoTaskCatalogService` (Q1=A)
- Mounting Developed-skills chrome in the agent shell (Q3=A)
- Canvas / Properties host icons (U-LIM)
