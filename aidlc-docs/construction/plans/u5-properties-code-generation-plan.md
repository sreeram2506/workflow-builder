# U5 Code Generation Plan — Schema-Driven Properties Panel

**Status**: APPROVED — Part 2 COMPLETE  
**Unit**: `u5-properties`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-6.1 (+ US-6.2 readiness; full view-mode lock in U8)  

### Locked inputs
| Area | Decision |
|---|---|
| Schema | XPMS-style descriptors; static `properties.schema.ts` |
| Fields | General + one boolean Configuration mock per type |
| Persist | Save only; dual-write `propertiesDraft` |
| Stack | `@angular/forms` only; no new libraries |

---

## Generation Steps

### Step 1 — Domain: path helpers + schema registry
- [x] `config-path.ts` getAtPath / setAtPath
- [x] `properties.schema.ts` XPMS + locked boolean per type

### Step 2 — Store / facade
- [x] `selectionFocusNodeId`, `propertiesDraft`
- [x] `GraphStore.patchNode` / `WorkflowFacade.patchNode`
- [x] Auto-expand on sole node select; focus on most recent click

### Step 3 — Unit tests (+ PBT)
- [x] Path round-trip + registry invariant + patchNode / focus tests

### Step 4 — Business logic summary
- [x] `business-logic-summary.md`

### Step 5 — Frontend: Properties panel
- [x] Evolve `RightSidebarComponent` reactive form + Save

### Step 6 — Frontend / facade wiring checks
- [x] `focusNodeInSelection` on already-selected click

### Step 7 — Frontend summary
- [x] `frontend-components-summary.md`

### Step 8 — API layer
- [x] SKIP documented

### Step 9 — Docs
- [x] README Phase 6 + `code-generation-summary.md`

### Step 10 — Deployment artifacts
- [x] SKIP documented

### Step 11 — Verify
- [x] `npm test` — **31** passed; `npm run build` — success
- [x] U6+ not implemented

---

## Approval
Part 2 generation complete — awaiting stage approval to continue.
