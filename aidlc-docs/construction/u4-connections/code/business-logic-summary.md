# Business Logic Summary — U4 Connections

## Implemented flows
1. **Draw edge** — drag from right (source) handle → rubber-band preview (rAF) → drop on left (target) handle of another node → `createEdge`
2. **Validation** — reject self-loop / missing nodes; duplicates allowed; invalid = red preview only
3. **Escape** — cancels in-progress draft
4. **Waypoints** — double-click selected edge to add (16px snap); drag waypoint (rAF); Delete removes focused waypoint
5. **Delete edge** — Delete/Backspace with edge(s) selected and no waypoint focus

## Key modules
| Module | Role |
|---|---|
| `connection.math.ts` | validate, snap, id, path, hit-test |
| `GraphStore` | addEdge / removeEdges / setEdgeWaypoints |
| `WorkflowFacade` | createEdge / deleteEdges / waypoint APIs |

## Errors
Unexpected throws → `canvasError`. Invalid complete is silent (visual only).
