# Logical Components — U6 (NFR Design)

## In-scope

### edge-routing (pure module)
| Field | Detail |
|---|---|
| **Type** | Pure functions under `core/domain/` (e.g. `edge-routing.ts`) |
| **Responsibility** | Medium grid/A* obstacle-aware routes → waypoints; read grid size / padding from env defaults passed in by facade |
| **Fallback** | Return empty/minimal waypoints + flag `usedFallback` |

### layout.math (pure module)
| Field | Detail |
|---|---|
| **Type** | Pure functions under `core/domain/` (e.g. `layout.math.ts`) |
| **Responsibility** | Vertical / Horizontal / Layered (BFS L→R) position maps |
| **PBT** | Finite positions; layered rank monotonicity on DAGs |

### viewport.math (evolve)
| Field | Detail |
|---|---|
| **APIs** | Add `fitToContent(nodes, viewW, viewH, nodeSize?, padding?)` → `Viewport` |
| **Used by** | `facade.fitToContent` after layout |

### environment (evolve)
| Field | Detail |
|---|---|
| **Flags** | `routingGridSize` (default 16), `routingObstaclePadding` (default e.g. 8) — experiment knobs; no UI |

### UiStore (evolve)
| Field | Detail |
|---|---|
| **APIs** | `canvasStatus: signal<string \| null>` (+ set/clear); keep `canvasError` for throws |
| **Rule** | Fallback message → `canvasStatus`; exceptions → `canvasError` |

### WorkflowFacade (evolve)
| Field | Detail |
|---|---|
| **APIs** | `routeEdges()`; `applyLayout(mode)` (layout → route → fit); `fitToContent(viewW, viewH)` |
| **Errors** | try/catch → `canvasError`; set `canvasStatus` when any edge fallback |

### GraphStore (evolve)
| Field | Detail |
|---|---|
| **APIs** | Batch position update; batch waypoint replace for all/specified edges |

### ZoomControlsComponent (evolve)
| Field | Detail |
|---|---|
| **Owns** | Layout ▾ (Vertical / Horizontal / Layered) + Route edges beside zoom chrome |
| **May use** | Static inline SVG icons (Q6=B) |
| **Does not** | Own algorithm state |

### Shell / canvas host (minor)
| Field | Detail |
|---|---|
| **Shows** | `canvasStatus` when non-null (non-blocking; distinct from error styling if practical) |

## Explicitly out of scope
| Component | Reason |
|---|---|
| LayoutRouteControlsComponent | Q4 = A (extend ZoomControls) |
| TopBar-only placement | Q4 ≠ B |
| RoutingService injectable | Pure modules + facade |
| Web Worker / queues / caches | NFR + Q7 SKIP |
| Dedicated `routingStatus` | Q1 = A (`canvasStatus`) |

## Dependency diagram

```text
ZoomControls: Layout ▾ | Route edges
  -> facade.applyLayout(mode)
       -> layout.math -> positions
       -> GraphStore batch positions
       -> facade.routeEdges()
            -> edge-routing (env grid/padding) -> waypoints + fallback flags
            -> GraphStore batch waypoints
            -> UiStore.canvasStatus if any fallback
       -> facade.fitToContent(viewW, viewH)
            -> viewport.math.fitToContent -> setViewport

ZoomControls: Route edges alone
  -> facade.routeEdges()  (no fit)

Unexpected throw -> canvasError
View mode -> controls disabled / no-op
```

## Infrastructure
Confirm **Infrastructure Design SKIP** for U6 (no cloud resources).
