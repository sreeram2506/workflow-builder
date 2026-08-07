# Business Logic Model — U1

## Purpose
Define the bootstrap and shell-state flows for Phase 1: load mock workflow into memory, present shell chrome, manage theme and sidebar collapse — without canvas interaction.

## Actors
- System (bootstrap)
- Workflow Author (P-AUTHOR) interacting with shell/theme only

## Flow 1 — Application Bootstrap / Seed Load

```text
App start
  -> provide stores + facade
  -> WorkflowFacade.initialize()
       -> MockWorkflowRepository.getSampleWorkflow()
       -> GraphStore.setDocument(doc)   // includes viewport, version, updatedAt
       -> UiStore.resetSessionDefaults(theme=dark, mode=edit, sidebars expanded, selection empty)
  -> Shell renders from facade selectors
```

### Outputs
- GraphStore holds 5 nodes + 4 edges (branch topology)
- Top bar shows `doc.name` + status `draft`
- Theme attribute/class = dark

## Flow 2 — Toggle Theme

```text
User clicks ThemeToggle
  -> WorkflowFacade.toggleTheme()
  -> UiStore.theme flips dark <-> light
  -> Apply data-theme (or class) on documentElement
  -> Shell/canvas tokens update via CSS variables
```

### Rules
- No persistence beyond session (BR-U1-02)

## Flow 3 — Collapse Sidebar

```text
User clicks collapse on left or right
  -> WorkflowFacade.setLeftCollapsed(bool) / setRightCollapsed(bool)
  -> ShellLayout adjusts CSS grid/flex
  -> Placeholder empty state remains when expanded
```

## Flow 4 — Disabled Top Actions

```text
User focuses/hovers Undo|Redo|Save|Run
  -> Button disabled=true
  -> Tooltip: coming in later phase
  -> No facade calls
```

## Non-flows (explicitly excluded from U1)
- Pan/zoom/lasso/select
- Render nodes/edges on canvas
- Create/update/delete graph elements from UI
- Import/export, autosave debounce UI, undo stack
- Run simulation

## State Ownership
| Concern | Owner |
|---|---|
| WorkflowDocument | GraphStore via Facade |
| Theme, sidebars, mode, selection shell | UiStore via Facade |
| Seed source | MockWorkflowRepository (static) |

## Traceability
| Story | Flows |
|---|---|
| US-1.1 | Flow 1, 3, 4 |
| US-1.2 | Flow 1 |
| US-1.3 | Flow 2 |
