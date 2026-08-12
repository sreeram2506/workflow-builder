# U6 Functional Design — Clarifications (Round 1)

**Recorded answers (Part A)**

| Q | Answer | Notes |
|---|---|---|
| Q1 | B | Medium obstacle-aware routing (grid/A* hand-rolled) |
| Q2 | A | Explicit “Route edges” (+ after auto-layout) — **overrides** “on node move” phrasing inside Q1-B |
| Q3 | A | Auto-route replaces waypoints; user may reshape after |
| Q4 | A | Hand-rolled layout only (no new npm deps) |
| Q5 | *(empty)* | **Required** — layout option set |
| Q6 | A | Top-bar / canvas: Layout ▾ + Route edges |
| Q7 | A | Non-goals confirmed |

**Resolved without further ask**
- **Routing trigger**: Use **Q2=A**. Medium algorithm runs only on explicit Route + after layout — **not** on node-move debounce and **not** live during drag.

Fill each `[Answer]:`, then reply in chat when done.

---

## Question C1 — Layout options (was Q5)

A) Vertical + Horizontal + Layered (FR-07 full set)

B) Vertical + Horizontal only (drop layered for v1)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question C2 — Layered layout meaning (if C1=A)

A) Simple **rank/layer by BFS from Trigger-like sources** (or indegree-0), place layers left→right or top→bottom with fixed spacing — hand-rolled

B) Same as A but always **left→right layered** as the “Layered” button; Vertical/Horizontal are single-axis pack sorts

X) Other (please describe after [Answer]: tag below)

[Answer]:B

---

## Question C3 — After layout, auto-run Route edges?

A) **Yes** — applying any layout then runs medium routing once (matches Q2 “optionally after auto-layout”)

B) **No** — layout only moves nodes; user must click Route edges separately

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## After answers
Functional Design artifacts + expanded US-E7/US-E8 ACs will be generated.
