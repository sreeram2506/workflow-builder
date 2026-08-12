# Business Logic Model — U4 Connections & Edge Reshape

## Purpose
Enable drawing edges from source handles to target handles with direction-only validation, multi-waypoint reshape with grid snap, and delete of selected edges/waypoints.

## Actors
- Workflow Author (P-AUTHOR)

## Preconditions
- U1 shell + GraphStore document
- U2 canvas viewport, selection, bezier rendering baseline
- Nodes present on canvas (seed and/or U3 create)

## Locked decisions
| Topic | Decision |
|---|---|
| Handles | Right = source (out); Left = target (in) |
| Invalid | Self-loop, wrong direction, drop on empty/non-handle; **duplicates allowed** |
| Invalid feedback | Red preview only (no toast) |
| Gesture | Pointer-down source → rubber-band → up on target; **Escape cancels** |
| Waypoints | Multiple; double-click edge to add; drag with 16px world grid snap; Delete removes focused waypoint |
| Edge id | `e-{source}-{target}-{shortRandom}` |
| Also in U4 | Backspace/Delete removes **selected edge** when no waypoint focused |

---

## Flow 1 — Draw connection

```text
Pointer-down on node RIGHT (source) handle
  -> start connectionDraft { sourceNodeId, pointerWorld }
  -> rubber-band preview from source port → pointer
Pointer-move
  -> update preview end
  -> if over a LEFT (target) handle of another node:
       if valid → preview "valid" style
       if invalid (self / wrong side) → preview danger/red
  -> else preview neutral/invalid (cannot complete)
Pointer-up on valid LEFT handle of different node
  -> facade.createEdge(sourceId, targetId)
  -> select new edge; clear draft
Pointer-up elsewhere / invalid
  -> no edge; clear draft
Escape while drafting
  -> cancel draft
```

---

## Flow 2 — createEdge (facade)

```text
createEdge(sourceId, targetId)
  -> if editorMode === view: no-op
  -> validateConnection(sourceId, targetId, existingEdges)
  -> if invalid: return null (no toast — UI already showed red)
  -> id = e-{sourceId}-{targetId}-{shortRandom}
  -> edge = { id, source, target, waypoints: [] }
  -> graph.addEdge(edge)
  -> selectEdges([id])
```

---

## Flow 3 — Waypoint reshape

```text
Select edge
  -> show existing waypoints + affordance
Double-click on selected edge path (not on handle)
  -> insert waypoint near click (world), snapped to 16px grid
  -> focus that waypoint
Drag focused waypoint
  -> update position; snap to 16 world px grid on move/end
Delete/Backspace with waypoint focused
  -> remove that waypoint from edge.waypoints
Delete/Backspace with edge selected and no waypoint focused
  -> remove edge from document; clear selection
```

---

## Flow 4 — Render path

```text
Edge path =
  source right-port
  → waypoints[0..n] (world)
  → target left-port
Segment style: cubic beziers between consecutive points (or polyline+bezier hybrid consistent with U2 look)
```

## Error / edge cases
| Case | Behavior |
|---|---|
| View mode | No create / reshape / delete |
| Missing node endpoint | Do not create; ignore orphan edges on render |
| Duplicate pair | **Allowed** (Q2 = A) |
| Escape | Cancels draft; does not delete edges |

## Testable properties (Partial PBT)
| Property | Notes |
|---|---|
| Valid edge endpoints reference existing nodes | Invariant |
| createEdge never creates self-loop | Invariant |
| Waypoint coords are multiples of snap (16) after snap helper | Invariant |
