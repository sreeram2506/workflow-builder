# Requirements — Solution Workflow (agent + nested skills)

**Last design sync**: 2026-08-15 — Application Design locked decisions (tab-first, Angular routes, skills list/cards)

## Intent Analysis Summary

| Field | Value |
|---|---|
| **User request** | Build solution workflow: agent-inside-agent with developed skills; palette = Condition, Router, Repeater, Blank Agent below |
| **Request type** | New feature / enhancement (brownfield) |
| **Scope** | Solution palette, Blank Agent tabs, nested agent skills route, mock skills list/cards, Back, persistence |
| **Complexity** | Moderate–Complex |
| **Requirements depth** | Standard |
| **Process** | Full AI-DLC (Q4=C) |
| **Construction unit 1** | **P0 + P1** together (verification Q3=B) |

### Clarification answers (original + AD overrides)

| Topic | Choice |
|---|---|
| Primary scope | Solution workflow mode (logic + Blank Agent; skills in agent context) |
| Skills source | Static mock list |
| Open Blank Agent | Header **agent tab** on dblclick; nested view on **intentional tab select** (AD Q1b=B) |
| Skills screen shape | Dedicated nested shell: mock skills **catalog + selected skills cards/list** (AD Q3b=A; not nested graph nodes) |
| Navigation tech | **Angular routes** e.g. `/agent/:nodeId` (AD Q1c=B) |
| Persistence | `AIAgent.data.skills[]` (AD Q2b=A) |
| First build slice | **P0 + P1** in first construction unit |
| Resiliency | Keep Yes / DR N/A |
| PBT | Keep Partial + fast-check |

### Freeform (normalized)

Solution workflow hosts agents. Double-clicking an agent opens a header tab; selecting that tab routes to a nested agent skills screen (library of mock skills + selected skills list/cards + Properties). Back returns to the solution canvas.

---

## 1. Goal

Introduce a **Solution Workflow** editing mode where:

1. The Nodes Library featured strip shows **Condition / Router / Repeater**, with **Blank Agent** below.
2. **Double-clicking** a Blank Agent opens/focuses an **agent tab** in the top bar; selecting that tab navigates to the nested agent skills view via Angular route.
3. That nested view exposes a **static mock catalog of developed skills** as cards the user can add to an ordered **skills list** on the agent (`data.skills`).

---

## 2. Confirmed Decisions

| Topic | Decision |
|---|---|
| Mode | Solution workflow canvas (distinct from a future pure “agent pipeline” product mode if added later) |
| Featured palette | Condition, Router (`Decision`), Repeater in one row |
| Below featured row | **Blank Agent** card (`AIAgent` type) restored to library |
| Category list | Existing Flow / Integration (+ Enso tasks if present); no separate Logic category required |
| Skills data | **Mock static catalog** only (no live skills API in this increment) |
| Nested UI | Dedicated nested shell children: left skills catalog, center selected-skills list/cards, right Properties |
| Nested content | Mock skills added to `AIAgent.data.skills` ordered list (cards/list — **not** canvas Skill nodes) |
| Navigation in | Double-click → agent tab; tab click → `/agent/:nodeId` nested view |
| Navigation out | **Back** in top bar → solution route; selection restored on Blank Agent when practical |
| Properties | Reuse existing Properties patterns for Blank Agent / selected skill entry where applicable |
| Empty start | Keep Untitled empty solution workflow on boot (R58) |

---

## 3. Functional Requirements

### FR-SW-01 — Solution palette

- When editing a solution workflow, Nodes Library shows:
  - Featured row: Condition, Router, Repeater (drag/click-to-add unchanged)
  - Directly below: **Blank Agent** card (drag/click-to-add creates `AIAgent` node labeled Blank Agent)
- Blank Agent must not disappear from the library after drag (same copy-on-create behavior as other palette items)

### FR-SW-02 — Blank Agent open path (tab-first)

- Blank Agent is a first-class canvas node (`AIAgent`)
- Single-click selects and opens Properties (existing behavior)
- **Double-click** adds or focuses an **agent tab** in the top bar for that agent instance (does **not** alone navigate to nested view)
- Selecting the agent tab navigates to the nested agent skills view for that instance via Angular route

### FR-SW-03 — Nested agent skills view (P1)

- Nested view uses dedicated nested shell children (library / center skills panel / Properties)
- Left library lists **mock developed skills** (static catalog: name + short description)
- User can add a skill from the catalog into the agent’s **selected skills list** (cards/list UI)
- Center region shows the ordered selected skills for the open agent (not a nested workflow graph canvas)
- Right Properties edits the selected Blank Agent metadata and/or the focused skill list entry using existing dialog patterns where applicable
- A visible **Back** control in the top bar returns to the solution canvas route with selection restored on that Blank Agent when practical

### FR-SW-04 — Mock skills catalog

- Provide a small static mock set of “developed skills” (names + short descriptions) sufficient for prototype demos
- No live Enso skills API required in this increment

### FR-SW-05 — Persistence (minimum)

- Selected skills for a Blank Agent are stored on `AIAgent.data.skills` as an ordered array of `{ skillId, name, description? }` (or equivalent)
- Navigate away / Back / re-open tab in the same session must not lose `data.skills`
- Export/import round-trips via existing opaque `node.data` serialize; document gaps as follow-up if any — **in-session persistence is required** for P0+P1

### Out of scope (this increment)

- Live skills / Workflow Manipulation API
- Nested skills **graph** (Skill NodeType / edges) — deferred unless revisited
- Full enso-suite parity for agent pipeline flags beyond existing solution logic nodes
- Multi-level nesting deeper than one agent-inside-solution
- Production auth for nested routes

---

## 4. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-SW-01 | Nested navigation feels instantaneous for local mock data (no blocking spinner > ~300ms unless loading remote later) |
| NFR-SW-02 | Keyboard: Escape may optionally close nested view later; Back control is mandatory in P1 |
| NFR-SW-03 | Existing unit tests remain green; add tests for palette Blank Agent, tab-on-dblclick, route open, skills list add/persist |
| NFR-SW-04 | PBT: Partial + fast-check on any new pure helpers (ids, catalog filter, skills array merge/dedupe) |
| NFR-SW-05 | Resiliency baseline: DR N/A; no new single-point deploy assumptions |

---

## 5. User scenarios (summary)

1. Author opens app → empty Untitled solution workflow → adds Condition / Router / Repeater / Blank Agent from library.
2. Author double-clicks Blank Agent → agent tab appears/focuses in top bar (still on solution canvas).
3. Author clicks the agent tab → nested skills view with mock catalog; adds skills to the selected list; edits Properties.
4. Author clicks Back → returns to solution canvas; Blank Agent still present; skills remain on `data.skills`.
5. Author continues wiring solution-level edges among logic nodes and agents.

---

## 6. Construction sequencing note

Per verification **Q3=B**, the **first construction unit includes P0 + P1** (palette + Blank Agent + tab/route nested skills list). Further polish (live APIs, skills graph) is later.

---

## 7. Success criteria

- Featured strip + Blank Agent visible in Nodes Library on solution canvas
- Double-click Blank Agent opens/focuses agent tab; tab selection opens nested skills view
- User can add mock skills to `data.skills`; Back returns to solution canvas without losing skills in-session
- Tests pass for new behavior; prior suites stay green
