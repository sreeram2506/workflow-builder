# U8 Functional Design Plan — Simulated Run & View Mode

**Unit**: `u8-run-view-mode`  
**Stories**: US-10.1, US-VM.1–3, US-6.2  
**Status**: FUNCTIONAL DESIGN GENERATED — awaiting approval  

### Locked answers
| # | Answer |
|---|---|
| Q1 | A — BFS from Trigger / indegree-0 |
| Q2 | A — 400 ms per step running→success |
| Q3 | A — leave statuses; Reset control; new Run resets idle first |
| Q4 | A — Run allowed in view mode |
| Q5 | B — disable Run while active; Stop cancels |
| Q6 | A — top-bar view/edit toggle + View indicator |
| Q7 | A — lock mutating; allow nav/theme/export/save-download/Run |
| Q8 | A — empty/no-seed soft canvasStatus |
| Q9 | A — no backend / no real branch eval |

---

## Part B — Generation Checklist

### Planning
- [x] All questions answered
- [x] Ambiguities resolved

### Artifacts
- [x] `business-logic-model.md`
- [x] `business-rules.md`
- [x] `domain-entities.md`
- [x] `frontend-components.md`

### Steps
- [x] Step 1: Run simulation algorithm + timing + cancel/restart
- [x] Step 2: Status lifecycle / reset
- [x] Step 3: View mode enter/exit + indicator
- [x] Step 4: Lock matrix (mutate vs allow)
- [x] Step 5: Top-bar Run + view toggle wiring
- [x] Step 6: Explicit U8 non-goals

---

## Approval
Awaiting user: **Request Changes** or **Continue to Next Stage** (NFR Requirements).
