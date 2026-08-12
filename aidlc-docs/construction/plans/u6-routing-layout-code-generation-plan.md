# U6 Code Generation Plan — Smart Routing & Auto-Layout

**Status**: APPROVED — Part 2 COMPLETE  
**Unit**: `u6-routing-layout`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-E7, US-E7.1, US-E8, US-E8.1  

### Locked inputs
| Area | Decision |
|---|---|
| Routing | Medium hand-rolled grid/A*; explicit Route; also after layout |
| Waypoints | Auto-route **replaces** all; reshape after OK |
| Layout | Hand-rolled Vertical / Horizontal / Layered (BFS L→R) |
| UI | Extend `ZoomControlsComponent`: Layout ▾ + Route edges |
| Perf | Sync one-shot; compute-then batch GraphStore commit |
| Fail-soft | Bezier fallback; `canvasStatus` if any fallback; throws → `canvasError` |
| Viewport | `fitToContent` once after layout (not after Route-alone) |
| Env | `routingGridSize` (default 16), `routingObstaclePadding` (default 8) |
| Stack | **No new npm packages** |
| Infra | SKIP |
| Non-goals | U7 history/serialize; U8 full view lock; dagre/elk; live/debounce route on move |

---

## Generation Steps

### Step 1 — Domain: layout + routing + fit helpers
- [x] Add `layout.math.ts`: `LayoutMode`; `layoutVertical` / `layoutHorizontal` / `layoutLayered` → `Map<nodeId, Point>` (or record)
- [x] Add `edge-routing.ts`: obstacle AABBs from nodes + size; grid/A* orthogonal path → waypoints; return `{ waypoints, usedFallback }`
- [x] Evolve `viewport.math.ts`: `fitToContent(nodes, viewW, viewH, options?)` → `Viewport` (clamp zoom)
- [x] Use node card size defaults already used elsewhere for AABB / fit

### Step 2 — Environment + store / facade
- [x] Add `routingGridSize` / `routingObstaclePadding` to `environment` (and production env if mirrored)
- [x] `UiStore.canvasStatus` + set/clear; clear on new Layout/Route (and keep `canvasError` for throws)
- [x] `GraphStore`: batch `setNodePositions` (or equivalent) + batch waypoint replace across edges
- [x] `WorkflowFacade.routeEdges()`, `applyLayout(mode)`, `fitToContent(viewW, viewH)`; view-mode no-ops; `applyLayout` = layout → route → fit
- [x] Expose `canvasStatus` on facade

### Step 3 — Unit tests (+ Partial PBT)
- [x] Example: vertical/horizontal/layered produce finite positions for sample graphs
- [x] `fast-check`: all laid-out positions finite; layered ranks non-decreasing along edges on acyclic graphs
- [x] Example: route fallback when blocked / trivial; facade `routeEdges` sets `canvasStatus` when any fallback
- [x] Example/PBT as needed: `fitToContent` keeps scale in clamp range

### Step 4 — Business logic summary
- [x] `aidlc-docs/construction/u6-routing-layout/code/business-logic-summary.md`

### Step 5 — Frontend: ZoomControls + host wiring
- [x] Extend `ZoomControlsComponent` with Layout menu (V/H/Layered) + Route edges; disable when view mode input
- [x] Allow static inline SVG icons if useful (no `innerHTML`)
- [x] Wire outputs in `canvas-host` / viewport (pass view size into `applyLayout` / `fitToContent`)
- [x] Show non-blocking `canvasStatus` near existing `canvasError` chrome (distinct styling if practical)

### Step 6 — Frontend / facade smoke
- [x] Facade / app specs still green; cover applyLayout chains route+fit at least once in tests or documented manual check

### Step 7 — Frontend summary
- [x] `aidlc-docs/construction/u6-routing-layout/code/frontend-components-summary.md`

### Step 8 — API layer
- [x] SKIP documented (`api-layer-SKIP.md`)

### Step 9 — Docs
- [x] README note for Phases 7–8 (Layout / Route)
- [x] `aidlc-docs/construction/u6-routing-layout/code/code-generation-summary.md`

### Step 10 — Deployment artifacts
- [x] SKIP documented (`deployment-SKIP.md`)

### Step 11 — Verify
- [x] `npm test` + `npm run build` pass (48 tests; ~445 kB main)
- [x] Confirm no new npm deps; U7+ features absent

---

## Story coverage
| Story | Steps |
|---|---|
| US-E7 Route edges | 1–3, 5–6 |
| US-E7.1 Reshape after | Existing U4 gestures; route replaces waypoints (1–2) |
| US-E8 Layouts V/H/Layered | 1–2, 5 |
| US-E8.1 Layout then auto-route | 2 (`applyLayout`), 5–6 |

## Approval
Part 2 generation complete — awaiting stage approval: **Request Changes** or **Continue to Next Stage** (Build and Test).
