# U4 Functional Design Plan — Connections & Edge Reshape

**Unit**: `u4-connections`  
**Build phase**: 5 (+ FR-09 reshape)  
**Stories**: US-5.1, US-5.2, US-5.3  
**Status**: GENERATION COMPLETE — AWAITING APPROVAL  

### Locked answers
| # | Answer |
|---|---|
| Q1 | A — Right source / Left target |
| Q2 | A — Reject self/wrong/empty; allow duplicate pairs |
| Q3 | B — Red preview only (no toast) |
| Q4 | B — Drag rubber-band + Escape cancel |
| Q5 | B — Multi-waypoint; dbl-click add; drag; Delete removes focused waypoint |
| Q6 | A — Snap 16 world px |
| Q7 | B — id `e-{source}-{target}-{shortRandom}` |
| Q8 | B — Also Delete selected edge when no waypoint focused |

**Delete priority (resolved in rules):** draft Escape ≠ Delete; focused waypoint → remove waypoint; else selected edge(s) → remove edge(s).

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
- [x] Step 1: Edge + waypoint domain model
- [x] Step 2: Connection validation rules (direction / self / dupes)
- [x] Step 3: Draw-edge gesture + preview + createEdge facade
- [x] Step 4: Waypoint reshape + grid snap
- [x] Step 5: Component updates (handles, graph renderer, viewport)
- [x] Step 6: Explicit U4 non-goals (U5–U8)

---

## Approval
Review artifacts, then Request Changes or Continue to Next Stage.
