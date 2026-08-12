# U6 Functional Design Plan — Smart Routing & Auto-Layout

**Unit**: `u6-routing-layout`  
**Build phases**: 7–8  
**Stories**: US-E7, US-E7.1, US-E8, US-E8.1  
**Status**: FUNCTIONAL DESIGN GENERATED — awaiting approval  

**Mandatory gates (from unit-of-work / requirements):**
1. Acceptable **smart-routing complexity** → **Medium** (Q1=B)
2. Auto-layout: **hand-rolled vs approved layout library** → **Hand-rolled only** (Q4=A)

**Baseline:** Custom SVG edges with multi-waypoints (U4). Horizontal bezier default. Nodes have world positions. No dagre/elk/etc. today. Project rule: no third-party workflow/canvas graph libraries unless explicitly approved.

**Clarifications R1 locked:** C1=A (V+H+Layered), C2=B (Layered = L→R BFS; V/H = axis pack), C3=A (layout auto-runs Route).

---

## Part A — Clarifying Questions

### Question 1 — GATE: Smart routing complexity (Phase 7 / FR-06)

A) **Light** — Avoid-node orthogonal / rounded routes using **waypoints** when an edge crosses a node AABB; otherwise keep current horizontal bezier; no global re-route of all edges

B) **Medium** — Obstacle-aware routes for all edges (simple grid / A* or equivalent hand-rolled); update routes when nodes move (debounced)

C) **Heavy** — Full continuous smart routing (re-route on pan/zoom/move with richer obstacle model) — higher cost / risk

X) Other (please describe after [Answer]: tag below)

[Answer]:B

**Resolved with Q2=A:** Medium algorithm runs only on explicit Route + after layout — **not** on node-move debounce and **not** live during drag.

---

### Question 2 — When does routing run?

A) On **explicit action** only (e.g. “Route edges” control) + optionally after auto-layout

B) Automatically after node move ends / createEdge (debounced), plus explicit “Route edges”

C) Continuously during node drag (live)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 3 — Interaction with hand-edited waypoints (U4)

A) Auto-route **replaces** waypoints for routed edges; user can still reshape after

B) Auto-route only edges with **empty** waypoints; skip edges the user already reshaped

C) Toggle per edge: “locked waypoints” vs “auto”

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 4 — GATE: Auto-layout approach (Phase 8 / FR-07)

A) **Hand-rolled only** — simple layered / vertical / horizontal placement (no new npm deps)

B) Allow a **small approved layout utility** (you must name the package after `[Answer]:`, e.g. `dagre` / `@dagrejs/dagre` / `elkjs`) — **stop-and-ask if not listed**

C) Defer auto-layout to a later unit; ship routing only in U6

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 5 — Layout options (if Q4 ≠ C)

A) Vertical + Horizontal + Layered (as FR-07) — one-click each from UI

B) Vertical + Horizontal only (drop layered for v1)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

*(Confirmed via clarifications R1 C1=A.)*

---

### Question 6 — Layout UI entry point

A) Top-bar or canvas control group: “Layout ▾” + “Route edges”

B) Context menu / keyboard only

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 7 — Scope / non-goals for U6

A) Confirm non-goals: no serialize/history (U7), no run/view-mode (U8), no new graph editor libs (ngx-vflow / React Flow / etc.), layout/routing are pure domain + facade mutations

B) Also include edge label–aware routing in U6

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Part B — Generation Checklist (after answers)

### Planning
- [x] All questions answered
- [x] Routing complexity gate resolved
- [x] Layout lib gate resolved (or deferred)
- [x] Ambiguities resolved
- [x] Expand US-E7 / US-E8 acceptance criteria from answers

### Artifacts
- [x] `business-logic-model.md`
- [x] `business-rules.md`
- [x] `domain-entities.md`
- [x] `frontend-components.md`

### Steps
- [x] Step 1: Routing algorithm + when it runs + waypoint policy
- [x] Step 2: Layout algorithm / lib decision + vertical/horizontal/layered
- [x] Step 3: Facade / store mutation APIs
- [x] Step 4: UI controls
- [x] Step 5: Explicit U6 non-goals
- [x] Step 6: Story AC expansion for US-E7 / US-E8

---

## Approval
Awaiting user: **Request Changes** or **Continue to Next Stage** (NFR Requirements).
