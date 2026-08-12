# Domain Entities — U2 Canvas Engine

## Purpose
Extend U1 domain concepts with viewport interaction, selection, and view models for rendering. Technology-agnostic.

## Entities (carried from U1)
| Entity | U2 use |
|---|---|
| `WorkflowDocument` | Source of nodes, edges, initial `viewport` |
| `WorkflowNode` | Positioned card; `type`, `label`, `subtitle`, `status`, `position` |
| `WorkflowEdge` | Rendered as straight line between node midpoints |
| `Viewport` | `{ x, y, scale }` — pan/zoom state |
| `SelectionState` | `{ nodeIds: string[]; edgeIds: string[] }` |

## New / refined concepts for U2

### ViewportTransform
| Field | Meaning |
|---|---|
| `x`, `y` | Translation of world content in screen space |
| `scale` | Zoom factor; **clamped 0.25–2.0** |
| Derived | CSS/SVG transform: `translate(x,y) scale(scale)` with origin top-left of viewport host |

### WorldPoint / ScreenPoint
- **World**: graph coordinates (node `position` lives here)
- **Screen**: pointer coordinates relative to viewport element
- Conversion uses current viewport transform (invert for hit-testing / drop later)

### NodeView (presentation)
| Field | Source |
|---|---|
| `id`, `type`, `label`, `subtitle`, `status`, `position` | `WorkflowNode` |
| `selected` | `id ∈ selection.nodeIds` |
| `iconKey` | map from `NodeType` |
| `accentColorToken` | map from `NodeType` / category |
| `width`, `height` | Fixed card size constants for hit-test / edge midpoints / minimap |

### EdgeView (presentation)
| Field | Source |
|---|---|
| `id`, `source`, `target` | `WorkflowEdge` |
| `x1,y1,x2,y2` | Midpoints of source/target node cards in world space |
| `selected` | `id ∈ selection.edgeIds` |

### MarqueeRect
| Field | Meaning |
|---|---|
| `x`, `y`, `width`, `height` | Axis-aligned rect in **world** space while dragging |
| Intersection | Node selected if node bounding box intersects marquee |

### MinimapModel
| Field | Meaning |
|---|---|
| `contentBounds` | Union of node rects (with padding) |
| `viewportRect` | Visible world region mapped into minimap surface |
| Interaction | Click/drag viewport rect → update main `Viewport` |

## Store ownership (logical)
| Concern | Owner |
|---|---|
| Document nodes/edges + document.viewport persistence field | GraphStore (viewport field stays in sync with live viewport) |
| Live selection | UiStore (already modeled) **or** GraphStore — **prefer UiStore** for selection per U1 design |
| Live viewport during session | Same store as document viewport mutation via facade (GraphStore.document.viewport) |
| Transient UI: marquee in-progress, space-key pan armed, zoom hover | UiStore or local component state (marquee local OK) |

## Constants (design defaults)
| Name | Value |
|---|---|
| `ZOOM_MIN` | 0.25 |
| `ZOOM_MAX` | 2.0 |
| `ZOOM_STEP` | ~0.1 (control buttons) |
| `NODE_CARD_WIDTH` | fixed (e.g. 220) |
| `NODE_CARD_HEIGHT` | fixed (e.g. 72) |
| Grid spacing | theme token / ~18px world units (visual) |

## Explicitly not entities in U2
- Connection handles / provisional edges → U4
- Waypoints → U4/U6
- Palette / schema forms → U3/U5
- History snapshots → U7
