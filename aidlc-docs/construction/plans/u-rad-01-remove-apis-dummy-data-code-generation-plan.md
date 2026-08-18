# U-RAD-01 Code Generation Plan — Remove APIs and dummy data

**Status**: COMPLETE — Part 2 generated; awaiting stage approval  
**Unit**: `u-rad-01-remove-apis-dummy-data`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-RAD-01, US-RAD-02, US-RAD-03, US-RAD-04  
**Design**: `aidlc-docs/construction/u-rad-01-remove-apis-dummy-data/functional-design/`  
**FD locks**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A  

This plan is the single source of truth for Code Generation. Do not run Part 2 until approved.

**N/A**: API / repository / DB / deployment artifacts (client SPA). NFR Requirements/Design and Infrastructure Design skipped.

Do **not** copy catalog credentials into docs, comments, or git. Strip them from `environment.ts`.

---

## Unit context

| Item | Value |
|---|---|
| Depends on | U-HPI overlay, U-PAL-02 adapter, U-LIM featured replace |
| Pattern | Catalog omit-without-adapter = empty-remote; delete Enso HTTP + dummy catalogs |
| Out of scope | New backend; removing adapters; renaming catalog service; mounting nested library in shell; changing adapter-failure |

---

## Story coverage

| Story | Steps |
|---|---|
| US-RAD-01 No Enso HTTP; omit empty-remote | 1–5, 10, 11 |
| US-RAD-02 Nested palettes; no MOCK_SKILLS | 6–8, 11 |
| US-RAD-03 Repeater mocks | 9, 11 |
| US-RAD-04 Docs | 10 |

---

## Generation Steps

### Step 1 — Environment credentials and URLs (US-RAD-01, BR-RAD-01, NFR-RAD-01)

- [x] Modify `src/environments/environment.ts` — remove `ensoTaskListUrl`, `ensoPipelineListUrl`, `ensoSolutionId`, `ensoUserId`, `ensoAgentId`, `ensoWorkflowId`, `ensoWorkflowVersionId`, `ensoAccessToken`, `ensoUserCategories`. Keep `production`, `routingGridSize`, `routingObstaclePadding`, `runStepDelayMs`.
- [x] Modify `src/environments/environment.prod.ts` — same strip.

### Step 2 — Dev proxy (US-RAD-01)

- [x] Delete `proxy.conf.json` (only `/enso-api` route).
- [x] Modify `angular.json` serve options — remove `proxyConfig`.

### Step 3 — Catalog service: no HTTP; omit-without-adapter empty-remote (US-RAD-01, BR-RAD-02, Q1=A)

- [x] Modify `src/app/core/data/enso-task-catalog.service.ts`:
  - Remove `HttpClient` inject and `@angular/common/http` imports
  - Delete `loadEnsoPipelines`, `loadEnsoTasks`, `resolveAccessToken`, catalog user-id helpers
  - `loadSolutionAgents` / `loadAgentSkills`: adapter if present; else return `of(emptyRemoteLoad())` (`emptyRemote: true`, `items: []`, `categories: []`, `error: null`, `source: 'empty'`)
  - Do **not** use `errorLoad` for omit-without-adapter
  - Keep host overlay, adapter path, `errorLoad` on adapter failure, U-LIM `omitStaticFeatured` when host palettes present non-empty
  - Stop importing `environment` and Enso mappers
- [x] Modify `src/app/core/data/catalog.types.ts` — comments: omit palettes is empty-remote unless adapter; drop `'enso'` from `source` union if unused

### Step 4 — Delete Enso HTTP-only mappers (US-RAD-01)

- [x] Delete `src/app/core/domain/enso-pipeline.mapper.ts` and `.spec.ts`
- [x] Delete `src/app/core/domain/enso-task.mapper.ts` and `.spec.ts`
- [x] Keep `enso-task-form.ts`

### Step 5 — Catalog tests + PBT (US-RAD-01, P-RAD-01..03)

