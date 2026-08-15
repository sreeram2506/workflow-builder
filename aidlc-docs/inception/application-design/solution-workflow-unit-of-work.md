# Unit of Work — Solution Workflow Increment

**Parent label**: Solution Workflow  
**Deployment model**: Same monolith Angular SPA (reintroduce Router; no new package)  
**Unit meaning**: Two logical construction modules after U9  
**Sequencing**: **Strict** — U-SW-01b starts only after U-SW-01a Build/Test approved  
**Application Design**: `solution-workflow-application-design.md`  
**Override note**: Verification Q3 originally said P0+P1 in one unit; Units Planning locked **two sequential units** (U-SW-01a / U-SW-01b)

Original U1–U9 catalogs are unchanged (`unit-of-work.md`, `logic-nodes-unit-of-work.md`).

---

## Code organization (brownfield)

Extend existing folders. Prefer `features/shell` + `core/domain` (+ optional `features/agent` for nested children).

```text
src/app/
  app.config.ts                 # provideRouter (U-SW-01b; stub routes may land late in 01a only if needed)
  core/domain/
    palette.catalog.ts          # restore AIAgent / Blank Agent under featured strip (01a)
    mock-skills.catalog.ts      # NEW static mock skills (01b)
    agent-skills.ts             # NEW data.skills helpers (01b)
  core/facade/
    workflow.facade.ts          # openAgentTab (01a); selectAgentTab/Back/addSkill (01b)
  core/stores/
    ui.store.ts                 # open agent tabs list (01a+)
  features/shell/
    left-sidebar.component.ts   # Blank Agent card (01a)
    top-bar.component.ts        # AgentTabsStrip + Back (01a tabs; 01b Back/route)
    shell-layout.component.ts   # router outlet / nested children (01b)
  features/canvas/
    workflow-node.component.ts  # dblclick → openAgentTab (01a)
  features/agent/               # OPTIONAL NEW for NestedSkillsLibrary / Panel (01b)
```

Units do not create a new Angular project or deployable.

---

## Unit Catalog (this increment)

### U-SW-01a — Solution Palette + Agent Tabs (P0)

| Field | Value |
|---|---|
| **Id** | `u-sw-01a-palette-tabs` |
| **Stories** | US-SW-01; tab chrome supporting P1 (not US-SW-02 until 01b) |
| **Responsibility** | Featured Condition/Router/Repeater + Blank Agent below; create `AIAgent` on canvas; dblclick opens/focuses agent tab in top bar; stay on solution canvas |
| **Primary components** | LeftSidebar palette, WorkflowNode dblclick, TopBar tabs strip, UiStore tabs, Facade.openAgentTab |
| **Depends on** | U1 shell/stores, U2 canvas, U9 logic featured strip |
| **Out of scope** | Nested `/agent/:nodeId` view, skills catalog, `data.skills` mutations, Back-to-solution from nested |
| **Internal order** | palette restore → node dblclick → tab state UI → tests |
| **PBT** | Minimal; any pure tab-id helpers if introduced |
| **Done when** | US-SW-01 AC pass; tabs appear on dblclick; `npm test` / `npm run build` for 01a slice |

### U-SW-01b — Nested Agent Skills (P1)

| Field | Value |
|---|---|
| **Id** | `u-sw-01b-nested-skills` |
| **Stories** | US-SW-02, US-SW-03, US-SW-04, US-SW-05 |
| **Responsibility** | Tab select → `/agent/:nodeId`; dedicated nested library + skills list/cards; `AIAgent.data.skills[]`; Back in top bar; Properties + view-mode locks |
| **Primary components** | Router, Shell nested children, NestedSkillsLibrary/Panel, Facade select/Back/addSkill, agent-skills domain |
| **Depends on** | **U-SW-01a** (strict), U1/U5 Properties patterns, U9 view-mode patterns |
| **Out of scope** | Live skills API, nested skills graph/Skill NodeType, multi-level nesting, production route auth |
| **Internal order** | routes + shell swap → mock catalog → data.skills helpers → add/list UI → Back + persist → Properties/view → tests/PBT |
| **PBT** | Partial on catalog filter / skills array append-dedupe |
| **Done when** | US-SW-02..05 AC pass; in-session skills persist; suites green |

---

## Construction Rule

After Units Generation approval, CONSTRUCTION runs **U-SW-01a first** (Functional Design → Code Generation → Build and Test), then **only after approval** starts **U-SW-01b** the same way. NFR Requirements/Design and Infrastructure Design stay SKIP per execution plan.
