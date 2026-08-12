# Frontend Components — U3 Node Palette

## Hierarchy

```text
LeftSidebarComponent (U1 host — evolve)
  └── NodePaletteComponent          (NEW — categories, search, CDK drag list)
        └── PaletteItemComponent    (optional extract; may be inline)

CanvasViewportComponent (U2 — evolve)
  └── CDK drop list / drop zone on viewport surface
```

`PaletteCatalogService` (or static catalog module) supplies categories/items.

## Component Specs

### NodePaletteComponent
| Concern | Behavior |
|---|---|
| Search input | Debounced query + clear button |
| Categories | Expand/collapse headers |
| Items | Draggable via CDK; click triggers click-to-add |
| Templates | Disabled row (existing) |

| Outputs / calls | `facade.createNode` via drop handler parent or injected facade |

### Canvas drop zone (on CanvasViewport / CanvasHost)
| Concern | Behavior |
|---|---|
| `cdkDropList` | Connected to palette drag list |
| Drop handler | Map pointer to world; call `facade.createNode` |
| Invalid | Outside list = no create |

### WorkflowFacade (extend)
| Method | Purpose |
|---|---|
| `createNode(type, position)` | Append + select |
| (existing) `nodes`, `viewport`, `selectNodes` | Support |

### GraphStore (extend)
| Method | Purpose |
|---|---|
| `addNode(node)` | Immutable append to document.nodes |

## Story coverage
| Story | Coverage |
|---|---|
| US-4.1 | Categories + search |
| US-4.2 | CDK drag-drop create at drop point |
| Extra (approved Q6) | Click-to-add at viewport center |

## Non-goals in UI
- Connection drawing (U4)
- Real properties forms (U5)
- Opening Properties on create
