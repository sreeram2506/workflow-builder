# Domain Entities — U4 Connections & Edge Reshape

## Purpose
Extend graph edge model for interactive connection drawing and waypoint reshape. Technology-agnostic.

## Carried from U1–U3
| Entity | U4 use |
|---|---|
| `WorkflowNode` | Endpoints; left/right port geometry from card bounds |
| `WorkflowDocument` | Owns `edges[]` mutations |
| `Viewport` / world↔screen | Draft pointer, snap, hit-test |
| `SelectionState` | `edgeIds` for reshape/delete; clear nodes when selecting new edge |

## Refined: WorkflowEdge
| Field | Type | Notes |
|---|---|---|
| `id` | string | `e-{source}-{target}-{shortRandom}` |
| `source` | string | Source node id |
| `target` | string | Target node id |
| `waypoints` | `Point[]` | Ordered world points between ports; default `[]` |

Seed edges from U1 gain `waypoints: []` (migration in code gen).

## ConnectionDraft (session UI state)
| Field | Meaning |
|---|---|
| `sourceNodeId` | Node where drag started |
| `pointerWorld` | Current pointer in world space |
| `hoverTargetNodeId` | Target node under pointer if over left handle, else null |
| `isValidHover` | Result of validate against hover target |

Not persisted in document.

## WaypointFocus (session UI state)
| Field | Meaning |
|---|---|
| `edgeId` | Selected edge owning the waypoint |
| `index` | Index into `edge.waypoints` |

## PortAnchor (derived)
| Field | Meaning |
|---|---|
| `nodeId` | Owner node |
| `side` | `'source' \| 'target'` (right / left) |
| `world` | `{ x, y }` at port center from node card bounds |

## ValidationResult
| Field | Meaning |
|---|---|
| `ok` | boolean |
| `reason?` | `self-loop` \| `missing-node` \| `invalid-target` |

## EdgeView (presentation update)
| Field | Source |
|---|---|
| Prior U2 fields | id, selected, port endpoints |
| `waypoints` | `WorkflowEdge.waypoints` |
| `pathD` | SVG path through ports + waypoints |
| `waypointViews` | positions + focused flag when edge selected |

## Store ownership (logical)
| Concern | Owner |
|---|---|
| Edges + waypoints | GraphStore via facade |
| Selection | UiStore |
| ConnectionDraft / WaypointFocus | UiStore or canvas-local session (prefer UiStore if shared) |

## Explicit non-entities in U4
- Edge labels, animated edge state, smart routing control points (U6)
- Schema property bindings for edges (U5+)
