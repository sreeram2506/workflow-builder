# Logical Components — U4 (NFR Design)

## In-scope

### connection.math / edge helpers (pure)
| Field | Detail |
|---|---|
| **Type** | Pure functions under `core/domain/` |
| **Responsibility** | `validateConnection`, `snapToGrid`, `newEdgeId`, port anchors from node bounds, SVG path builder through waypoints |
| **PBT** | validation invariants; snap multiples; id pattern |

### WorkflowFacade (evolve)
| Field | Detail |
|---|---|
| **APIs** | `createEdge`, `deleteEdges`, `addWaypoint`, `moveWaypoint`, `removeWaypoint` |
| **Errors** | try/catch → `canvasError` on unexpected throw |

### GraphStore (evolve)
| Field | Detail |
|---|---|
| **APIs** | `addEdge`, `removeEdges`, waypoint patch helpers |

### CanvasViewportComponent (evolve)
| Field | Detail |
|---|---|
| **Owns** | Connection draft session state; Escape/Delete routing; rAF-scheduled preview |
| **Does not** | Persist draft to stores |

### GraphRendererComponent / WorkflowNodeComponent (evolve)
| Field | Detail |
|---|---|
| **Renders** | Draft preview path; waypoint dots; interactive handles |
| **Events** | connectStart; edge dblclick; waypoint drag |

## Explicitly out of scope
| Component | Reason |
|---|---|
| ConnectionService | Q4 = A |
| Queues / caches / CB | No backend |
| DOM elementFromPoint hit-test | Q2 = A |

## Dependency diagram

```text
Pointer on source handle
  -> CanvasViewport (draft local)
  -> rAF -> preview path (GraphRenderer)
  -> pure hitTestTargetHandle(nodes, world)
Pointer-up valid
  -> facade.createEdge
       -> validateConnection
       -> GraphStore.addEdge
       -> select edge
Unexpected throw -> canvasError
```
