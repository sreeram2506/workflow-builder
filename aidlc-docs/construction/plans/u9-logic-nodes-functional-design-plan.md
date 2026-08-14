# U9 Functional Design Plan — Logic Nodes

**Unit**: `u9-logic-nodes`  
**Stories**: US-LN-01..07  
**Status**: ARTIFACTS GENERATED — awaiting approval  

Requirements already lock: Save-only + inline errors (U5), no live Enso API, Ignore Keys hidden on logic types, Condition expression on node, Router conditions on edges, mock Repeater picker.

### Locked planning decisions (agent-filled; user authorized)

| # | Decision |
|---|---|
| Q1 | New Router edge Name = `Blank Condition`; Condition empty |
| Q2 | Repeater paths `repeater.workflowId`, `repeater.versionId`, `repeater.is_paused` |
| Q3 | Uniqueness: trim; case-sensitive |
| Q4 | Third Condition out: silent reject |
| Q5 | Next Condition out fills missing `true` / `false` |
| Q6 | Save-only (U5 pattern) |
| Q7 | 2–3 mock workflows with 1–2 versions each |

---

## Part A — Clarifying Questions

### Question 1 — Business logic: new Router edge defaults

[Answer]: B

### Question 2 — Domain model: Repeater field paths

[Answer]: A

### Question 3 — Business rules: uniqueness comparison

[Answer]: A

### Question 4 — Error handling: third Condition outgoing edge

[Answer]: A

### Question 5 — Business scenarios: reconnect after deleting a Condition edge

[Answer]: A

### Question 6 — Data flow / frontend: persist

[Answer]: A

### Question 7 — Integration / mock catalog

[Answer]: A

---

## Part B — Generation checklist

- [x] Generate `aidlc-docs/construction/u9-logic-nodes/functional-design/business-logic-model.md`
- [x] Generate `business-rules.md`
- [x] Generate `domain-entities.md`
- [x] Generate `frontend-components.md` (Properties + connector panel + connect guards)
- [x] Supersede U5 BR-U5-09 for Router/Condition edges as specified
- [x] Keep technology-agnostic (no new infra)
