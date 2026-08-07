# U1 Functional Design Plan — App Shell, Tokens, Theme, Seed Store

**Unit**: U1  
**Stories**: US-1.1, US-1.2, US-1.3  
**Status**: GENERATION COMPLETE — AWAITING APPROVAL  

### Locked answers
| # | Answer |
|---|---|
| Q1 | B — richer document (viewport, version, updatedAt) |
| Q2 | B — branch topology (Condition → Delay and End) |
| Q3 | A — NodeStatus idle\|running\|success\|error |
| Q4 | A — WorkflowStatus draft\|ready\|running; seed draft |
| Q5 | A — theme session-only in UiStore |
| Q6 | A — disabled Undo/Redo/Save/Run + tooltips |
| Q7 | A — sidebars with placeholders + collapse |
| Q8 | A — grid CSS placeholder; no node cards |
| Q9 | A — infallible seed; empty fallback shell |

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
- [x] Consistency check vs U1 stories only (no scope creep)

### Steps
- [x] Step 1: Domain entities from Q1–Q4
- [x] Step 2: Business rules from Q5–Q9
- [x] Step 3: Business logic / load-seed flow
- [x] Step 4: Frontend component model for shell/theme
- [x] Step 5: Validate US-1.1–1.3 coverage only
