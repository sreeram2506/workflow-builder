# U8 NFR Design Plan — Simulated Run & View Mode

**Unit**: `u8-run-view-mode`  
**Stories**: US-10.1, US-VM.1–3, US-6.2  
**Status**: GENERATION COMPLETE — AWAITING APPROVAL  

**Inputs:** FD (BFS walk; 400 ms/step; Stop/Reset; Run in view; mode-switch = Stop; status skipHistory) · NFR (RxJS delay pipeline; aria-live; reduced-motion ≤50 ms; soft empty/no-seed; canvasError on throws; no new libs; BFS order PBT)

### Locked answers
| # | Answer |
|---|---|
| Q1 | A — injectable `RunSimulationService` |
| Q2 | B — reduced-motion + optional `environment.runStepDelayMs` |
| Q3 | A — service stopper + `takeUntil` |
| Q4 | A — `runActive` / `runAnnouncement` on UiStore |
| Q5 | A — batch `patchNodeStatuses(..., skipHistory)` |
| Q6 | A — polite `aria-live` in TopBar |
| Q7 | B — text + static inline SVG icons OK |
| Q8 | A — SKIP Infrastructure Design |

---

## Part A — Clarifying Questions (answered)

### Question 1 — Logical components: where does RunSimulation live?

A) Injectable `RunSimulationService` in `core/` (or `core/run/`) owning RxJS pipeline + `takeUntil` stop; facade exposes `startRun` / `stopRun` / `resetStatuses`

B) Pipeline lives only inside `WorkflowFacade` (no separate service)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 2 — Performance: how is step delay resolved?

A) Service reads `matchMedia('(prefers-reduced-motion: reduce)')` once at Run start → **0–50 ms** if reduced, else **400 ms**; no env knobs

B) Same as A, plus optional `environment.runStepDelayMs` override for experiments (default 400)

X) Other (please describe after [Answer]: tag below)

[Answer]:B

---

### Question 3 — Resilience: Stop / cancel ownership

A) `RunSimulationService` holds a `Subject`/`Abort`-style stopper; Stop and mode-switch call `stop()` → `takeUntil` tears down timers; clears `runActive`; leaves statuses

B) Facade-only `Subscription` handle; service is fire-and-forget per step without shared stopper

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 4 — Scalability / state: where does `runActive` live?

A) `UiStore` signal `runActive` (+ optional `runAnnouncement` for aria-live text); facade wraps setters

B) Private signals only on `RunSimulationService`; TopBar reads service directly

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 5 — Performance / history: status patch API

A) GraphStore `patchNodeStatuses(map, { skipHistory: true })` (batch) used by simulation steps + Reset

B) Per-node `setNodeStatus(id, status, { skipHistory: true })` only (no batch API)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 6 — Usability: where does `aria-live` region live?

A) Polite live region in **TopBar** (or shell chrome next to Run controls); bound to announcement signal

B) Live region in **CanvasHost** status area (alongside `canvasStatus`)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 7 — Security hygiene confirmation

A) Text-only announcements / labels; no `innerHTML`; no network; no new packages

B) Same as A, plus allow static inline SVG icons for Run/Stop/View in templates

X) Other (please describe after [Answer]: tag below)

[Answer]:B

---

### Question 8 — Infrastructure Design for U8

A) **SKIP** Infrastructure Design (frontend-only; no cloud/deploy/storage changes) — recommended

B) Run Infrastructure Design anyway (document N/A categories only)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Part B — Generation Checklist

### Planning
- [x] All questions answered
- [x] Ambiguities resolved

### Artifacts
- [x] `nfr-design-patterns.md`
- [x] `logical-components.md`

### Steps
- [x] Step 1: Performance patterns (RxJS delay, reduced-motion, skipHistory)
- [x] Step 2: Resilience patterns (Stop takeUntil, soft empty/no-seed, canvasError)
- [x] Step 3: Scalability (`runActive` single-flight)
- [x] Step 4: Logical component map + dependency diagram
- [x] Step 5: Security / a11y hygiene + PBT alignment
- [x] Step 6: Confirm Infrastructure Design SKIP/run

---

## Approval
Awaiting user: **Request Changes** or **Continue to Next Stage** (Infrastructure Design — will SKIP per Q8=A, then Code Generation plan).
