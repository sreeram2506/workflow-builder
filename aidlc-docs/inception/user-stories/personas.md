# Personas — Angular Workflow Builder

## Persona Map

| ID | Name | Mode focus | Primary goals |
|---|---|---|---|
| P-AUTHOR | Workflow Author | Edit (default) | Design, connect, configure, simulate, export workflows |
| P-REVIEWER | Workflow Reviewer | View / read-only | Inspect layout and configuration without changing the graph |
| P-HOST | Host Integrator | Embed / configure | Chrome flags, palette types, default agents, catalog adapters |

---

## P-AUTHOR — Workflow Author

### Profile
- **Role**: Internal builder / automation designer using the workflow canvas daily
- **Environment**: Desktop evergreen browser; dark theme preferred by default
- **Skill level**: Comfortable with visual editors; not required to write code

### Goals
- Assemble a workflow from the palette types the host allows
- See named default agents when the host replaced Blank Agent
- See extra host Condition / Router / Repeater cards (with icons) in the featured strip when the host supplies them
- Drop a host card and keep its metadata on the node for the host product to read
- Connect steps correctly and configure node properties
- Validate flow with simulated Run
- Export/import JSON for sharing within the team
- Undo mistakes and copy/paste nodes while editing

### Frustrations
- Losing work unexpectedly (must understand in-memory auto-save does not survive refresh)
- Opaque connection rules
- Types in the library that their host product does not use
- Blank Agent label that does not match the host product’s language

### Success looks like
- Can go from seeded canvas → edited graph → Run → exported JSON without leaving the SPA
- Controls feel close to workflowbuilder.io layout and interaction patterns
- Palette only shows host-allowed types and host default agent names

---

## P-REVIEWER — Workflow Reviewer

### Profile
- **Role**: Peer or stakeholder reviewing a workflow design
- **Environment**: Same SPA; explicitly uses view / read-only mode
- **Skill level**: Understands workflow semantics; should not accidentally mutate graph

### Goals
- Open/view an existing in-memory workflow state
- Pan/zoom/inspect nodes and edges safely
- Confirm configuration via properties panel in read-only presentation
- Optionally observe a simulated Run if enabled in view mode (if Run remains available; must not mutate structure)

### Frustrations
- Accidental edits while reviewing
- Unclear visual distinction between edit and view mode

### Success looks like
- View mode locks palette drag, node move, edge draw, property edits, and destructive actions
- Can still navigate the canvas (pan/zoom/minimap) to inspect

---

## P-HOST — Host Integrator

### Profile
- **Role**: Platform / product engineer embedding Workflow Builder in another Angular (or future host) application
- **Environment**: Host app codebase + Workflow Builder SPA/config assets
- **Skill level**: Comfortable with Angular providers, JSON config, and feature flags

### Goals
- Turn chrome regions and actions on/off without forking Workflow Builder
- Restrict Condition / Router / Repeater / Blank Agent (and other types) per canvas via allow-lists
- Replace Blank Agent with one or more named default agent cards
- Inject a catalog adapter so extra APIs fill Agents or Skills lists
- Bind `[palettes]`, `[defaultAgents]`, and **`[ui]`** on `wb-shell-layout` / `wb-agent-skills-shell` like Syncfusion instance props
- Supply extra Condition / Router / Repeater cards (with `iconUrl` / `iconPath` and `metadata`) so the featured strip shows host logic shapes
- Attach `metadata` on default agents and palettes so dropped nodes keep it in `node.data`
- Chrome flags via JSON / `provideWorkflowBuilderUi` **and** per-instance `[ui]` override
- Keep full chrome and today’s palette when no config is supplied (safe default)
- Document embed API for other teams

### Frustrations
- Having to fork UI to hide Save / libraries / properties / unused logic nodes
- Unclear merge precedence between JSON, provider, and `[ui]`
- Secrets accidentally committed in demo config
- Mock agents appearing when a real catalog API fails
- Having to use bootstrap DI only, with no instance inputs on the host tag

### Success looks like
- Partial JSON + provider + `[ui]` deep-merge yields predictable UI
- Authors only see enabled chrome; shortcuts follow the same flags
- Invalid JSON soft-fails to full defaults with a non-blocking status
- Allow-lists and defaultAgents are predictable; adapters are provider-only
- Catalog failure shows static defaults and a banner, not mock agents
- Parent `[palettes]` / `[defaultAgents]` / `[ui]` work like Syncfusion instance props
- Extra logic cards replace the three built-in featured shapes when `[palettes]` is present
- Library icons and drop metadata match the parent payload (unsafe URLs never render)

---

## Persona ↔ Capability Focus

| Capability area | P-AUTHOR | P-REVIEWER | P-HOST |
|---|---|---|---|
| Shell / theme | Primary | Secondary (inspect) | Configures flags |
| Canvas navigation | Primary | Primary | Configures canvas/overlays |
| Palette / create nodes | Primary | Locked | Allow-list types; defaultAgents; catalog adapter |
| Connections / reshape | Primary | Locked | — |
| Properties edit | Primary | Read-only inspect | Configures properties panel |
| History / clipboard | Primary | Locked | — |
| Import/export / Save | Primary | Export may be allowed | Configures top-bar actions |
| Run simulation | Primary | Allowed if non-mutating | Configures Run control |
| View mode toggle | Primary (enter/exit) | Primary (remain in view) | Configures edit/view control |
| Solution Agents Library | Primary | Locked add | Configures Agents Library |
| Nested Skills Library | Primary | Read-only navigate + Back | Configures Skills Library |
| Palette type allow-list / default agents | Sees filtered library | Sees result | Primary |
| Catalog adapter (agents/skills APIs) | Sees adapter rows | Sees result | Primary |
| Host `[palettes]` / `[defaultAgents]` / `[ui]` inputs | Sees parent cards / chrome | Sees result | Primary |
| Extra logic cards + library icons + drop metadata | Sees host strip / icons / node.data | Sees result | Primary |
| UI feature flags / embed provider | Sees result | Sees result | Primary |
