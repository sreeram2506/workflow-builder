# U6 NFR Requirements Plan — Smart Routing & Auto-Layout

**Unit**: `u6-routing-layout`  
**Stories**: US-E7, US-E7.1, US-E8, US-E8.1  
**Status**: GENERATION COMPLETE — AWAITING APPROVAL  

**Carry-forward (locked from U1–U5 + Functional Design)**
- Frontend-only SPA; ≤100 nodes responsiveness ceiling
- Angular 20 standalone + signals; Vitest + fast-check (Partial PBT)
- Security Baseline OFF; Resiliency ON (DR N/A); no new layout/routing npm deps (FD Q4=A / BR-U6-09)
- Routing: medium grid/A*; explicit Route + after layout; replace waypoints
- Layout: hand-rolled Vertical / Horizontal / Layered

### Locked answers
| # | Answer |
|---|---|
| Q1 | A — qualitative performance |
| Q2 | A — synchronous one-shot |
| Q3 | A — baseline a11y |
| Q4 | A — layout invariants PBT + route fallback examples |
| Q5 | A — no new libraries |
| Q6 | B — fail soft + fallback status string |
| Q7 | B — fit-to-content once after layout |

---

## Part A — Clarifying Questions (answered)

### Question 1 — Performance expectation for Layout / Route

A) **Qualitative only** — Layout + Route should feel snappy on a mid-range laptop for ≤100 nodes / typical edge counts; **no FPS CI** and no hard ms budget

B) Soft budget: Layout + full Route should finish in **≤300 ms** for ≤100 nodes (document as target; no CI timer gate)

C) Soft budget: **≤100 ms** for ≤50 nodes; at 100 nodes “best effort” (document; no CI gate)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 2 — Main-thread strategy for medium routing

A) **Synchronous** one-shot on click (simple; OK for ≤100 nodes if algorithm stays light)

B) **Yielding** — process edges in chunks via `requestAnimationFrame` / micro-batches so UI stays responsive during Route

C) Web Worker for A* (more complex; stop-and-ask if chosen — not used elsewhere yet)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 3 — Accessibility for Layout / Route controls

A) **Baseline** — buttons/menu keyboard-operable with accessible names; **no** full WCAG audit gate

B) Baseline + ensure Layout menu is operable via keyboard (open + select item) with visible focus

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 4 — Property-Based Testing (Partial) focus for U6

A) **Layout invariants** — e.g. layered ranks are non-decreasing along edges (acyclic case); all nodes get finite positions; + example tests for route fallback

B) **Routing invariants** — waypoints snapped to grid; path endpoints near ports; obstacle interiors not containing waypoints (best-effort); + example layout tests

C) **Both** light layout + light routing properties (keep suites small)

D) Example-based unit tests only for U6 (defer extra PBT)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 5 — Tech stack / libraries

A) Confirm **no new npm packages** — pure TS domain helpers + existing Angular UI (matches FD)

B) Allow one small approved helper later (name after Answer) — **stop-and-ask**

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 6 — Fail-soft / resiliency UX

A) Match FD: path-not-found → empty/minimal waypoints (bezier fallback); unexpected throws → soft `canvasError`; **no toast spam**

B) Same as A, plus set a brief non-blocking status string when any edge used fallback (“Some edges used simple paths”)

X) Other (please describe after [Answer]: tag below)

[Answer]:B

---

### Question 7 — After layout, viewport behavior

A) **No fit** — leave viewport unchanged (FD BR-U6-10)

B) Optional **fit-to-content** once after layout (reuse existing fit if present)

X) Other (please describe after [Answer]: tag below)

[Answer]:B

---

## Part B — Generation Checklist (after answers)

### Planning
- [x] All questions answered
- [x] Ambiguities resolved

### Artifacts
- [x] `nfr-requirements.md`
- [x] `tech-stack-decisions.md`

### Assessment areas
- [x] Performance / scalability (≤100 nodes)
- [x] Main-thread / yielding strategy
- [x] Availability / resiliency fail-soft
- [x] Security hygiene (no new libs; no innerHTML)
- [x] Usability / a11y baseline
- [x] Maintainability / Partial PBT
- [x] Extension compliance summary

---

## Approval
Awaiting user: **Request Changes** or **Continue to Next Stage** (NFR Design).
