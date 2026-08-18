# U-AE-01 Code Generation Plan — Enter agent without tab bar

**Status**: GENERATION COMPLETE — awaiting code review  
**Unit**: `u-ae-01-enter-agent-without-tabs`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-AE-01, US-AE-02, US-AE-03, US-AE-04  
**Design**: Functional Design SKIP — follow RA + unit-of-work  
**UOW**: `aidlc-docs/inception/application-design/agent-enter-without-tabs-unit-of-work.md`  

This plan is the single source of truth for Code Generation. Do not run Part 2 until approved.

**N/A**: API / repository / DB / deployment artifacts (client SPA). NFR Requirements/Design and Infrastructure Design skipped.

**Effective flag**: `WorkflowFacade` is `providedIn: 'root'` and cannot see instance `[ui]` via `injectEffectiveUi`. Shells already merge instance overlay. Publish `agentTabs.enabled` to UiStore (same idea as `chromeInsetTop`) so chip gating matches the strip the user sees.

---

## Unit context

| Item | Value |
|---|---|
| Depends on | Nested `/agent/:id`, `selectAgentTab`, `navigateBackToSolution`, chrome `agentTabs.enabled` |
| Pattern | Gate **chip add** when bar off; keep **navigate** on dblclick/chip; nested Back when strip not mounted |
| Out of scope | Single-click enter; browser-only back; live hidden chips; palettes/Properties/logic edges; commit `src/app/try/` |

---

## Story coverage

| Story | Steps |
|---|---|
| US-AE-01 Dblclick enter; no hidden chips | 1–3, 6–7 |
| US-AE-02 Chips when bar on | 2, 6–7 |
| US-AE-03 Nested Back; no re-enter; View | 3–5, 7 |
| US-AE-04 Embed docs | 8 |

---

## Generation Steps

### Step 1 — Publish effective `agentTabs.enabled` (FR-AE-05, FR-AE-07)

- [x] Modify `src/app/core/stores/ui.store.ts` — session signal `agentTabsChromeEnabled` default `true`; setter; reset to `true`
- [x] Modify `src/app/core/facade/workflow.facade.ts` — expose signal + `setAgentTabsChromeEnabled`
- [x] Modify `src/app/features/shell/shell-layout.component.ts` — existing overlay effect also publishes `features.agentTabs.enabled`
- [x] Modify `src/app/features/agent/agent-skills-shell.component.ts` — same publish

### Step 2 — Gate chip add only (FR-AE-05, US-AE-01)

- [x] Modify `workflow.facade.ts` `openAgentTab`: if `!agentTabsChromeEnabled()`, return after findSolutionAgent (still may select/focus node as today when tabs on; when bar off **do not** mutate `agentTabs`)
- [x] `selectAgentTab`: still navigate to `/agent/:id` even when `openAgentTab` skipped
- [x] `enterAgentCanvas` / `ensureAgentRoute`: still load nested canvas when chips skipped; invalid id still redirects home (Security/Resiliency fail-safe)
- [x] `createNode` / `createNodeFromPaletteItem`: `openAgentTab` no-ops when bar off (no chips on drop/select)
- [x] Modify `workflow.facade.spec.ts`:
  - bar off: `openAgentTab` / create AIAgent does not add chips
  - bar off: `selectAgentTab` still `navigate(['/agent', id])`
  - bar on: existing chip tests still pass
  - missing agent route still redirects (keep existing fail-safe coverage)

### Step 3 — Canvas enter / no re-enter (FR-AE-01, FR-AE-03, FR-AE-06)

- [x] Confirm `canvas-viewport.component.ts`: solution dblclick still `selectAgentTab`; nested `editingAgentNodeId` still returns; no change unless a test requires it
- [x] View mode: do not add a new gate on dblclick (FR-AE-06). Nested edit blocks stay as they are
- [x] Extend canvas or facade specs if dblclick/view is not already covered

### Step 4 — Nested Back / Solution when strip not mounted (FR-AE-04, US-AE-03)

- [x] Modify `agent-skills-shell.component.ts`:
  - Show header overlay when top bar **or** tab strip **or** nested Back is needed
  - Nested Back/Solution control when `!effectiveUi.is('agentTabs.enabled')`
  - Control calls `navigateBackToSolution(editingAgentNodeId)` — must **not** require `agentTabs().length > 0`
  - `data-testid="nested-back-to-solution"`
  - When tabs on, do **not** add a second Back (Solution chip on the strip stays)
- [x] `shell-layout.component.ts`: solution canvas only — no nested Back (nested route uses agent-skills-shell)
- [x] Keep `wb-agent-tabs` unchanged when bar on (US-AE-02)

### Step 5 — Nested Back tests (US-AE-03)

- [x] Add or extend a shell spec (agent-skills-shell or chrome gates): bar off + editing agent shows nested Back; click calls `navigateBackToSolution`; bar on does not show nested Back (strip present)

### Step 6 — Chrome gates regression (US-AE-02, FR-AE-07)

- [x] `agentTabs.enabled` still hides `wb-agent-tabs` / strip
- [x] Other chrome flags unchanged
- [x] Extend `ui-chrome-gates.spec.ts` if needed

### Step 7 — (reserved) N/A API / repository / DB

- [x] N/A — skip API/repository/DB (client SPA)

### Step 8 — Docs (US-AE-04, FR-AE-08)

- [x] Modify `docs/workflow-builder-ui-embed.md` — `agentTabs.enabled` hides the tab **strip** only; it does **not** block `/agent/:id`. Double-click on solution AIAgent still enters. Nested Back/Solution shows when the strip is not mounted. No secrets in examples
- [x] Do **not** commit `src/app/try/` (local harness already uses `[ui].agentTabs.enabled: false`)

### Step 9 — Regression

- [x] `npm test` — all green
- [x] `npm run build` — success (budget warnings OK)

### Step 10 — Construction code summaries

- [x] `aidlc-docs/construction/u-ae-01-enter-agent-without-tabs/code/business-logic-summary.md`
- [x] `frontend-components-summary.md`
- [x] `code-generation-summary.md`
- [x] SKIP stubs: `api-layer-summary.md`, `repository-layer-summary.md`, `deployment-artifacts-summary.md`

---

## Extension compliance (this unit)

| Extension | Status | Notes |
|---|---|---|
| Security Baseline | Enforce in Steps 2, 8 | Invalid `/agent/:id` still redirects; no new secrets/tokens in docs or code |
| Other SECURITY | N/A | No new stores/auth/HTTP |
| Resiliency Baseline | Enforce in Step 2 | Missing agent fail-safe unchanged; DR N/A (SPA) |
| PBT Partial | N/A | No new pure transform; example tests for chrome gating (Step 2) |

---

## Explicitly not in this unit

- Single-click navigate
- Browser-only back
- Accumulating hidden chips while the bar is off
- New `core/agent-nav/` folder
- Properties schema, `[palettes]`, Condition edges, Router connectors
- Changing other chrome flags
- Committing `src/app/try/` or a permanent `try-ui` route

---

## Approval

Approve this plan to run Part 2 in order.
