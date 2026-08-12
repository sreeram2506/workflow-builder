# U8 Code Generation Plan — Simulated Run & View Mode

**Status**: APPROVED — Part 2 COMPLETE  
**Unit**: `u8-run-view-mode`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-10.1, US-VM.1, US-VM.2, US-VM.3, US-6.2  
**FR**: FR-15 (Simulated Run), FR-13 (View Mode)  

### Locked inputs
| Area | Decision |
|---|---|
| Walk | BFS from Trigger ∪ indegree-0; visit once; no branch eval |
| Timing | Sequential `running` → `success`; default **400 ms**/step |
| Reduced motion | `prefers-reduced-motion: reduce` → **0–50 ms** |
| Env | Optional `environment.runStepDelayMs` (default 400); reduced-motion still wins |
| Pipeline | Injectable `RunSimulationService` + RxJS `takeUntil` stopper |
| State | UiStore `runActive` + `runAnnouncement`; GraphStore `patchNodeStatuses(..., skipHistory)` |
| After run | Leave statuses; **Reset**; new Run resets idle first |
| Concurrent | Run disabled while active; **Stop** cancels (leave statuses) |
| View + Run | Run allowed in view; mode switch → Stop |
| A11y | TopBar polite `aria-live`; static SVG icons OK |
| Soft fails | Empty → “Nothing to run”; no seeds → “No start node”; throws → `canvasError` |
| Stack | **No new npm packages** |
| Infra | SKIP |
| Non-goals | Backend engine; branch debugger; run log panel; toast library |

**Code location**: Workspace root `src/` (never under `aidlc-docs/`)

---

## Generation Steps

### Step 1 — Domain: run-order helpers
- [x] Add `src/app/core/domain/run-order.ts`: `findRunSeeds`, `computeRunOrder` (BFS; each node once)
- [x] Pure functions only; document Trigger-type + indegree-0 seed rule

### Step 2 — Environment + stores + RunSimulationService
- [x] Add `runStepDelayMs: 400` to `environment.ts` (+ production mirror if present)
- [x] UiStore: `runActive`, `runAnnouncement` (+ setters/clear)
- [x] GraphStore: `patchNodeStatuses(updates, { skipHistory?: boolean })` — must **not** push history when skip
- [x] `RunSimulationService` in `core/run/`: resolve delay; start pipeline; `stop()` via stopper Subject; update statuses + announcements; clear `runActive` on end/stop/error

### Step 3 — Facade APIs + view lock completeness
- [x] `WorkflowFacade`: `startRun`, `stopRun`, `resetStatuses`, `setEditorMode` (mode switch → stop)
- [x] Guards: empty / no-seed → `canvasStatus`; `runActive` → no-op start; throws → `canvasError` + clear active
- [x] Expose `runActive` / `runAnnouncement` on facade
- [x] Audit view locks: palette add, canvas mutate, Properties save, Import, mutating shortcuts — no-op/disabled in view; allow pan/zoom/minimap/selection/theme/Export/Save-download/Run/Reset

### Step 4 — Unit tests (+ Partial PBT)
- [x] `fast-check`: BFS order ⊆ node ids; non-seeds have predecessor earlier in prefix
- [x] Example: Start → Stop clears `runActive`; Reset → all idle; view mode blocks mutate while Run still callable
- [x] Example: empty / no-seed set soft `canvasStatus` (no throw)

### Step 5 — Business logic summary
- [x] `aidlc-docs/construction/u8-run-view-mode/code/business-logic-summary.md`

### Step 6 — Frontend: TopBar Run / Stop / Reset / view toggle
- [x] Enable Run; show Stop when `runActive`; add Reset statuses
- [x] Enable view/edit toggle + clear **View** indicator
- [x] Polite `aria-live` region bound to `runAnnouncement`
- [x] Accessible names; static inline SVG icons OK; no `innerHTML`

### Step 7 — Frontend summary
- [x] `aidlc-docs/construction/u8-run-view-mode/code/frontend-components-summary.md`

### Step 8 — API layer
- [x] SKIP documented (`api-layer-SKIP.md`) — no backend

### Step 9 — Docs
- [x] README note for Phase 10 + View Mode
- [x] `aidlc-docs/construction/u8-run-view-mode/code/code-generation-summary.md`

### Step 10 — Deployment artifacts
- [x] SKIP documented (`deployment-SKIP.md`)

### Step 11 — Verify
- [x] `npm test` + `npm run build` pass (66 tests; ~468 kB main)
- [x] Confirm no new npm deps; Run/Stop/Reset + view toggle work; status patches skip history

---

## Story coverage
| Story | Steps |
|---|---|
| US-10.1 Simulated Run | 1–4, 6 |
| US-VM.1 View/edit toggle | 3, 6 |
| US-VM.2 Lock mutating | 3, 6 |
| US-VM.3 Inspect in view | Existing + 3 audit |
| US-6.2 Readonly Properties in view | Existing + 3 audit |

## Approval
Part 2 generation complete — awaiting stage approval: **Request Changes** or **Continue to Next Stage** (Build and Test).
