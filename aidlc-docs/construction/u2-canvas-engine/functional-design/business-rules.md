# Business Rules — U2 Canvas Engine

## Navigation

### BR-U2-01 Pan
- Pan activates with **left-drag on empty canvas** (Workflow Builder / React Flow default), **middle-mouse drag**, or **Space + left-drag**.
- Pan updates `viewport.x` / `viewport.y` so grid, nodes, and edges move together.
- Cursor shows grab/grabbing while armed/panning.
- Pan does not change selection (except a near-zero click on empty clears selection).

### BR-U2-02 Zoom
- **Wheel / pinch** zooms toward the **cursor** with smooth exponential scaling.
- **Zoom controls** (+ / − / reset) zoom toward **viewport center**.
- Scale is clamped to **[0.25, 2.0]**.
- Fit-to-content is **out of scope** for U2.

### BR-U2-03 Grid
- Dotted grid is painted in the viewport and transforms with pan/zoom.
- Grid remains readable under light and dark theme tokens.

### BR-U2-04 Viewport persistence (session)
- On bootstrap, load seed `document.viewport`.
- Pan/zoom mutate in-memory viewport via facade.
- Refresh discards changes (no localStorage) — same product rule as U1.

## Selection

### BR-U2-05 Click node
- Click node → exclusive select that node (clears other nodeIds and edgeIds) unless Shift held.

### BR-U2-06 Shift+click node
- Toggle node id in `selection.nodeIds`; does not clear other selected nodes.
- Edge selection cleared when toggling nodes unless product later revises (U2: clearing edges on node toggle is OK for simplicity).

### BR-U2-07 Click edge
- Click edge → select that edge; clear node selection unless Shift held (Shift+edge toggles edge id).

### BR-U2-08 Click empty
- Click empty canvas (no marquee) → clear selection (`nodeIds` and `edgeIds` empty).

### BR-U2-09 Marquee
- **Shift + left-drag on empty canvas** starts marquee (left-drag without Shift pans — reference parity).
- On marquee complete: select all nodes whose bounds **intersect** the marquee rect (union with existing selection).
- Marquee does not select edges in U2.

### BR-U2-10 Selection chrome
- Selected nodes show highlighted border.
- Selected edges show highlighted stroke.

## Node move

### BR-U2-11 Node drag
- Left-drag on a **selected or newly clicked** node moves it (custom pointer logic, not CDK).
- Updates `node.position` in world coordinates via facade for each move end (and optionally live during drag).
- If dragging an unselected node: select it exclusively first, then move.
- Dragging a node that is part of a multi-selection: **move all selected nodes** by the same delta (standard editor expectation).

## Rendering

### BR-U2-12 Node cards
- Each node renders as an HTML card: **icon** (by type), **label**, **subtitle**, **category accent**, **status badge**.
- Cards positioned from `position` + fixed size; transformed by viewport.

### BR-U2-13 Edges
- Edges are **horizontal cubic beziers** between **source right-port** and **target left-port**.
- Visual **dot handles** at edge ends; nodes show left/right handle chrome (preview — **no** create-edge-by-drag).
- Condition keeps a **single** output handle in U2 (multi-branch ports deferred).
- No waypoints or auto-routing in U2.

## Minimap & zoom UI

### BR-U2-14 Minimap
- Shows scaled node rects + viewport rectangle.
- **Click/drag** of viewport indicator updates main viewport (US-2.4).

### BR-U2-15 Zoom controls
- Floating cluster **bottom-right** (beside/above minimap): zoom in, zoom out, reset (~100% / scale 1).

## Non-goals (U2)

### BR-U2-16 Out of scope
- Palette drag-drop create (U3)
- Connection drawing / handles (U4)
- Properties editing (U5)
- Smart routing / auto-layout (U6)
- Undo/history / export (U7)
- Run / view-mode locks (U8)