- [x] Modify `src/app/core/data/enso-task-catalog.service.spec.ts`:
  - Remove HTTP expect/flush cases for pipeline/task list
  - Omit-without-adapter: `emptyRemote === true`, `source === 'empty'`, no static featured keys, `source !== 'enso'`
  - Keep adapter success / empty / failure (static fallback) tests; HttpTestingController optional/unused
- [x] Add PBT (same file or `enso-task-catalog.service.pbt.spec.ts`): P-RAD-01, P-RAD-02, P-RAD-03 (`fc.assert` + seed)

### Step 6 — Nested skills library (US-RAD-02, Q3=A, Q7=A)

- [x] Modify `src/app/features/agent/nested-skills-library.component.ts`:
  - `palettes = input<PaletteItem[] | undefined>()`
  - Sanitize with `sanitizeHostPaletteItems`; filter query on label/description/key
  - Add → `facade.addSkillFromPaletteItem`; empty `<ul>` when no rows
  - `data-testid` stay `nested-skills-library`; add `nested-skill-add-{key}` if useful
  - Do not import into `agent-skills-shell`
- [x] Create `src/app/features/agent/nested-skills-library.component.spec.ts` — omit/`[]` empty; items listed; search; Add calls facade

### Step 7 — Facade (US-RAD-02, Q5=A)

- [x] Modify `src/app/core/facade/workflow.facade.ts` — `addSkillToAgent` does not call `findMockSkill`; returns `false`
- [x] Modify `src/app/core/facade/workflow.facade.spec.ts` — mock skill ids no longer add; keep `addSkillFromPaletteItem` tests

### Step 8 — Delete MOCK_SKILLS (US-RAD-02)

- [x] Delete `src/app/core/domain/mock-skills.catalog.ts`
- [x] Modify `src/app/core/domain/agent-skills.spec.ts` — remove `MOCK_SKILLS` / `filterMockSkills` cases; keep remaining agent-skill tests

### Step 9 — Repeater mocks (US-RAD-03, Q4=A)

- [x] Delete `src/app/core/domain/repeater-mock.catalog.ts`
- [x] Modify `src/app/core/domain/properties.schema.ts` — Repeater workflow `options: []`
- [x] Modify `src/app/features/shell/right-sidebar.component.ts` — no mock catalog; empty workflow/version option lists; do not clear existing node values
- [x] Modify `src/app/core/domain/logic-node-rules.spec.ts` — drop mock catalog assertions; assert empty options / no dummy names

### Step 10 — Docs (US-RAD-04)

- [x] Modify `docs/workflow-builder-ui-embed.md` — omit `[palettes]` with no adapter is empty-remote (featured hidden); adapter-when-omit kept; nested skills from `[palettes]`; no Enso HTTP, proxy, or Bearer
- [x] Modify `README.md` — remove live Enso / `/enso-api` / token exception
- [x] Do not put secrets in examples

### Step 11 — Regression

- [x] Fix remaining compile/test references to deleted symbols (`environment.enso*`, `MOCK_SKILLS`, `REPEATER_MOCK_WORKFLOWS`, HttpTestingController catalog cases)
- [x] `npm test` — all green
- [x] `npm run build` — success (budget warnings OK)

### Step 12 — Construction code summaries

- [x] `aidlc-docs/construction/u-rad-01-remove-apis-dummy-data/code/business-logic-summary.md`
- [x] `frontend-components-summary.md`
- [x] `code-generation-summary.md`
- [x] SKIP stubs: `api-layer-summary.md`, `repository-layer-summary.md`, `deployment-artifacts-summary.md`

---

## Explicitly not in this unit

- New Repeater workflow API
- Mounting `wb-nested-skills-library` in the agent shell
- Renaming `EnsoTaskCatalogService`
- Changing adapter-failure to empty-remote
- Committing `src/app/try/` or a try route
- Removing `provideHttpClient()` from app config (UI JSON still needs it)

---

## Approval

Approve this plan to run Part 2 in order.
