# U-DC-01 Code Generation Plan — Agent tabs doubleClick config

**Status**: GENERATION COMPLETE — awaiting code review  
**Unit**: `u-dc-01-agent-tabs-doubleclick-config`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-DC-01, US-DC-02, US-DC-03, US-DC-04, US-DC-05  
**Design**: Functional Design SKIP — follow RA + unit-of-work  
**UOW**: `aidlc-docs/inception/application-design/agent-tabs-doubleclick-config-unit-of-work.md`  

This plan is the single source of truth for Code Generation. Do not run Part 2 until approved.

**N/A**: API / repository / DB / deployment artifacts (client SPA). NFR Requirements/Design and Infrastructure Design skipped. No new `data-testid` (no new chrome control).

**Gate location**: `canvas-viewport.onNodeDblClick` via `this.ui.is('agentTabs.doubleClick')`. Canvas already `injectEffectiveUi()` so instance `[ui]` is visible. **Do not** gate `WorkflowFacade.selectAgentTab` (that would block chip click). Nested `editingAgentNodeId` early-return stays first.

---

## Unit context

| Item | Value |
|---|---|
| Depends on | UI merge, `injectEffectiveUi`, U-AE-01 nested no-re-enter, `selectAgentTab` |
| Pattern | New boolean leaf default true; canvas dblclick only |
| Out of scope | Chip dblclick; new enter paths; nested Back; commit `src/app/try/`; npm publish |

---

## Story coverage

| Story | Steps |
|---|---|
| US-DC-01 Default / omit still enters | 1–2, 4, 6 |
| US-DC-02 Flag false blocks canvas dblclick | 3–4, 6 |
| US-DC-03 Independent of strip; both false | 1, 3–4 |
| US-DC-04 Chip click still enters; nested no re-enter | 3–4 |
| US-DC-05 Embed/JSON docs | 5 |

---

## Generation Steps

### Step 1 — Feature leaf (FR-DC-01, FR-DC-02, US-DC-01)

- [x] Modify `src/app/core/ui-config/ui-features.types.ts`
  - `AgentTabsFeatures.doubleClick: boolean`
  - Add `'agentTabs.doubleClick'` to `UI_FEATURE_PATHS`
- [x] Modify `src/app/core/ui-config/merge-ui-features.ts`
  - `createDefaultUiFeatures`: `agentTabs: { enabled: true, doubleClick: true }`
  - `pickBooleanLeaves(raw['agentTabs'], ['enabled', 'doubleClick'])`
  - `buildPathIndex`: `map.set('agentTabs.doubleClick', features.agentTabs.doubleClick)`
- [x] Modify `src/app/core/ui-config/merge-ui-features.spec.ts`
  - Default `doubleClick` is true
  - Explicit `false` wins
  - Independent of `enabled` (enabled false + doubleClick true; both false)
  - Absent key after merge stays true
- [x] Modify `src/app/core/ui-config/merge-ui-features.pbt.spec.ts` (PBT Partial)
  - Include `agentTabs.doubleClick` in `partialArb` (optional boolean)
  - Property: omit key → merged `doubleClick` true; `{ doubleClick: false }` → false
- [x] No secrets in tests

### Step 2 — JSON examples (FR-DC-08)

- [x] `src/assets/examples/wb-ui-config.all-on.json` — `"doubleClick": true` under `agentTabs`
- [x] `src/assets/examples/wb-ui-config.all-off.json` — `"doubleClick": false`
- [x] `src/assets/examples/wb-ui-config.minimal-canvas.json` — add `"doubleClick": true` next to existing `enabled` (omit would also default true; keep explicit)
- [x] Do not change `src/assets/wb-ui-config.json` committed `{}` (omit = default true)
- [x] Do not add secrets

### Step 3 — Canvas gate (FR-DC-03, FR-DC-04, FR-DC-06, FR-DC-07, US-DC-02..04)

- [x] Modify `src/app/features/canvas/canvas-viewport.component.ts` `onNodeDblClick`:
  1. Keep nested early-return when `editingAgentNodeId()` is set (FR-DC-06)
  2. Keep AIAgent type check
  3. If `!this.ui.is('agentTabs.doubleClick')`, return (no `selectAgentTab`)
  4. Else `selectAgentTab` as today
- [x] Do not change chip click / `selectAgentTab` / nested Back
- [x] Do not change pointer-capture delay (U-AE-01 follow-up)

### Step 4 — Canvas / chrome tests (US-DC-02..04)

- [x] Add `src/app/features/canvas/canvas-viewport.agent-dblclick.spec.ts`
  - TestBed: `CanvasViewportComponent` + `WorkflowFacade` + router/http as needed
  - Create an AIAgent on the solution canvas
  - Spy `selectAgentTab` (or router `navigate`)
  - `doubleClick` true (default): `onNodeDblClick` calls `selectAgentTab`
  - `doubleClick` false via `UiConfigService.applyLayers` or `UI_EFFECTIVE_FEATURES`: does **not** call `selectAgentTab`
  - Nested (`editingAgentNodeId` set): still does not re-enter even if `doubleClick` true
  - View mode + `doubleClick` false: does not navigate
- [x] Confirm `workflow.facade.spec.ts` chip/`selectAgentTab` tests still pass (US-DC-04)
- [x] Extend `ui-chrome-gates.spec.ts` only if a strip-vs-dblclick assertion is cheap; do not hide strip based on `doubleClick`

### Step 5 — Embed docs (US-DC-05, FR-DC-08)

- [x] Modify `docs/workflow-builder-ui-embed.md`
  - Flag table: `agentTabs.doubleClick` — canvas Blank Agent / AIAgent dblclick enter; default true; independent of `agentTabs.enabled`
  - Nested enter section: parent example `agentTabs: { enabled: false, doubleClick: true }`
  - Both false: no nested enter from builder chrome; chip click still works when strip on
  - Keep host `/agent/:nodeId` requirement
  - No secrets
- [x] Modify `docs/workflow-builder-ui-config-try.md` — mention `agentTabs.doubleClick` next to `agentTabs.enabled`
- [x] Do **not** commit `src/app/try/`

### Step 6 — N/A layers

- [x] N/A — skip API / repository / DB / deployment artifacts

### Step 7 — Regression

- [x] `npm test` — all green
- [x] `npm run build` — success (budget warnings OK)

### Step 8 — Construction code summaries

- [x] `aidlc-docs/construction/u-dc-01-agent-tabs-doubleclick-config/code/business-logic-summary.md`
- [x] `frontend-components-summary.md`
- [x] `code-generation-summary.md`
- [x] SKIP stubs: `api-layer-summary.md`, `repository-layer-summary.md`, `deployment-artifacts-summary.md`

---

## Extension compliance (this unit)

| Extension | Status | Notes |
|---|---|---|
| SECURITY-05 / 07 / 11 / 15 | Enforce in Steps 1, 2, 5 | Boolean normalize; no secrets in JSON/docs |
| Other SECURITY | N/A | No new stores/auth/HTTP |
| Resiliency | N/A | DR/HA not this increment |
| PBT Partial | Enforce in Step 1 | Merge invariant for the new leaf |

---

## Explicitly not in this unit

- Gating `selectAgentTab` / chip enter
- Chip double-click gesture
- New nested Back behavior
- New helper module under `core/`
- Publishing `enso-workflow-builder`
- Committing `src/app/try/`

---

## Approval

Part 2 executed. Awaiting code review.
