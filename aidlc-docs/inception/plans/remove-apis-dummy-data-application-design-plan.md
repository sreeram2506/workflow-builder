# Application Design Plan — Remove APIs and dummy data

**Role**: Application Architect  
**Status**: APPROVED — ARTIFACTS GENERATED  
**Locked answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  
**Execution plan**: Approved Q1=A (1 unit U-RAD-01)  
**Requirements**: FR-RAD-01..06 · **Stories**: US-RAD-01..04

Fill every `[Answer]:`, then reply in chat (for example `answered`). Design artifacts will not be generated until this plan is approved.

This increment changes existing catalog/compose and dummy-data surfaces. No new Angular injectable is required unless you choose otherwise.

---

## Proposed components (after answers; defaults A)

| Component | Kind | Responsibility |
|---|---|---|
| `EnsoTaskCatalogService` | Existing service | Keep class name. Remove HttpClient / Enso `task/list` and `pipeline/list`. Omit `[palettes]` with no adapter → `emptyRemote`. Adapter-when-omit kept (U-PAL-02). Host overlay + U-LIM featured replace unchanged when palettes present. |
| Env + proxy | Config | Strip catalog URLs, IDs, categories, credentials from `environment.ts` / `environment.prod.ts`; remove `/enso-api` from `proxy.conf.json` / `angular.json` |
| `wb-nested-skills-library` | UI | Convert: `[palettes]` input + search + `addSkillFromPaletteItem`. Delete `MOCK_SKILLS`. Do not mount a new chrome region in the shell (left sidebar remains the visible nested Skills Library). |
| `WorkflowFacade.addSkillToAgent` | Facade | Stop resolving via `findMockSkill`. Nested Add uses `addSkillFromPaletteItem` if the nested list remains. |
| Repeater Properties | UI + schema | Delete `REPEATER_MOCK_WORKFLOWS`; workflow/version option lists empty |
| Embed / README | Docs | No Enso HTTP, proxy, or Bearer; document empty-when-omit and nested palettes |

---

## Execution checklist (Part 2 — after plan approval)

- [x] Generate `remove-apis-dummy-data-components.md`
- [x] Generate `remove-apis-dummy-data-component-methods.md`
- [x] Generate `remove-apis-dummy-data-services.md`
- [x] Generate `remove-apis-dummy-data-component-dependency.md`
- [x] Generate `remove-apis-dummy-data-application-design.md` (summary)
- [x] Validate design completeness (FR/US coverage)

---

## Question 1

**Catalog service after Enso HTTP is removed**

A) **Recommended** — Keep `EnsoTaskCatalogService` (no rename). Delete `loadEnsoPipelines` / `loadEnsoTasks` and HttpClient from this service. When `[palettes]` is omitted and no catalog adapter: return `emptyRemote` (same as `[]`). When an adapter is present: keep U-PAL-02. When `[palettes]` has items: keep U-HPI / U-LIM overlay. Delete unused Enso mapper/token helpers that exist only for those HTTP calls.

B) Rename the service (for example `PaletteCatalogService`) in the same increment

C) Split a new `EmptyRemoteCatalogService` and leave `EnsoTaskCatalogService` as a stub

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 2

**Omit vs adapter-failure**

A) **Recommended** — Omit-without-adapter is empty-remote. Adapter **failure** still uses today’s static fallback + error banner (US-PAL-06). Do not change adapter-failure into empty-remote.

B) Adapter failure also becomes empty-remote (no static featured / Blank Agent fallback)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 3

**Nested Skills Library (`wb-nested-skills-library` + MOCK_SKILLS)**

The Developed-skills component is not composed in `wb-agent-skills-shell` today. Nested Skills Library in the product is the agent-shell **left sidebar**, which already binds `[palettes]`.

A) **Recommended** — Do not add a new chrome region. Delete `MOCK_SKILLS` / `mock-skills.catalog.ts` and stop `addSkillToAgent` from depending on mock lookup. Convert `wb-nested-skills-library` to a `[palettes]` input + `addSkillFromPaletteItem` (search on label/description) so a host can compose it later, or delete the unused component if you prefer B.

B) Delete unused `wb-nested-skills-library` entirely (left sidebar remains the nested library)

C) Mount `wb-nested-skills-library` in `wb-agent-skills-shell` as a visible Developed-skills list, passing the same `[palettes]`

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 4

**Repeater Properties dummy catalog**

A) **Recommended** — Delete `repeater-mock.catalog.ts`. Workflow and version pickers get empty option lists (schema + right-sidebar). No new API.

B) Keep the catalog file as an empty exported array (API shape preserved, no dummy names)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 5

**Service layer / HttpClient**

A) **Recommended** — No new injectable. `HttpClient` remains for UI-config JSON (`UiConfigService`) only. Catalog service does not inject `HttpClient`. `provideHttpClient()` stays in app config.

B) Also remove `HttpClient` from the app if UI-config JSON can be loaded another way (out of increment scope unless you insist)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---
