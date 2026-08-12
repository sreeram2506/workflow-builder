# Business Logic Model — U6 Smart Routing & Auto-Layout

## Purpose
Provide one-click graph layouts (vertical / horizontal / layered) and explicit medium obstacle-aware edge routing that writes waypoints for readable paths.

## Actors
- Workflow Author (P-AUTHOR)

## Preconditions
- U1–U4 graph model (nodes, edges, waypoints, viewport)
- U4 horizontal bezier + multi-waypoint reshape
- No third-party layout/routing npm packages (hand-rolled)

## Locked decisions

| Topic | Decision |
|---|---|
| Routing complexity | **Medium** — grid / A* (or equivalent) obstacle-aware routes for edges |
| Routing trigger | **Explicit** “Route edges” only; **also once after any auto-layout** |
| Not on | Node-move debounce; live drag |
| Waypoints | Auto-route **replaces** waypoints; user may reshape afterward |
| Layout approach | **Hand-rolled only** (no new deps) |
| Layout options | Vertical + Horizontal + Layered |
| Layered | Left→right ranks via BFS from sources / indegree-0; Vertical/Horizontal = single-axis pack sorts |
| UI | Canvas/top control: **Layout ▾** + **Route edges** |
| Non-goals | No serialize/history (U7), no run/view (U8), no graph editor libs |

---

## Flow 1 — Route edges (explicit)

```text
User clicks “Route edges”
  -> for each edge in document:
       compute obstacle-aware path (node AABBs as obstacles; ports as start/end)
       replace edge.waypoints with route waypoints (grid-snapped if aligned with U4 16px policy)
  -> GraphStore updates; renderer shows new paths
```

---

## Flow 2 — Auto-layout then route

```text
User chooses Layout ▾ → Vertical | Horizontal | Layered
  -> compute new node positions (hand-rolled)
  -> GraphStore.patch node positions
  -> automatically run Route edges once (same as Flow 1)
```

---

## Flow 3 — Layout algorithms (hand-rolled)

```text
Vertical:
  -> sort/pack nodes along Y (preserve relative X lightly or center column); fixed spacing

Horizontal:
  -> sort/pack nodes along X (preserve relative Y lightly or center row); fixed spacing

Layered (left → right):
  -> rank nodes by BFS from indegree-0 (prefer Trigger-type seeds when present)
  -> place each rank in an X column; stack within rank on Y with spacing
  -> disconnected nodes get trailing ranks
```

---

## Out of scope (U6)
- Continuous / drag-live routing
- dagre / elkjs / ngx-vflow / React Flow
- Undo (U7)
- Edge-label-aware path inflation
