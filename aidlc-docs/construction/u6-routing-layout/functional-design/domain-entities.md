# Domain Entities — U6 Smart Routing & Auto-Layout

## Purpose
Routing and layout inputs/outputs over existing graph geometry.

## Carried from prior units
| Entity | Use in U6 |
|---|---|
| `WorkflowNode` | Position + AABB for obstacles / layout targets |
| `WorkflowEdge` | `waypoints` written by router |
| `Viewport` | Unchanged unless later fit (not required) |
| Node card size defaults | Obstacle / spacing constants |

## New concepts

### LayoutMode
`'vertical' | 'horizontal' | 'layered'`

### RouteRequest
| Field | Meaning |
|---|---|
| `nodes` | Current nodes |
| `edges` | Current edges |
| `nodeSize` | Default width/height for AABB |
| `grid` | Snap size (16) |

### RouteResult
| Field | Meaning |
|---|---|
| `edgeId` | Target edge |
| `waypoints` | Replacement world points |

### LayoutRequest
| Field | Meaning |
|---|---|
| `mode` | LayoutMode |
| `nodes` / `edges` | Graph for ranking (layered uses edges) |
| `spacing` | Gaps between ranks / siblings |

### LayoutResult
| Field | Meaning |
|---|---|
| `positions` | Map `nodeId → {x,y}` |

### Services (logical; may be pure modules)
| Name | Role |
|---|---|
| Edge routing helpers | Medium grid/A* path → waypoints |
| Layout helpers | Vertical / horizontal / layered placement |

## Explicitly not entities in U6
- History entries (U7)
- Remote layout engines
- Per-edge route lock flags (rejected; Q3=A global replace)
