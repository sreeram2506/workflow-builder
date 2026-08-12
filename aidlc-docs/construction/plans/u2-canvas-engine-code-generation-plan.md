# U2 Code Generation Plan — Canvas Engine

**Status**: GENERATION COMPLETE — AWAITING CODE APPROVAL  
**Unit**: `u2-canvas-engine`  
**Workspace root**: `/Users/sreeram/ofcwork/workflow-builder`  
**Depends on**: U1 shell, stores, facade, seed, `CanvasHostComponent`  
**Stories**: US-2.1–2.4, US-3.1–3.4  

### Story coverage
- [x] US-2.1 Pan  
- [x] US-2.2 Zoom  
- [x] US-2.3 Dotted grid  
- [x] US-2.4 Minimap  
- [x] US-3.1 Node cards  
- [x] US-3.2 Edges  
- [x] US-3.3 Selection highlight  
- [x] US-3.4 Lasso / marquee  

## Generation Steps

### Step 1 — Domain helpers + constants
- [x] ViewportMath helpers
- [x] Node visuals + card size constants
- [x] Marquee intersection helpers

### Step 2 — Store / facade APIs
- [x] GraphStore viewport + moveNodes
- [x] UiStore selection + canvasError
- [x] WorkflowFacade canvas APIs

### Step 3 — CanvasPerformanceScheduler
- [x] Injectable rAF coalesce
- [x] Wired from viewport pointermove

### Step 4 — Business logic unit tests (+ PBT)
- [x] viewport.math.spec.ts (PBT + examples)
- [x] facade viewport/selection/move smoke

### Step 5 — Business logic summary (docs)
- [x] business-logic-summary.md

### Step 6 — Frontend components
- [x] CanvasHost + Viewport + Graph + Nodes + Minimap + ZoomControls + tokens

### Step 7 — Frontend component unit testing
- [x] app.spec.ts updated

### Step 8 — Frontend components summary (docs)
- [x] frontend-components-summary.md

### Step 9 — API layer
- [x] SKIP documented

### Step 10 — Repository layer
- [x] Unchanged seed (noted in summaries)

### Step 11 — Documentation
- [x] README + code-generation-summary.md

### Step 12 — Deployment artifacts
- [x] SKIP documented

### Step 13 — Verify
- [x] npm test (10) + npm run build pass
- [x] U3–U8 features absent
