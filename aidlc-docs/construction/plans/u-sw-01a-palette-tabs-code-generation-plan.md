# U-SW-01a Code Generation Plan — Palette + Agent Tabs

**Status**: APPROVED — Part 2 COMPLETE  
**Unit**: `u-sw-01a-palette-tabs`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-SW-01 (+ tab chrome for later US-SW-02)  
**Design**: `aidlc-docs/construction/u-sw-01a-palette-tabs/functional-design/`  

---

## Generation Steps

### Step 1 — Domain: palette catalog
- [x] Modify `palette.catalog.ts` — Blank Agent restored; not in featured types
- [x] Update `palette.catalog.spec.ts`

### Step 2 — Domain: agent tabs pure helpers
- [x] Create `agent-tabs.ts` + `agent-tabs.spec.ts` (FIFO + PBT)

### Step 3 — UiStore + Facade
- [x] UiStore agent tab signals
- [x] Facade open/close/focus/prune/label

### Step 4 — Canvas: node double-click
- [x] WorkflowNode dblclick + canvas viewport handler

### Step 5 — Shell UI
- [x] Left sidebar Blank Agent row
- [x] Top bar agent tabs strip

### Step 6 — Tests
- [x] Facade + domain + app.spec; `npm test` 113 passed

### Step 7 — Business logic summary
- [x] `code/business-logic-summary.md`

### Step 8 — Frontend components summary
- [x] `code/frontend-components-summary.md`

### Step 9 — Code generation summary + SKIP stubs
- [x] `code-generation-summary.md`, api/repository/deployment SKIP
