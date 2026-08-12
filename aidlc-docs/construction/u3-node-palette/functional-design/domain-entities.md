# Domain Entities — U3 Node Palette

## Purpose
Catalog and create-node models for Phase 4 palette browse/search and CDK drag-drop (plus click-to-add).

## Carried from U1/U2
| Entity | Use in U3 |
|---|---|
| `NodeType` / `ALLOWED_NODE_TYPES` | Catalog membership |
| `WorkflowNode` | Created instances |
| `Viewport` | Drop/click → world position via `screenToWorld` |

## New concepts

### PaletteCategoryId
Suggested ids: `flow` | `logic` | `integration` | `ai` (labels: Flow, Logic, Integration, AI)

### PaletteItem
| Field | Meaning |
|---|---|
| `type` | `NodeType` |
| `label` | Display name |
| `description` | Subtitle / search text |
| `categoryId` | PaletteCategoryId |
| `accentToken` | CSS token (reuse U2 visuals map) |

### PaletteCategory
| Field | Meaning |
|---|---|
| `id` | PaletteCategoryId |
| `label` | Section title |
| `collapsed` | UI expand/collapse state (session) |
| `items` | PaletteItem[] |

### CreateNodeRequest
| Field | Meaning |
|---|---|
| `type` | NodeType |
| `position` | World `{x,y}` (drop point or viewport-center placement) |

### CreateNodeResult
| Field | Meaning |
|---|---|
| `nodeId` | New id `n-{type}-{shortRandom}` |

## Catalog grouping (design default)
| Category | Types |
|---|---|
| Flow | Trigger, Action, Delay, End |
| Logic | Condition, Decision |
| Integration | Notification |
| AI | AIAgent |

(Adjustable in Code Gen if UI needs different buckets; types set is locked.)

## Explicitly not entities in U3
- Connection handles / provisional edges → U4
- Property schemas → U5
- History entries → U7
