# Business Logic Summary — U6 Smart Routing & Auto-Layout

## Delivered
| Module | Role |
|---|---|
| `layout.math.ts` | Vertical / Horizontal / Layered (BFS L→R) position maps |
| `edge-routing.ts` | Medium grid A* obstacle-aware routes → waypoints + fallback flag |
| `viewport.math.fitToContent` | Fit node AABB into view (clamped zoom) |
| `GraphStore.setNodePositions` / `setAllEdgeWaypoints` | Batch commits |
| `WorkflowFacade.applyLayout` / `routeEdges` / `fitToContent` | Orchestration + view-mode guards |
| `UiStore.canvasStatus` | Non-error fallback notice |
| `environment.routingGridSize` / `routingObstaclePadding` | Experiment knobs (default 16 / 8) |

## Behaviors
- **Route edges**: sync; replaces all edge waypoints; sets `canvasStatus` if any fallback
- **Layout**: compute positions → batch → `routeEdges` → `fitToContent`
- **Route alone**: no fit
- Throws → `canvasError`

## Tests
- Layout example + PBT (finite positions; layered rank monotonicity on chains)
- Routing example (clear path + missing-endpoint fallback)
- `fitToContent` scale clamp PBT
- Facade applyLayout / routeEdges smoke
