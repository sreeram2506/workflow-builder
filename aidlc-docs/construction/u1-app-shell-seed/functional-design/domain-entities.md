# Domain Entities — U1

## Enumerations

### NodeType (v1 locked)
`Trigger | Action | Condition | Delay | End`

### NodeStatus
`idle | running | success | error`  
U1 seed uses `idle` for all nodes.

### WorkflowStatus
`draft | ready | running`  
U1 seed uses `draft`.

### Theme
`dark | light`  
Default on load: `dark`.

### EditorMode (model present; U1 always edit)
`edit | view`  
U1 initializes to `edit`. View-mode behavior is U8.

---

## Entities

### WorkflowDocument
| Field | Type | Notes |
|---|---|---|
| id | string | Stable sample id |
| name | string | Shown in top bar title |
| status | WorkflowStatus | Status pill |
| version | number | Start at `1` |
| updatedAt | string (ISO-8601) | Seed timestamp constant |
| viewport | Viewport | Present in model; U1 UI does not drive pan/zoom |
| nodes | WorkflowNode[] | 5 seed nodes |
| edges | WorkflowEdge[] | 4 seed edges (branch topology) |

### Viewport
| Field | Type | Default (U1) |
|---|---|---|
| x | number | `0` |
| y | number | `0` |
| scale | number | `1` |

### WorkflowNode
| Field | Type | Notes |
|---|---|---|
| id | string | Unique |
| type | NodeType | Catalog type |
| label | string | Primary text |
| subtitle | string | Secondary text |
| position | `{ x: number, y: number }` | World coordinates (unused by U1 canvas UI) |
| status | NodeStatus | Badge value later; stored now |
| data | Record\<string, unknown\> | Empty object `{}` in seed; properties unit later |

### WorkflowEdge
| Field | Type | Notes |
|---|---|---|
| id | string | Unique |
| source | string | Source node id |
| target | string | Target node id |

### UiState (not part of document; UiStore)
| Field | Type | U1 default |
|---|---|---|
| theme | Theme | `dark` |
| editorMode | EditorMode | `edit` |
| leftSidebarCollapsed | boolean | `false` |
| rightSidebarCollapsed | boolean | `false` |
| selection | `{ nodeIds: string[], edgeIds: string[] }` | empty |

---

## Seed Topology (Q2 = B)

Nodes (5):
1. `n-trigger` — Trigger  
2. `n-action` — Action  
3. `n-condition` — Condition  
4. `n-delay` — Delay  
5. `n-end` — End  

Edges (4):
1. Trigger → Action  
2. Action → Condition  
3. Condition → Delay  
4. Condition → End  

```text
Trigger --> Action --> Condition --> Delay
                         |
                         +------> End
```
