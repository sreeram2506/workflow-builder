# U-UI-01 Code Generation Plan — Config Core

**Status**: APPROVED — Part 2 COMPLETE  
**Unit**: `u-ui-01-config-core`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-UI-01, US-UI-07  
**Design**: `aidlc-docs/construction/u-ui-01-config-core/functional-design/`  
**FD locks**: Q1=C · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A · Q9=A  

**N/A for this unit**: API layer, Repository layer, Database migrations, Deployment artifacts (client config only).

---

## Unit context

| Item | Value |
|---|---|
| Responsibility | Types, merge/normalize, token, provider, UiConfigService, APP_INITIALIZER, tests/PBT |
| Depends on | Angular DI, HttpClient |
| Out of scope | Chrome `@if` gates, shortcut wiring, embed docs, load-status banner |
| Code root | `src/app/core/ui-config/` + `app.config.ts` + `src/assets/wb-ui-config.json` |

---

## Story coverage

| Story | Steps |
|---|---|
| US-UI-01 Provide + merge + soft-fail | Steps 1–5, 7 |
| US-UI-07 Defaults all-on | Steps 1–2, 7 |

---

## Generation Steps

### Step 1 — Domain types
- [x] Create `src/app/core/ui-config/ui-features.types.ts` — `UiFeatures`, nested groups, `UiFeaturePath`, `UiConfigLoadStatus`, `UiFeaturesPartial` (+ optional `themeToggle`)
- [x] Export path list / helpers needed by index builder

### Step 2 — Business logic: merge + normalize
- [x] Create `src/app/core/ui-config/merge-ui-features.ts` — `createDefaultUiFeatures`, `normalizePartial`, `mergeUiFeatures`, `applyThemeAlias`, `buildPathIndex`, `resolveUiFeatures(layers)`
- [x] Create `src/app/core/ui-config/merge-ui-features.spec.ts` — table-driven unit tests (BR-01..08, BR-11 unit cases)
- [x] Create `src/app/core/ui-config/merge-ui-features.pbt.spec.ts` — fast-check invariants (BR-11)

### Step 3 — DI token + provider
- [x] Create `src/app/core/ui-config/ui-config.token.ts` — InjectionToken for host partial
- [x] Create `src/app/core/ui-config/provide-workflow-builder-ui.ts` — `provideWorkflowBuilderUi({ features?: ... })`
- [x] Create `src/app/core/ui-config/index.ts` — public barrel exports

### Step 4 — Service + initializer
- [x] Create `src/app/core/ui-config/ui-config.service.ts` — signals `features`, `loadStatus`; methods `is(path)`, internal `setResolved` / apply layers
- [x] Create `src/app/core/ui-config/ui-config.initializer.ts` — APP_INITIALIZER factory: GET `/assets/wb-ui-config.json`, soft-fail, then merge provider token
- [x] Create `src/app/core/ui-config/ui-config.service.spec.ts` — defaults, 404/invalid/ok HTTP, provider wins

### Step 5 — Bootstrap wiring + asset stub
- [x] Modify `src/app/app.config.ts` — register initializer providers
- [x] Create `src/assets/wb-ui-config.json` — `{}` stub; `angular.json` maps `src/assets` → `/assets`

### Step 6 — Regression sanity
- [x] Run suite — **148 passed**; build OK
- [x] Confirm no chrome behavior change when config is `{}` / all defaults

### Step 7 — Construction code summaries
- [x] Write `aidlc-docs/construction/u-ui-01-config-core/code/business-logic-summary.md`
- [x] Write `aidlc-docs/construction/u-ui-01-config-core/code/frontend-components-summary.md`
- [x] Write `aidlc-docs/construction/u-ui-01-config-core/code/code-generation-summary.md`
- [x] Write SKIP stubs: `api-layer-summary.md`, `repository-layer-summary.md`, `deployment-artifacts-summary.md` (N/A)
