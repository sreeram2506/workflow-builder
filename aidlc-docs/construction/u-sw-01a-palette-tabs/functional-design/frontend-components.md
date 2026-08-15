# Frontend Components — U-SW-01a Palette + Agent Tabs

## Hierarchy

```text
ShellLayoutComponent
  TopBarComponent
    └── AgentTabsStrip (inline or child)
          └── AgentTabChip (label + × + focused state)
  LeftSidebarComponent
    └── Featured strip (Condition / Router / Repeater)
    └── BlankAgentCard row (NEW — under strip)
    └── Categories / search (existing; exclude AIAgent from category lists)
  Canvas
    └── WorkflowNodeComponent
          └── dblclick → openAgentTab (AIAgent only)
```

---

## Component specs

### LeftSidebar — Blank Agent row

| Concern | Behavior |
|---|---|
| Placement | Directly under featured logic shapes row |
| Interaction | Same drag + click-to-add as other palette items |
| View mode | Disabled / non-draggable (existing pattern) |
| Catalog | `findPaletteItem('AIAgent')` / dedicated getter `blankAgentItem()` |

### WorkflowNodeComponent

| Concern | Behavior |
|---|---|
| `dblclick` | If `type === 'AIAgent'` → `facade.openAgentTab(id)`; stop propagation as needed |
| Other types | No tab action |
| Single click | Unchanged |

### AgentTabsStrip (TopBar)

| Concern | Behavior |
|---|---|
| Render | One chip per open tab; title from facade/node label |
| Focused | Visual active state for `focusedNodeId` |
| Click chip | Focus tab only in P0 (no route) — optional select node on canvas |
| × | `facade.closeAgentTab(nodeId)` |
| Empty | Strip hidden or empty placeholder — prefer hide when no tabs |

### WorkflowFacade / UiStore

| Method | Behavior |
|---|---|
| `openAgentTab(nodeId)` | Validate AIAgent exists; focus or append with FIFO; set focused |
| `closeAgentTab(nodeId)` | Remove; reassign focus per BR-SW01A-07 |
| `agentTabs()` / `focusedAgentTabId()` | Read model for strip |
| Node delete path | Drop matching tabs |

---

## Interaction notes

- P0 tab **click** does not navigate (01b wires route)
- Prefer selecting the Blank Agent on canvas when focusing its tab (nice-to-have; not blocking)

---

## Story coverage

| Story / scope | Coverage |
|---|---|
| US-SW-01 | Featured strip + Blank Agent below + create |
| 01a tab chrome | Dblclick → tab, max 5 FIFO, close ×, view open, live label |
| US-SW-02 nested | **Not** this unit |
