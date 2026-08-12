# Business Rules — U6 Smart Routing & Auto-Layout

## BR-U6-01 — Routing on demand
Medium routing runs only when:
1. User invokes **Route edges**, or
2. User applies **any** auto-layout (then routing runs once automatically)

## BR-U6-02 — Route replaces waypoints
Invoking routing **overwrites** `edge.waypoints` for every edge in the document. Prior hand edits are discarded for that run; user may reshape again afterward (U4 gestures).

## BR-U6-03 — Obstacle model
Routing treats each node’s axis-aligned bounding box (world space, including known card size defaults) as an obstacle. Source and target nodes for an edge are not blocking their own ports.

## BR-U6-04 — Grid / path style
Routes are orthogonal (or orthogonal with rounded presentation via existing path builder) through waypoints. Prefer snap consistent with U4 (**16 world px**) when inserting route waypoints.

## BR-U6-05 — Fallback route
If search fails (no path), keep a simple horizontal bezier with **empty** or minimal midpoint waypoints (document choice: empty waypoints → existing bezier) and do not throw; optional soft `canvasError` only on unexpected exceptions.

## BR-U6-06 — Layout modes
| Mode | Behavior |
|---|---|
| Vertical | Pack along Y with fixed spacing |
| Horizontal | Pack along X with fixed spacing |
| Layered | BFS ranks left→right; within-rank Y stack |

## BR-U6-07 — Layout spacing
Use fixed design constants (e.g. rank gap / node gap) documented in code; no user-facing spacing UI in U6.

## BR-U6-08 — View mode
If `editorMode === 'view'`, Layout and Route controls are disabled / no-ops (prepare for U8; consistent with other mutations).

## BR-U6-09 — No new libraries
Layout and routing are pure TypeScript in `core/domain` (+ facade). No npm layout/routing packages.

## BR-U6-10 — Selection / viewport
Layout may leave selection unchanged. Viewport is not required to fit-all in U6 (optional follow-up); positions update in place.
