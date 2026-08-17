# U-PAL-01 Code Generation Plan — Palette config core

**Status**: APPROVED — Part 2 COMPLETE  
**Unit**: `u-pal-01-palette-config-core`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-PAL-01, US-PAL-02, US-PAL-03, US-PAL-04  
**Design**: `aidlc-docs/construction/u-pal-01-palette-config-core/functional-design/`  
**FD locks**: Q1=B · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A · Q9=A · Q10=A · Q11=A  

This plan is the single source of truth for Code Generation. Do not generate code until approved.

**N/A for this unit**: API layer, Repository layer, Database migrations, Deployment artifacts, chrome/sidebar UI.

---

## Unit context

| Item | Value |
|---|---|
| Responsibility | `UiFeatures.palette` types; presence merge; pure filter + defaultAgents helpers; PBT |
| Depends on | U-UI-01 `ui-config`; `PaletteItem` / `NodeType` / `blankAgentPaletteItem` |
| Out of scope | Catalog tokens, Enso, mocks, `LeftSidebarComponent`, embed docs |
| Code root | `src/app/core/ui-config/` (modify) + `src/app/core/domain/palette-host.helpers.ts` (new) |

---

## Story coverage

| Story | Steps |
|---|---|
| US-PAL-01 Merge palette config | 1, 2, 5, 6 |
| US-PAL-02 Solution allow-list | 1–3, 6 |
| US-PAL-03 Skills allow-list | 1–3, 6 |
| US-PAL-04 defaultAgents | 1–4, 6 |

---

## Generation Steps

### Step 1 — Domain types
- [x] Modify `src/app/core/ui-config/ui-features.types.ts` — add `AllowListState`, `DefaultAgentCard`, `DefaultAgentsState`, `PaletteSolutionFeatures`, `PaletteAgentFeatures`, `PaletteFeatures`; extend `UiFeatures` with `palette`; extend `UiFeaturesPartial` with optional palette arrays (not `mode` in JSON)
- [x] Do **not** add palette paths to `UI_FEATURE_PATHS` / `is()`

### Step 2 — Business logic: normalize + merge
- [x] Modify `src/app/core/ui-config/merge-ui-features.ts` — defaults include palette show-all / omitted defaultAgents; `normalizePartial` reads `palette.solution.types|defaultAgents` and `palette.agent.types` (array present vs omitted; unknown types dropped; `"Router"` dropped; bad shape omitted); merge **replaces** whole allow-list / defaultAgents state when the overlay key is present
- [x] Extend `src/app/core/ui-config/merge-ui-features.spec.ts` — omit vs `[]` vs present; provider wins; malformed palette ignored; `"Router"` dropped

### Step 3 — Pure helpers
- [x] Create `src/app/core/domain/palette-host.helpers.ts` — `filterPaletteItemsByAllowList`, `resolveDefaultAgents`, `applySolutionDefaultAgents`, `aiAgentAllowed` (or inline)
- [x] Create `src/app/core/domain/palette-host.helpers.spec.ts` — table-driven BR-PAL-04..07
- [x] Create `src/app/core/domain/palette-host.helpers.pbt.spec.ts` — fast-check invariants (FD Testable Properties / BR-PAL-11)

### Step 4 — Barrel + service tests
- [x] Modify `src/app/core/ui-config/index.ts` — export new palette types
- [x] Extend `src/app/core/ui-config/ui-config.service.spec.ts` — JSON + provider `palette` overlay; `features().palette` resolved

### Step 5 — Existing merge PBT
- [x] Extend `src/app/core/ui-config/merge-ui-features.pbt.spec.ts` as needed so defaults still all-true for chrome **and** palette defaults (`mode: 'all'` / omitted agents)

### Step 6 — Regression
- [x] Run `npm test` (`ng test --watch=false`) — all existing tests still pass (chrome `{}` unchanged)
- [x] Run `npm run build` — success (budget warnings OK)

### Step 7 — Construction code summaries
- [x] Write `aidlc-docs/construction/u-pal-01-palette-config-core/code/business-logic-summary.md`
- [x] Write `aidlc-docs/construction/u-pal-01-palette-config-core/code/frontend-components-summary.md` (helpers/config only)
- [x] Write `aidlc-docs/construction/u-pal-01-palette-config-core/code/code-generation-summary.md`
- [x] Write SKIP stubs: `api-layer-summary.md`, `repository-layer-summary.md`, `deployment-artifacts-summary.md`

---

## Explicitly not in this unit

- `provideWorkflowBuilderUi({ catalog })` tokens
- `EnsoTaskCatalogService` / `MOCK_SOLUTION_AGENTS`
- `left-sidebar.component.ts`
- Example JSON / embed docs (U-PAL-02)
