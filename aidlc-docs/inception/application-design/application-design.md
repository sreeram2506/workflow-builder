# Application Design — Consolidation

## Summary
Greenfield Angular Workflow Builder designed as a feature-folder SPA with a split signal store (`GraphStore` + `UiStore`) behind `WorkflowFacade`, thin services over pure domain functions, and a modular canvas (`Viewport` + `GraphRenderer` + `WorkflowNode`). History is deferred to Phase 9. Phase 1 implements shell, tokens, theme toggle, and seed-loaded stores only.

## Locked Design Decisions
| Topic | Decision |
|---|---|
| Folders | `features/*` + `core/` + `shared/` |
| State | GraphStore + UiStore + WorkflowFacade |
| Canvas packaging | Separate Viewport / GraphRenderer / Node components |
| Services | Thin facades + pure TS domain modules |
| History | Deferred — not in this design |
| Properties | Schema registry + facade patches |
| Design breadth | Full component map; P2+ marked Later; P1 = shell + tokens + seed |

## Artifact Index
| File | Contents |
|---|---|
| [components.md](./components.md) | Component catalog + responsibilities |
| [component-methods.md](./component-methods.md) | High-level method signatures |
| [services.md](./services.md) | Services + orchestration patterns |
| [component-dependency.md](./component-dependency.md) | Dependencies + data flows |

## Phase 1 Implementation Boundary
**In scope for first Code Generation**
- App + ShellLayout + TopBar + sidebars + CanvasHost placeholder
- Design tokens (CSS variables), dark default theme + ThemeToggle
- WorkflowFacade, GraphStore, UiStore, MockWorkflowRepository
- Seed workflow with 4–5 nodes/edges (types locked)

**Out of scope for Phase 1 code**
- Pan/zoom/minimap/lasso engine
- Node/edge rendering interactions
- Palette DnD, connections, properties forms
- Serialization, autosave, undo/redo, run simulation
- Smart routing / auto-layout

## Consistency Check
- Matches requirements FR-01, FR-14, FR-16 for Phase 1
- Aligns with US-1.1, US-1.2, US-1.3
- No unauthorized libraries
- No History component (explicit deferral)
- No scope creep beyond confirmed catalog

## Extension Notes
- Resiliency: Low criticality; no infra services in design
- PBT: Pure domain serialize/validate modules planned for later units; facade keeps logic testable
- Security extension: disabled

## Next Stage
Units Generation — decompose into construction units with Unit 1 = Phase 1 shell/seed
