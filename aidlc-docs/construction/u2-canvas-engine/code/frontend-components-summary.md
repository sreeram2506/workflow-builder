# Frontend Components Summary — U2

## Created / evolved
- `CanvasHostComponent` — hosts viewport + canvas error banner
- `CanvasViewportComponent` — pan (middle/Space), wheel zoom, marquee, node drag, grid
- `GraphRendererComponent` — straight SVG edges + marquee overlay
- `WorkflowNodeComponent` — HTML cards (glyph, label, subtitle, accent, status)
- `MinimapComponent` — overview + click/drag navigate
- `ZoomControlsComponent` — + / − / reset (bottom-right)

## Change requests
- Round 1: Pan/gestures + grid closer to workflowbuilder.io (left-drag pan; Shift+drag marquee; smoother wheel zoom; dotted grid look)
- Round 2: Connectors attach to left/right ports with endpoint dots; visible node handles (no edge create)
- Round 3: Horizontal bezier edges (single Condition handle kept)
