# Frontend Components — U1

## Hierarchy

```text
AppComponent
  └── ShellLayoutComponent
        ├── TopBarComponent
        │     ├── title + StatusPill
        │     ├── actions: Undo, Redo, Save, Run (disabled)
        │     └── ThemeToggleComponent
        ├── LeftSidebarComponent (placeholder + collapse)
        ├── CanvasHostComponent (grid CSS placeholder)
        └── RightSidebarComponent (placeholder + collapse)
```

## Component Specs

### AppComponent
- **State**: none beyond hosting
- **On init**: call `WorkflowFacade.initialize()` once

### ShellLayoutComponent
| Binding | Source |
|---|---|
| `leftCollapsed` | UiStore via facade |
| `rightCollapsed` | UiStore via facade |
| `theme` / mode class | UiStore |
| **Interactions** | collapse toggles → facade |

### TopBarComponent
| Binding | Source |
|---|---|
| `name` | GraphStore document.name |
| `status` | GraphStore document.status |
| **Actions** | Undo/Redo/Save/Run disabled; tooltip only |
| **Child** | ThemeToggleComponent |

### ThemeToggleComponent
| Interaction | Effect |
|---|---|
| click | `facade.toggleTheme()` |
| display | icon/label reflecting current theme |

### LeftSidebarComponent / RightSidebarComponent
| Prop/state | Value |
|---|---|
| collapsed | boolean from UiStore |
| content | Placeholder text only (e.g. “Node library coming soon” / “Properties coming soon”) |
| No forms | — |

### CanvasHostComponent
| Behavior | U1 |
|---|---|
| Visual | Dotted grid background via CSS tokens |
| Nodes | Not rendered |
| Pointer | No pan/zoom handlers |
| Optional | Could show muted helper text “Canvas engine in Phase 2” |

## Design Tokens (CSS variables)
Must define at least:
- `--wb-bg-app`, `--wb-bg-panel`, `--wb-bg-canvas`
- `--wb-border`, `--wb-text`, `--wb-text-muted`
- `--wb-accent`, `--wb-radius` (~8px), `--wb-shadow`
- `--wb-grid-dot`
- Light + dark sets; dark active by default via `data-theme="dark"`

## Forms / API
- No reactive forms in U1
- No HTTP / backend integration points

## Accessibility (baseline)
- Disabled action buttons expose accessible names + reason
- Theme toggle keyboard-activatable
- Collapse controls keyboard-activatable
