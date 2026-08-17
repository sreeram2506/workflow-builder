# U-HUI-01 Code Generation Plan — Host UI chrome inputs (`[ui]`)

**Status**: APPROVED — PART 2 EXECUTED  
**Unit**: `u-hui-01-host-ui-inputs`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-HUI-01, US-HUI-02, US-HUI-03, US-HUI-04  
**Design**: `aidlc-docs/construction/u-hui-01-host-ui-inputs/functional-design/`  
**FD locks**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A · Q9=A  

This plan is the single source of truth for Code Generation. Part 2 executed.

**N/A**: API / repository / DB / deployment artifacts (client SPA). NFR Requirements/Design and Infrastructure Design skipped.

---

## Unit context

| Item | Value |
|---|---|
| Depends on | U-UI-01 merge/`UiConfigService`; U-UI-02 chrome gates |
| Pattern | Shell-local `effectiveFeatures`; `UI_EFFECTIVE_FEATURES` reader; no global write |
| Naming | Shells today use `readonly ui = inject(UiConfigService)` — **rename to `uiConfig`** so `ui = input<UiFeaturesPartial \| undefined>()` can own the host API name |
| Out of scope | Changing JSON/provider bootstrap; palette inputs; mutating `loadStatus` per instance |

---

## Story coverage

| Story | Steps |
|---|---|
| US-HUI-01 Bind + precedence + isolation | 1–5, 7 |
| US-HUI-02 Omit / `{}` | 2–3, 7 |
| US-HUI-03 Reactive updates | 2–5, 7 |
| US-HUI-04 Both shells + docs | 3, 6, 7 |

---

## Generation Steps

### Step 1 — Effective reader + token + exports (US-HUI-01, Q1=A)

- [x] Create `src/app/core/ui-config/ui-effective.token.ts` — `EffectiveUiReader` interface `{ features(): UiFeatures; is(path: UiFeaturePath \| string): boolean }`; `UI_EFFECTIVE_FEATURES = new InjectionToken<EffectiveUiReader>(...)`
- [x] Create `src/app/core/ui-config/effective-ui-reader.ts` — `createEffectiveUiReader(features: Signal<UiFeatures> | (() => UiFeatures)): EffectiveUiReader` using `buildPathIndex` + fail-open `is` (same as `UiConfigService`)
- [x] Export token, reader type, and factory from `src/app/core/ui-config/index.ts`
- [x] Unit test: reader `is` unknown path → `true`; known path follows features signal updates

### Step 2 — Instance merge helper + PBT (NFR-HUI-01, Q3=A, Q9=A)

- [x] Add `mergeInstanceUiFeatures(global: UiFeatures, uiInput: UiFeaturesPartial \| undefined): UiFeatures` in `merge-ui-features.ts` (or thin wrapper): `mergeUiFeatures(global, normalizePartial(uiInput ?? {}))` — does not mutate `global`
- [x] Extend / add PBT: arbitrary base + partial → leaf equals partial when defined else base; deep clone base before merge equals base after
- [x] Example: `themeToggle` / `theme.toggle` alias on instance partial (Q8=A)
- [x] Example: `{}` and `undefined` leave base unchanged

### Step 3 — ShellLayout + AgentSkillsShell (US-HUI-01..04, Q2=A, Q5=A, Q6=A, Q7=A)

- [x] Modify `shell-layout.component.ts`:
  - Rename `ui` inject → `uiConfig`
  - Add `ui = input<UiFeaturesPartial | undefined>()` (no default)
  - `effectiveFeatures = computed(() => mergeInstanceUiFeatures(this.uiConfig.features(), this.ui()))`
  - Local `is(path)` via `createEffectiveUiReader` over effective (or inline)
  - `providers: [{ provide: UI_EFFECTIVE_FEATURES, useFactory: … }]` reading shell effective
  - Region `@if` / chrome inset effect use **effective** features, not bootstrap-only
  - Banner still uses `uiConfig.loadStatus()` (Q6=A)
- [x] Modify `agent-skills-shell.component.ts` — same pattern (independent token scope; no inherit from parent)
- [x] Templates: replace `ui.is(...)` / `ui.features()` with effective reader / `effectiveFeatures` as appropriate; keep `uiConfig.loadStatus()` for banner

### Step 4 — Token consumers with fallback (US-HUI-01, Q4=A)

- [x] Helper pattern (shared or per file): `inject(UI_EFFECTIVE_FEATURES, { optional: true }) ?? uiConfigServiceAsReader` where service already matches `EffectiveUiReader` shape (`features` + `is`) — prefer injecting service as fallback without wrapping if compatible
- [x] Modify `top-bar.component.ts` — use effective reader for action gates
- [x] Modify `chrome-shortcuts.directive.ts` — Save gate via effective
- [x] Modify `zoom-controls.component.ts` — canvas/topBar action flags via effective
- [x] Modify `canvas-viewport.component.ts` — overlay flags via effective
- [x] Do **not** change catalog/left-sidebar palette allow-list to require the token unless already under shell (left-sidebar may keep `UiConfigService` for palette JSON — out of chrome overlay scope unless it already gates chrome)

### Step 5 — Frontend / isolation tests

- [x] Extend `ui-chrome-gates.spec.ts` (and/or new `host-ui-inputs.spec.ts`):
  - Omit `[ui]` → same as provider/JSON-only
  - `[ui]="{}"` → no leaf forced off
  - Partial overrides global (e.g. provider hides library; `[ui]` shows it)
  - Two component fixtures with different `[ui]` — isolation; `UiConfigService.features()` unchanged by overlays
  - Change `[ui]` reactively → region appears/disappears
  - Agent shell: `[ui]` hides `skillsLibrary`
- [x] Ensure existing defaults-all-on suites still green

### Step 6 — Docs (US-HUI-04, FR-HUI-07)

- [x] Update `docs/workflow-builder-ui-embed.md` — precedence becomes defaults → JSON → provider → **`[ui]`**; document omit / `{}` / partial; both shells; example template with `[ui]` alongside `[palettes]` / `[defaultAgents]`; note instance does not mutate global service
- [x] Update `README.md` pointer if needed

### Step 7 — Regression

- [x] `npm test` — all green
- [x] `npm run build` — success (budget warnings OK)

### Step 8 — Construction code summaries

- [x] `aidlc-docs/construction/u-hui-01-host-ui-inputs/code/business-logic-summary.md`
- [x] `frontend-components-summary.md`
- [x] `code-generation-summary.md`
- [x] SKIP stubs: `api-layer-summary.md`, `repository-layer-summary.md`, `deployment-artifacts-summary.md`

---

## Explicitly not in this unit

- `UiConfigService.setInstanceOverlay` / global write APIs
- Changing APP_INITIALIZER / JSON URL
- New Angular library / package boundary
- Per-instance `loadStatus`
- Requiring token on non-shell-hosted leaves (fallback keeps tests working)

---

## Approval

Approve this plan to run Part 2 in order.
