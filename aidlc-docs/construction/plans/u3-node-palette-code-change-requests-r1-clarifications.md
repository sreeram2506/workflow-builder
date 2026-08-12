# U3 Code Change Requests — Clarifications (Round 1)

**Recorded answers**
| Q | Answer |
|---|---|
| Q1 | X — on clicking boxes or connectors should open Properties |
| Q2 | (see Q1) |
| Q3 | N/A |
| Q4 | A — stay within U3 only |

**Conflict:** Opening Properties on node/edge click is **U5 / shell wiring**, not U3 palette scope. Q4 = A forbids that unless we re-scope.

Fill each `[Answer]:`, then reply in chat when done.

---

## Question C1
**What should “open Properties” mean for this change request?**

A) **Expand only** — when a node or edge is selected, expand the right Properties overlay if collapsed (keep current mock fields; no schema editing)

B) **Expand + bind selection** — expand Properties and show the **selected node’s** label/type/status in the mock panel (still read-only mock; not full U5 forms)

C) **Full U5** — schema-driven editable properties (defer; do not implement in this U3 change request)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question C2
**Scope override** (required because Q4 = A conflicts with Q1)

A) Treat this as **allowed small U3+ shell polish**: selection → open/bind Properties as in C1 — still no edge drawing, no Templates, no schema editor

B) **Keep Q4 = A** — do **not** implement Properties-on-click now; instead list a different U3-only change after [Answer]:ok

C) Park Properties-on-click for **U5**; approve U3 code as-is and continue to Build and Test

X) Other (please describe after [Answer]: tag below)

[Answer]:C

---

## Question C3
**When should Properties open?**

A) Single-click select on a **node** (and Shift multi-select: open if ≥1 node selected)

B) Node **or** edge select (connectors)

C) Only when selecting exactly **one** node (ignore multi-select / edges for open)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question C4
**Also open Properties when creating a node from the palette?** (U3 originally locked “do not open on create”)

A) No — keep locked behavior (create selects node only; user can open Properties separately / via C3 click)

B) Yes — createNode should also expand/bind Properties like selection

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---
