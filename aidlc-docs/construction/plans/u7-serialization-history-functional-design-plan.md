# U7 Functional Design Plan — Serialization, Autosave, History, Clipboard

**Unit**: `u7-serialization-history`  
**Build phase**: 9  
**Stories**: US-9.1, US-9.2, US-9.3, US-9.4, US-9.5  
**FR**: FR-10, FR-11, FR-12  
**Status**: FUNCTIONAL DESIGN GENERATED — awaiting approval  

### Locked answers
| # | Answer |
|---|---|
| Q1 | A — Download `.json` only |
| Q2 | C — File picker + paste dialog |
| Q3 | A — Replace entire document |
| Q4 | C — Save downloads JSON (+ in-memory debounce status) |
| Q5 | B — 500 ms debounce |
| Q6 | A — Document snapshots |
| Q7 | A — Graph mutations only (not pan/zoom/selection) |
| Q8 | B — Cap 100; coalesce node-drag per gesture |
| Q9 | A — Nodes + internal edges; offset +40,+40 |
| Q10 | B — Shortcuts + ⌘/Ctrl+S Save/download |
| Q11 | A — `schemaVersion: 1` |
| Q12 | A — No localStorage; enable Undo/Redo/Save/Export/Import |

---

## Part A — Clarifying Questions (answered)

(See prior answers Q1–Q12 in file history; all locked above.)

---

## Part B — Generation Checklist (after answers)

### Planning
- [x] All questions answered
- [x] Ambiguities resolved
- [x] Story AC refinements noted if needed (Save=download; import both UX; history exclusions)

### Artifacts
- [x] `business-logic-model.md`
- [x] `business-rules.md`
- [x] `domain-entities.md`
- [x] `frontend-components.md`

### Steps
- [x] Step 1: Serialize / deserialize model + validation
- [x] Step 2: Export / import UX flows
- [x] Step 3: Auto-save debounce semantics + Save button
- [x] Step 4: History stack + undo/redo + coalescing
- [x] Step 5: Copy/paste rules
- [x] Step 6: Shortcuts + top-bar enablement
- [x] Step 7: Explicit U7 non-goals

---

## Approval
Awaiting user: **Request Changes** or **Continue to Next Stage** (NFR Requirements).
