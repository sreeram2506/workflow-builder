# U4 Code Generation Plan — Connections & Edge Reshape

**Status**: APPROVED — Part 2 COMPLETE  
**Unit**: `u4-connections`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-5.1, US-5.2, US-5.3  

### Locked inputs
| Area | Decision |
|---|---|
| Handles | Right = source; Left = target |
| Invalid | Self-loop / wrong side / empty drop; **duplicates allowed** |
| Feedback | Red preview only (no toast) |
| Gesture | Source drag → rubber-band; Escape cancels |
| Waypoints | Multi; dbl-click add; drag; Delete focused waypoint |
| Snap | 16 world px |
| Edge id | `e-{source}-{target}-{shortRandom}` |
| Also | Delete selected edge(s) when no waypoint focused |
| Perf | Local draft + rAF; pure world hit-test |
| Stack | No new libraries |
| Non-goals | Smart routing (U6), Properties (U5), keyboard-only connect, ConnectionService |

---

## Generation Steps

### Step 1 — Domain helpers
- [x] Extend `WorkflowEdge` with `waypoints: Point[]`
- [x] Migrate seed edges to `waypoints: []`
- [x] Pure: `validateConnection`, `snapToGrid`, `newEdgeId`, port anchors, path builder
- [x] Handle hit-test helper (left target under world point)

### Step 2 — Store / facade
- [x] `GraphStore.addEdge` / `removeEdges` / waypoint patch APIs
- [x] `WorkflowFacade.createEdge`, `deleteEdges`, `addWaypoint`, `moveWaypoint`, `removeWaypoint`

### Step 3 — Unit tests (+ PBT)
- [x] validateConnection / snapToGrid / edge id fast-check
- [x] Facade createEdge / delete / waypoint example tests

### Step 4 — Business logic summary
- [x] `aidlc-docs/construction/u4-connections/code/business-logic-summary.md`

### Step 5 — Frontend
- [x] Interactive source/target handles on `WorkflowNodeComponent`
- [x] `CanvasViewport`: connection draft + Escape; Delete priority
- [x] `GraphRenderer`: draft preview; waypoints; dbl-click add; waypoint drag
- [x] rAF coalesce for draft preview + waypoint move

### Step 6 — Frontend tests / app.spec
- [x] Facade createEdge/waypoint specs; app smoke still green

### Step 7 — Frontend summary
- [x] `frontend-components-summary.md`

### Step 8 — API layer
- [x] SKIP documented

### Step 9 — Docs
- [x] README Phase 5 note + `code-generation-summary.md`

### Step 10 — Deployment artifacts
- [x] SKIP documented

### Step 11 — Verify
- [x] `npm test` + `npm run build` pass (24 tests)
- [x] Confirm U5+ features absent

---

## Approval
Part 2 generation complete — awaiting stage approval to continue.
