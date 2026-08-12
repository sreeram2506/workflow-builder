# U5 Functional Design Plan — Schema-Driven Properties Panel

**Unit**: `u5-properties`  
**Build phase**: 6  
**Stories**: US-6.1 (+ US-6.2 readiness; full view-mode lock in U8)  
**Status**: ARTIFACTS GENERATED — awaiting approval  

**Gate (mandatory):** Exact property field lists per node type must be confirmed before inventing fields. **RESOLVED** via clarifications R1 (C1=B, C2=C).

**Baseline:** Right sidebar is mock/readonly today. Selection exists (U2). `node.data` is `{}` on create. Reactive forms required (`@angular/forms`).

---

## Locked decisions (Part A + Clarifications R1)

| Topic | Decision |
|---|---|
| Q1 | A — Auto-expand on single-node select |
| Schema | **XPMS-style descriptors** (C1=B; overrides Q2 JSON Schema) |
| Fields | General + one boolean Configuration mock per type (C2=C) |
| Placement | General on root; config via `config_path` under `node.data` (C3=C) |
| Persist | Save only; no Cancel; discard on leave (Q4=B, C4=B) |
| Multi | Most recently clicked selected node (Q5=B, C5=B) |
| View | Disabled/readonly form (Q6=A) |
| Invalid | Disable Save; inline errors (C6=A) |
| Non-goals | No edge props / backend schema / undo (Q7=A) |

---

## Part A — Clarifying Questions (answered)

### Question 1
[Answer]:A

### Question 2
[Answer]:B *(superseded by C1=B)*

### Question 3 — GATE
[Answer]:X → resolved by C2=C

### Question 4
[Answer]:B

### Question 5
[Answer]:B

### Question 6
[Answer]:A

### Question 7
[Answer]:A

See `u5-properties-functional-design-clarifications-r1.md` for C1–C6.

---

## Part B — Generation Checklist

### Planning
- [x] All questions answered
- [x] Field-list gate resolved
- [x] Ambiguities resolved

### Artifacts
- [x] `business-logic-model.md`
- [x] `business-rules.md`
- [x] `domain-entities.md`
- [x] `frontend-components.md`

### Steps
- [x] Step 1: Schema registry + locked field lists
- [x] Step 2: patchNode facade / GraphStore rules
- [x] Step 3: Reactive form generation + **Save** (not live)
- [x] Step 4: Empty / multi / view-mode states
- [x] Step 5: Evolve RightSidebar → PropertiesPanel
- [x] Step 6: Explicit U5 non-goals
