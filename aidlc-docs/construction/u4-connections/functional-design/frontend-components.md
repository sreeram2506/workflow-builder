# Frontend Components — U4 Connections & Edge Reshape

## Purpose
UI structure for handle-driven edge creation, preview, waypoint editing, and delete. Builds on U2 canvas components.

## Component map

### WorkflowNodeComponent (evolve)
| Concern | Behavior |
|---|---|
| Source handle | Right-side hit target; `pointerdown` → emit `connectStart` (stop node drag) |
| Target handle | Left-side hit target; participates in hit-test during draft |
| Visual | Stronger handle affordance on hover / while drafting |

### GraphRendererComponent (evolve)
| Concern | Behavior |
|---|---|
| Edge path | Bezier (or segmented bezier) through ports + waypoints |
| Draft preview | Temporary dashed path; red when invalid hover; accent when valid |
| Waypoints | When edge selected, render waypoint dots; focused state styled |
| Events | Edge pointerdown (select); double-click → add waypoint; waypoint pointerdown → focus/drag |

### CanvasViewportComponent (evolve)
| Concern | Behavior |
|---|---|
| Connection gesture | Track draft; map pointer; complete/cancel; Escape listener |
| Waypoint drag | World delta + snap; call facade |
| Keyboard | Escape cancel draft / clear waypoint focus; Delete/Backspace per BR-U4-15 |
| Hit-test | Resolve target handle under pointer (world/screen) |

### WorkflowFacade (evolve)
| API | Role |
|---|---|
| `createEdge(sourceId, targetId)` | Validate + add + select |
| `deleteEdges(ids)` | Remove edges |
| `addWaypoint(edgeId, worldPoint)` | Snap + insert |
| `moveWaypoint(edgeId, index, worldPoint)` | Snap + update |
| `removeWaypoint(edgeId, index)` | Remove waypoint |

### GraphStore (evolve)
| API | Role |
|---|---|
| `addEdge` / `removeEdges` | Document mutations |
| `setEdgeWaypoints` / patch waypoint | Persist reshape |

## Interaction flows (UI)

### Draw
1. Source handle pointerdown → draft on
2. Move → preview updates; target handle hover validates
3. Pointerup valid → `createEdge`; invalid/empty → clear
4. Escape → clear

### Reshape
1. Select edge → waypoints visible
2. Double-click path → add snapped waypoint + focus
3. Drag waypoint → live update snapped position
4. Delete with focus → remove waypoint; else delete edge

## State
- Document: edges with waypoints
- Session: draft + waypoint focus (+ existing selection)

## Non-goals in UI
- Properties open on edge select (U5)
- Auto-layout / smart routing controls (U6)
- Connection type picker / animated edges
