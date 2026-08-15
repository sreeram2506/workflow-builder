# Components — Solution Workflow Increment

**Additive to** existing `components.md` (U1 shell). Does not replace prior catalog.  
**Unit focus**: U-SW-01 = P0 + P1 (palette Blank Agent + tab/route nested skills list)

---

## Component Catalog (new / extended)

| ID | Name | Layer | Role |
|---|---|---|---|
| C-SW-PALETTE | LeftSidebar / palette catalog (extend) | features/shell | Restore Blank Agent below featured Condition/Router/Repeater |
| C-SW-NODE | WorkflowNodeComponent (extend) | features/canvas | Emit dblclick for `AIAgent` → open agent tab (no immediate navigate) |
| C-SW-TABS | AgentTabsStrip (new or TopBar region) | features/shell | Show open agent tabs; click selects tab → navigate nested route |
| C-SW-TOPBAR | TopBarComponent (extend) | features/shell | Host tabs strip + **Back** when on agent route |
| C-SW-NEST-LIB | NestedSkillsLibraryComponent (new) | features/shell or features/agent | Mock skills catalog (cards) |
| C-SW-NEST-PANEL | NestedSkillsPanelComponent (new) | features/shell or features/agent | Selected skills list/cards for open agent |
| C-SW-NEST-PROPS | RightSidebar (reuse) | features/shell | Properties for agent / focused skill entry in nested context |
| C-SW-SHELL | ShellLayoutComponent (extend) | features/shell | Host router outlet / swap solution canvas vs nested children |
| C-SW-ROUTER | App routes (new) | app config | `/` solution; `/agent/:nodeId` nested skills view |

---

## Responsibilities

### C-SW-PALETTE (extend LeftSidebar)
- Featured strip: Condition, Router, Repeater
- Blank Agent card directly below (copy-on-create)
- Unchanged Flow / Integration / Enso categories

### C-SW-NODE (extend WorkflowNode)
- Single-click: existing select + Properties
- Double-click on `AIAgent`: request open/focus agent tab via facade (stay on solution route)

### C-SW-TABS + C-SW-TOPBAR
- Maintain list of open agent tabs (`nodeId`, label)
- Tab select → navigate to `/agent/:nodeId`
- When nested: show **Back** → navigate to solution route; restore selection on agent when practical

### C-SW-NEST-LIB
- Render static mock skills catalog
- Emit add-skill intent (blocked in view mode)

### C-SW-NEST-PANEL
- Bind to `AIAgent.data.skills` for `:nodeId`
- Select skill entry for Properties focus
- Support remove/reorder only if Functional Design includes them (minimum: add + display)

### C-SW-NEST-PROPS
- Reuse schema/form patterns; agent-level and skill-entry fields as designed in FD

### C-SW-SHELL + C-SW-ROUTER
- Solution route: existing canvas shell children
- Agent route: dedicated nested library + panel + Properties (Q4=B)
- No production auth on routes (out of scope)

---

## Out of scope components

- Nested graph canvas / Skill `WorkflowNode` type
- Deep multi-agent nesting chrome
