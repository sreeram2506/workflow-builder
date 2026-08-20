# Code Generation Summary — Remove connector double-click waypoints

**Increment**: More Changes R64 (Q2=A direct implement)

| File | Change |
|---|---|
| `src/app/features/canvas/graph-renderer.component.ts` | Removed edge `dblclick` / `edgeDblClick` |
| `src/app/features/canvas/canvas-viewport.component.ts` | Removed `onEdgeDblClick` → `addWaypoint` |
| `src/app/features/canvas/canvas-viewport.edge-dblclick.spec.ts` | Dblclick does not add waypoints; click still selects |

`addWaypoint` remains on the facade for layout / existing data. Library `src/lib` is a symlink to `src/app`.
