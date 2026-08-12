# Logical Components — U3 (NFR Design)

## In-scope

### PaletteCatalog
| Field | Detail |
|---|---|
| **Type** | Static data module / lightweight service |
| **Responsibility** | Categories + items for approved NodeTypes |
| **Does not** | Persist UI collapse state (component owns session flags) |

### NodeFactory helpers (pure)
| Field | Detail |
|---|---|
| **Type** | Pure functions under `core/domain/` or `features/palette/` |
| **Responsibility** | `newNodeId(type)`, default label/subtitle/`WorkflowNode` shape |
| **PBT** | type ∈ catalog; id pattern |

### WorkflowFacade.createNode / GraphStore.addNode
| Field | Detail |
|---|---|
| **Responsibility** | Append node, select it; validate; try/catch → canvasError |

### CDK wiring (components)
| Field | Detail |
|---|---|
| **Palette** | `cdkDrag` on items; connected to canvas drop list id |
| **CanvasViewport** | `cdkDropList`; drop → world coords → `createNode` |

### SearchDebouncer (in-component)
| Field | Detail |
|---|---|
| **Type** | Subject + `debounceTime(150)` subscription |
| **Responsibility** | Drive filtered catalog view |

## Explicitly out of scope
| Component | Reason |
|---|---|
| PaletteDragCoordinator service | Q4 = A |
| Queues / caches / CB | No backend |
| DomSanitizer package | Hygiene only |

## Dependency diagram

```text
PaletteCatalog --> NodePaletteComponent
                 |-- cdkDrag items --> cdkDropList (CanvasViewport)
                 |-- search$ debounceTime(150) --> filtered view
Drop / click --> WorkflowFacade.createNode
                 --> NodeFactory helpers
                 --> GraphStore.addNode + UiStore.select
.catch --> canvasError banner
```
