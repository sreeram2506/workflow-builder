# Component Methods — Angular Workflow Builder

High-level interfaces only. Detailed business rules belong in Functional Design (per unit).

---

## Shell

### ShellLayoutComponent
| Method / binding | Purpose | Inputs | Outputs |
|---|---|---|---|
| `layoutMode()` | CSS mode class from store | — | `'edit' \| 'view'` |
| `onToggleLeft()` | Collapse/expand left sidebar | — | void |

### TopBarComponent
| Method | Purpose | Inputs | Outputs |
|---|---|---|---|
| `title()` | Workflow title signal | — | `string` |
| `status()` | Status pill value | — | `WorkflowStatus` |
| `onSave()` | Trigger save/snapshot intent | — | void (later) |
| `onRun()` | Trigger simulated run | — | void (later) |
| `onUndo()` / `onRedo()` | History intents | — | void (**Phase 9**) |

### ThemeToggleComponent
| Method | Purpose | Inputs | Outputs |
|---|---|---|---|
| `theme()` | Current theme | — | `'light' \| 'dark'` |
| `toggleTheme()` | Flip theme via facade | — | void |

---

## Canvas (Later units; designed now)

### CanvasViewportComponent
| Method | Purpose | Inputs | Outputs |
|---|---|---|---|
| `onPointerDown/Move/Up` | Pan / lasso start | PointerEvent | void |
| `onWheel` | Zoom | WheelEvent | void |
| `viewportTransform()` | CSS/SVG transform | — | `{x,y,scale}` |

### GraphRendererComponent
| Method | Purpose | Inputs | Outputs |
|---|---|---|---|
| `edges()` | Edge list from graph store | — | `Edge[]` |
| `onEdgeSelect` | Select edge | edgeId | void |
| `onConnectionDrag` | Draw provisional edge | handle refs | void |
| `onMarqueeComplete` | Lasso selection | Rect | void |

### WorkflowNodeComponent
| Method | Purpose | Inputs | Outputs |
|---|---|---|---|
| `@Input() node` | Node view model | `NodeView` | — |
| `onSelect` | Select node | MouseEvent | void |
| `onMove` | Custom drag move | delta | void |
| `onHandleStart` | Begin connection | handleId | void |

### MinimapComponent
| Method | Purpose | Inputs | Outputs |
|---|---|---|---|
| `onNavigate` | Jump viewport | point | void |

---

## Palette (Later)

### NodePaletteComponent
| Method | Purpose | Inputs | Outputs |
|---|---|---|---|
| `categories()` | Palette catalog | — | `PaletteCategory[]` |
| `searchQuery` | Filter | string | void |
| `onDropToCanvas` | Create node at drop | type, point | void |

---

## Properties (Later)

### PropertiesPanelComponent
| Method | Purpose | Inputs | Outputs |
|---|---|---|---|
| `selectedNode()` | From facade | — | `Node \| null` |
| `schema()` | From schema registry | nodeType | `JsonSchema` |
| `onPatch(field, value)` | Emit patch to facade | patch | void |

---

## Core stores / facade (not UI components; method surface)

See `services.md` for `WorkflowFacade`, `GraphStore`, `UiStore`, domain pure modules.
