# U-PAL-02 Code Generation Plan — Catalog wiring + docs

**Status**: GENERATED — awaiting approval  
**Unit**: `u-pal-02-catalog-wiring`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-PAL-05, US-PAL-06, US-PAL-07  
**Design**: `aidlc-docs/construction/u-pal-02-catalog-wiring/functional-design/`  
**FD locks**: Q1=A · Q2=A · Q3=X/3b=C · Q4=A · Q5=A · Q6=A · Q7=A · Q8=B · Q9=A · Q10=A · Q11=A  

This plan is the single source of truth for Code Generation. Do not generate code until approved.

**N/A**: API / repository / DB / deployment artifacts (client SPA).

---

## Unit context

| Item | Value |
|---|---|
| Depends on | U-PAL-01 helpers + `UiFeatures.palette` |
| Out of scope | Skills `defaultAgents`; ng library; parallel adapters |
| Code | `core/ui-config`, `enso-task-catalog.service.ts`, `left-sidebar.component.ts`, `docs/`, examples |

---

## Story coverage

| Story | Steps |
|---|---|
| US-PAL-05 Catalog adapter | 2–4, 7 |
| US-PAL-06 Failure, no mocks | 4–5, 7 |
| US-PAL-07 Docs + examples | 8 |

Empty-remote empty-state is Q3b=C (with US-PAL-06 error path still static + banner).

---

## Generation Steps

### Step 1 — Domain types
- [x] Modify `src/app/core/domain/palette.catalog.ts` — optional `origin?: 'default-agent'` on `PaletteItem`
- [x] Modify `PaletteCatalogLoad` in `enso-task-catalog.service.ts` (or a small catalog-types file) — add `emptyRemote: boolean`; extend `source` with `'adapter' | 'empty'`

### Step 2 — Adapter contract + tokens
- [x] Add `WorkflowBuilderCatalogAdapter` / `CatalogAdapterResult` (ui-config or `core/data`)
- [x] Add tokens `WORKFLOW_BUILDER_CATALOG_SOLUTION` and `WORKFLOW_BUILDER_CATALOG_AGENT`
- [x] Modify `provide-workflow-builder-ui.ts` — `catalog?: { solution?; agent? }`
- [x] Export from `src/app/core/ui-config/index.ts`

### Step 3 — Catalog orchestration
- [x] Modify `src/app/core/data/enso-task-catalog.service.ts` — inject `UiConfigService` + optional tokens; Enso only if token omitted; classify **ok / empty-remote / error**; apply U-PAL-01 helpers on ok + error; tag `origin: 'default-agent'`; **never** use `MOCK_SOLUTION_AGENTS`; error messages without “mock agents” or tokens
- [x] Create `src/app/core/data/enso-task-catalog.service.spec.ts` (or extend existing) — adapter vs Enso; empty remote; HTTP error static + banner field; allow-list filter; no mock keys

### Step 4 — Remove mocks
- [x] Delete `src/app/core/domain/mock-agents.catalog.ts` if unused after Step 3
- [x] Grep: no remaining `MOCK_SOLUTION_AGENTS` imports in `src/`

### Step 5 — Left sidebar
- [x] Modify `src/app/features/shell/left-sidebar.component.ts` — empty-remote exclusive empty-state (`data-testid="palette-empty-remote"`); featured from filtered `allItems()`; `defaultAgentItems()` + one CDK list (`default-agent-strip`, `default-agent-card-{key}`); remove `blankAgentItem()` / `blankAgentPaletteItem()` fallback; adapter agents exclude default-agent origin; reload catalog when `features().palette` changes
- [x] Update `ui-chrome-gates.spec.ts` (and any catalog mocks) to include `emptyRemote: false`

### Step 6 — Sidebar / catalog UI tests
- [x] Add or extend a left-sidebar (or shell) spec: empty-remote testid, no logic-shape/default cards; error banner without mock labels; allow-list hides a featured type; default-agent cards for tagged items

### Step 7 — Docs + examples
- [x] Update `docs/workflow-builder-ui-embed.md` — `palette.*`, `catalog` provider-only, empty vs error
- [x] Update `docs/workflow-builder-ui-config-try.md` — palette example try steps
- [x] Add `src/assets/examples/wb-ui-config.palette-host.json` (allow-list + `defaultAgents`; no secrets)
- [x] Keep `src/assets/wb-ui-config.json` as `{}`
- [x] Short README pointer if missing

### Step 8 — Regression
- [x] `npm test` — all green
- [x] `npm run build` — success (budget warnings OK)

### Step 9 — Construction code summaries
- [x] `aidlc-docs/construction/u-pal-02-catalog-wiring/code/business-logic-summary.md`
- [x] `frontend-components-summary.md`
- [x] `code-generation-summary.md`
- [x] SKIP stubs: api / repository / deployment
