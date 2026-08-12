# Business Rules — U4 Connections & Edge Reshape

## Handles

### BR-U4-01 Handle roles
- Each node exposes a **right source (out)** handle and a **left target (in)** handle.
- Connection drafts may **start only** from a source handle.
- Connection drafts may **complete only** on a target handle of a **different** node.

### BR-U4-02 Handle hit area
- Handles have a pointer hit target large enough for reliable grabbing (visual port + padding).
- Pointer-down on handle does **not** start node drag.

## Connection validation

### BR-U4-03 Direction
- Only source → target is valid (right handle → left handle).
- Dropping on a source handle, node body, or empty canvas does not create an edge.

### BR-U4-04 Self-loop
- `sourceId === targetId` is always invalid.

### BR-U4-05 Duplicates
- Multiple edges with the same `source` and `target` **are allowed** in U4.

### BR-U4-06 Cycles / types
- No cycle detection in U4.
- No node-type port compatibility beyond handle direction.

### BR-U4-07 Validation API (pure)
- `validateConnection({ sourceId, targetId, nodes, edges })` → `{ ok: true } | { ok: false; reason }`
- Reasons: `missing-node` | `self-loop` | `same-handle-role` (if applicable) — UI maps invalid to red preview only.

## Draw gesture

### BR-U4-08 Rubber-band
- Active draft shows a temporary dashed line from source port to pointer (world).
- Near invalid target (or no valid target): line uses **danger/red** styling.
- Near valid target: line uses accent/valid styling.
- **No toast / canvasError** for invalid attempt (Q3 = B).

### BR-U4-09 Complete / cancel
- Pointer-up on valid target → `createEdge`.
- Pointer-up elsewhere → cancel draft.
- **Escape** cancels in-progress draft.

### BR-U4-10 Edit mode
- Drawing, reshape, and delete are no-ops when `editorMode === 'view'`.

## Edge identity

### BR-U4-11 Ids
- New edges use id `e-{sourceId}-{targetId}-{shortRandom}` (shortRandom ≈ 4 chars base36).
- New edges start with `waypoints: []`.

## Waypoints

### BR-U4-12 Multi-waypoint
- An edge may have zero or more waypoints in order along the path.
- Double-click on a **selected** edge path inserts a waypoint near the click point (world), snapped to grid.
- Waypoints are stored on the edge document model.

### BR-U4-13 Grid snap
- Snap size = **16 world pixels** (same as dotted grid step).
- `snapToGrid(point, 16)` applied on insert and while/after drag.

### BR-U4-14 Waypoint focus
- At most one waypoint is focused at a time (on the selected edge).
- Dragging moves the focused waypoint.
- Click empty / Escape clears waypoint focus (Escape also cancels connection draft if active — draft takes priority).

## Delete

### BR-U4-15 Delete priority
1. If connection draft active → Delete/Backspace ignored for graph mutation (Escape cancels draft).
2. Else if a waypoint is focused → remove that waypoint.
3. Else if one or more edges selected → remove those edges from the document; clear selection.
4. Else no-op (node delete remains out of scope unless already present).

### BR-U4-16 Delete selected edge
- Backspace/Delete with edge(s) selected and no waypoint focus removes edge(s) via facade.

## Non-goals (U4)
- Smart auto-routing / overlap reduction (U6)
- Properties panel open-on-select / schema edit (U5)
- Type-based connection rules beyond direction
- Undo/redo of edge ops (U7)
- Two-click connect mode (not selected)
