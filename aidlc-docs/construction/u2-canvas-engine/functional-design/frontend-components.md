# Frontend Components — U2 Canvas Engine

## Hierarchy

```text
CanvasHostComponent                    (existing U1 host — becomes container)
  └── CanvasViewportComponent          (pan/zoom surface, grid, pointer router)
        ├── GraphRendererComponent     (SVG: edges, marquee, optional edge hit paths)
        ├── WorkflowNodeComponent[]    (HTML cards in world layer)
        ├── MinimapComponent           (overview + viewport rect)
        └── ZoomControlsComponent      ( +/- / reset )
```

Shell overlays (top bar, Nodes Library, Properties) remain U1; they float above the canvas and must not capture pan when pointer is on canvas.

## Component Specs

### CanvasHostComponent (evolve from U1)
| Concern | Behavior |
|---|---|
| Layout | Fills stage under floating chrome |
| Content | Hosts `CanvasViewportComponent` only (remove Phase-2 placeholder copy) |
| State | None beyond composition |

### CanvasViewportComponent
| Binding / state | Source |
|---|---|
| `viewport` | facade / GraphStore |
| `nodes`, `edges` | facade |
| `selection` | facade / UiStore |
| Local | `spaceHeld`, `interactionMode` (pan \| marquee \| nodeDrag \| idle), marquee rect |

| Interaction | Effect |
|---|---|
| Wheel / pinch | cursor-anchored zoom → facade |
| Middle-drag / Space+left-drag | pan → facade |
| Left-drag empty | start marquee |
| Keydown/up Space | arm/disarm pan modifier |

| Outputs to children | World transform CSS/SVG on a single `.world` layer wrapping nodes + matching SVG transform |

### GraphRendererComponent
| Binding | Source |
|---|---|
| `edgeViews` | derived from edges + node positions/sizes |
| `selection.edgeIds` | facade |
| `marquee` | parent viewport (optional input) |

| Interaction | Effect |
|---|---|
| Click edge path | select edge (BR-U2-07) |
| No connection drag | U4 |

### WorkflowNodeComponent
| Input | Meaning |
|---|---|
| `node` / `view` | NodeView fields |
| `selected` | boolean |

| Interaction | Effect |
|---|---|
| Click | select / Shift toggle (BR-U2-05/06) |
| Drag | move selected set (BR-U2-11) via facade |
| Handles | **not rendered** in U2 (U4) |

| Visual | Icon, label, subtitle, accent, status badge, selection border |

### MinimapComponent
| Binding | Content bounds + viewport rect from nodes + viewport |
| Interaction | Click/drag viewport indicator → facade.setViewport |
| Placement | Bottom-right floating over canvas |

### ZoomControlsComponent
| Actions | zoomIn, zoomOut, resetScale |
| Placement | Bottom-right cluster with/near minimap |
| Does not | live in top bar (Q10 A)

## Facade methods expected (logical API for U2)
| Method | Purpose |
|---|---|
| `setViewport(v)` / `panBy(dx,dy)` | Update viewport |
| `zoomAt(screenPoint, factor)` / `zoomBy(factor, origin)` | Zoom with clamp |
| `selectNodes` / `toggleNodeSelection` / `selectEdges` / `clearSelection` / `setSelection` | Selection |
| `moveNodes(ids, delta)` | Reposition |

Exact signatures finalized in Code Generation; must not bypass stores.

## Story coverage
| Story | Component / flow |
|---|---|
| US-2.1 Pan | CanvasViewport |
| US-2.2 Zoom | Viewport + ZoomControls |
| US-2.3 Grid | Viewport background |
| US-2.4 Minimap | MinimapComponent |
| US-3.1 Node cards | WorkflowNodeComponent |
| US-3.2 Edges | GraphRendererComponent |
| US-3.3 Select highlight | Node/Edge + selection rules |
| US-3.4 Lasso | Viewport marquee + Graph overlay |

## Explicit non-goals in UI
- Palette CDK drop targeting (U3)
- Handle UI / provisional edge (U4)
- Properties form binding beyond existing mock panel (U5)
- Auto-layout controls (U6)
