# U6 NFR Design Plan — Smart Routing & Auto-Layout

**Unit**: `u6-routing-layout`  
**Stories**: US-E7, US-E7.1, US-E8, US-E8.1  
**Status**: GENERATION COMPLETE — AWAITING APPROVAL  

**Inputs:** FD (medium route; V/H/Layered; Layout ▾ + Route; replace waypoints; layout auto-routes) · NFR Requirements (qualitative sync; layout PBT; fail-soft + status string; fit after layout; no new libs)

### Locked answers
| # | Answer |
|---|---|
| Q1 | A — `canvasStatus` on UiStore (non-error) |
| Q2 | A — compute-then single batch commit |
| Q3 | B — env-tunable grid size / obstacle padding |
| Q4 | A — extend ZoomControlsComponent |
| Q5 | A — `viewport.math.fitToContent` + facade |
| Q6 | B — static inline SVG icons OK; no user HTML |
| Q7 | A — SKIP Infrastructure Design |

---

## Part A — Clarifying Questions (answered)

### Question 1 — Resilience: where does the fallback status string live?

A) Reuse / extend existing shell status or `canvasError`-adjacent **non-error** status signal on UiStore (e.g. `canvasStatus`)

B) Dedicated `routingStatus` signal on UiStore, cleared on next Route/Layout or after a short timeout

C) Only use `canvasError` for throws; **skip** the user-visible fallback string in code (contradicts NFR Q6=B — avoid unless overriding)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 2 — Performance: how are graph mutations applied?

A) **Single batch** — compute all positions + all edge waypoints in pure helpers, then one GraphStore write (or two: nodes then edges) per Layout/Route

B) Per-edge / per-node incremental store updates during the sync loop

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 3 — Scalability: routing grid defaults

A) Fixed constants in domain module (e.g. cell size aligned to **16px** snap; padding around node AABB) — document in code; no UI

B) Tunable via environment flags for experiments

X) Other (please describe after [Answer]: tag below)

[Answer]:B

---

### Question 4 — Logical components: UI home for Layout / Route

A) Extend **ZoomControlsComponent** (or existing canvas chrome cluster) with Layout ▾ + Route edges

B) Add controls to **TopBarComponent** only

C) New small `LayoutRouteControlsComponent` composed into canvas host

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 5 — Fit-to-content helper placement

A) Pure helper in `viewport.math.ts` + `facade.fitToContent(viewW, viewH)` called after layout

B) Fit logic only inside facade (no new exported viewport helper)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 6 — Security hygiene confirmation

A) Confirm text-only labels/aria for Layout/Route; no `innerHTML`; no new packages

B) Allow SVG icons with static inline templates only (still no user HTML)

X) Other (please describe after [Answer]: tag below)

[Answer]:B

---

### Question 7 — Infrastructure Design for U6

A) **SKIP** Infrastructure Design (in-browser only; no cloud/queues/caches)

B) Run Infrastructure Design anyway (describe why after Answer)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Part B — Generation Checklist (after answers)

### Planning
- [x] All questions answered
- [x] Ambiguities resolved

### Artifacts
- [x] `nfr-design-patterns.md`
- [x] `logical-components.md`

### Steps
- [x] Step 1: Performance patterns (sync batch mutate)
- [x] Step 2: Resilience patterns (fallback + status + canvasError)
- [x] Step 3: Scalability / grid constants
- [x] Step 4: Logical component map + dependency diagram
- [x] Step 5: Security hygiene + testing alignment
- [x] Step 6: Confirm Infrastructure Design SKIP/run

---

## Approval
Awaiting user: **Request Changes** or **Continue to Next Stage** (Infrastructure Design — will SKIP per Q7=A, then Code Generation planning).
