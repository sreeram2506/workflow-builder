# Business Logic Model — U2 Canvas Engine

## Purpose
Define navigate / render / select flows for Phases 2–3: viewport pan & zoom, dotted grid, minimap, zoom controls, HTML node cards, straight SVG edges, selection + marquee, and custom node repositioning — all against U1 in-memory GraphStore/UiStore via WorkflowFacade.

## Actors
- Workflow Author (P-AUTHOR)
- Reviewer (P-REVIEWER) — navigate/select/inspect (same gestures; mutate node positions allowed in edit mode only)

## Preconditions
- U1 bootstrap completed; GraphStore has seeded document (5 nodes / 4 edges)
- `CanvasHostComponent` hosts the viewport stack
- Editor mode is `edit` for mutating moves; view-mode lock is U8 (U2 may still allow navigate/select)

---

## Flow 1 — Mount canvas engine

```text
Shell renders CanvasHost
  -> CanvasHost hosts CanvasViewport
       -> GraphRenderer (SVG edges + marquee overlay)
       -> WorkflowNode cards (HTML overlay)
       -> Minimap + ZoomControls (floating)
  -> Read nodes/edges/viewport/selection via facade
  -> Apply viewport transform to world layer
```

### Outputs
- Seeded nodes visible as cards; edges as straight lines
- Grid pans/zooms with content
- Placeholder “Phase 2” hint removed

---

## Flow 2 — Pan

```text
Pointer down (middle) OR (Space held + left) on viewport
  -> remember last screen point
Pointer move
  -> delta screen -> add to viewport.x/y via facade.setViewport / panBy
Pointer up
  -> end pan
```

### Invariants
- Selection unchanged
- Scale unchanged

---

## Flow 3 — Zoom (wheel / pinch)

```text
Wheel/pinch at screen point S
  -> compute world point W under S before zoom
  -> newScale = clamp(scale * factor, 0.25, 2.0)
  -> adjust x/y so W still under S
  -> facade.setViewport({ x, y, scale: newScale })
```

---

## Flow 4 — Zoom controls

```text
Click + / - / reset
  -> zoom toward viewport center (or set scale=1 for reset)
  -> clamp; facade.setViewport
```

---

## Flow 5 — Select node / edge / clear

```text
Click node (no Shift)
  -> facade.selectNodes([id]) ; clear edges
Shift+click node
  -> facade.toggleNodeSelection(id)
Click edge
  -> facade.selectEdges([id]) ; clear nodes unless Shift toggle
Click empty (no drag)
  -> facade.clearSelection()
```

---

## Flow 6 — Marquee select

```text
Left pointer down on empty canvas (Space not held)
  -> start marquee at world point
Pointer move
  -> update MarqueeRect
Pointer up
  -> nodes = intersect(marquee, nodeBounds)
  -> if Shift: union with current nodeIds else replace
  -> facade.setSelection({ nodeIds, edgeIds: [] })
  -> clear marquee UI
```

---

## Flow 7 — Move node(s)

```text
Left pointer down on node
  -> if node not selected: exclusive select it
  -> begin drag; record start world positions of all selected nodes
Pointer move
  -> delta world = screenDelta / scale
  -> facade.moveNodes(selectedIds, delta) // or patch positions
Pointer up
  -> commit final positions (already live) ; end drag
```

### Notes
- Does not use Angular CDK
- Does not create history entries in U2

---

## Flow 8 — Minimap navigate

```text
User clicks or drags viewport indicator on minimap
  -> map minimap coords -> world viewport center/top-left
  -> facade.setViewport({ x, y, scale }) // scale unchanged unless product later adds minimap zoom
```

---

## Error / edge cases
| Case | Behavior |
|---|---|
| Zoom beyond clamp | No-op / stay at bound |
| Empty graph | Grid + empty viewport still pan/zoom; minimap empty bounds use fallback size |
| Missing edge endpoint id | Skip drawing that edge (defensive) |
| Bootstrap already done | Canvas only reads store; no re-seed |

## Testable properties (advisory for U2; Partial PBT)
| Property | Category | Notes |
|---|---|---|
| Zoom clamp | Invariant | `scale` always in [0.25, 2.0] after any zoom op |
| Cursor-anchored zoom | Invariant | World point under cursor unchanged (within epsilon) after wheel zoom |
| Round-trip screen↔world | Round-trip | `worldToScreen(screenToWorld(p)) ≈ p` for valid viewport |

Full PBT round-trips for serialize remain U7.
