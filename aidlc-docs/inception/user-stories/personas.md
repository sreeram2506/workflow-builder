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
- See an empty Agents / Skills library when the host did not bind `[palettes]` and did not inject a catalog adapter
- See nested Skills Library cards that match the agent-shell `[palettes]` (or empty when those palettes are omitted / `[]`)
- Configure Repeater Properties without dummy Claims / Policy / Notify workflow options
- Drop a host card and keep its metadata on the node for the host product to read
- Configure host `propertiesSchema` / unified `properties` fields in Properties (Save writes `node.data.properties` paths)
- See extra keys in `node.data.properties` with inferred Dynamic Property controls
- Add a new property key in Properties only when the host enabled `propertiesPanel.addProperty`
- Keep using the standalone SPA demo after the library is extracted
- See General only (no Ignore Keys, no flattened blob) on Action/Trigger when the host did not supply a schema
- Keep Condition / Router / Repeater built-in configuration when the host did not supply a schema (dynamic keys additional; collisions omit the dynamic duplicate)
- Connect steps correctly and configure node properties
- See a host-loaded `[document]` on the canvas (not only the SPA empty graph)
- Save still downloads JSON when the host did not supply a Save handler; Run still simulates when the host did not supply a Run handler
- Double-click a Blank Agent / AIAgent to open its nested canvas even when the host hid the agent tab bar, unless the host set `agentTabs.doubleClick` false
- Return from nested canvas via tab Solution chip (bar on) or nested Back / Solution (bar off)
- Validate flow with simulated Run
- Export/import JSON for sharing within the team
- Undo mistakes and copy/paste nodes while editing

### Frustrations
- Losing work unexpectedly (must understand in-memory auto-save does not survive refresh)
- Opaque connection rules
- Types in the library that their host product does not use
- Dummy nested skills or Repeater workflow names that are not real catalog data
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
- Confirm configuration via properties panel in read-only presentation (including host schema fields and inferred dynamic keys)
- Open a nested agent in view via double-click when `agentTabs.doubleClick` is true (read nested canvas; no structural edits); view dblclick does not enter when the flag is false
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
- Inject a catalog adapter so extra APIs fill Agents or Skills lists (no built-in Enso HTTP)
- Omit `[palettes]` (and no adapter) so the library is empty-remote; bind `[palettes]` when authors should see cards
- Pass the same `[palettes]` on `wb-agent-skills-shell` so nested Skills Library matches the agent shell
- Bind `[palettes]`, `[defaultAgents]`, and **`[ui]`** on `wb-shell-layout` / `wb-agent-skills-shell` like Syncfusion instance props
- Supply extra Condition / Router / Repeater cards (with `iconUrl` / `iconPath` and `metadata`) so the featured strip shows host logic shapes
- Attach `metadata` on default agents and palettes so dropped nodes keep it in `node.data`
- Pass optional `propertiesSchema` on palette items (copied onto the node) and/or `provideWorkflowBuilderUi({ properties })` so Properties is host-driven
- Seed and update `node.data.properties` as the value map; enable `propertiesPanel.addProperty` when authors may add keys
- Hide the agent tab strip (`agentTabs.enabled`) without blocking double-click enter or nested Back
- Turn canvas double-click enter on or off via `agentTabs.doubleClick` (default true; independent of the strip)
- Bind `[document]` and `(documentChange)` so the host owns persistence
- Optionally hook Save and Run (`persist.save` / `persist.run`) so blob download and simulated Run are not used
- Place the shell in a fixed-height panel and have it fill that box (`height: 100%`)
- **`npm install enso-workflow-builder`** (or a local tarball) instead of copying `src/app`
- Import `wb-shell-layout` / `provideWorkflowBuilderUi` / `WorkflowFacade` from the package
- Include package styles/tokens as documented
- Keep host blobs opaque (`taskMeta`); this package must not flatten them into a fake form
- Chrome flags via JSON / `provideWorkflowBuilderUi` **and** per-instance `[ui]` override
- Keep full chrome when no UI config is supplied (safe default); omitted `[palettes]` with no adapter is empty-remote, not a built-in catalog
- Document embed API for other teams

### Frustrations
- Having to fork UI to hide Save / libraries / properties / unused logic nodes
- Unclear merge precedence between JSON, provider, and `[ui]`
- Secrets accidentally committed in demo config or SPA `environment.ts`
- Built-in Enso catalog HTTP, proxy, or stored credentials in this SPA
- Mock agents appearing when a real catalog API fails
- Having to use bootstrap DI only, with no instance inputs on the host tag

### Success looks like
- Partial JSON + provider + `[ui]` deep-merge yields predictable UI
- Authors only see enabled chrome; shortcuts follow the same flags
- Invalid JSON soft-fails to full defaults with a non-blocking status
- Allow-lists and defaultAgents are predictable; adapters are provider-only
- Catalog adapter failure shows static defaults and a banner, not mock agents (no Enso HTTP path)
- Default SPA with omitted `[palettes]` and no adapter shows empty-remote, not Enso or static featured catalog
- Nested Skills Library uses agent-shell `[palettes]`, not a dummy skills catalog
- Parent `[palettes]` / `[defaultAgents]` / `[ui]` work like Syncfusion instance props
- Extra logic cards replace the three built-in featured shapes when `[palettes]` is present
- Library icons and drop metadata match the parent payload (unsafe URLs never render)
- Properties schema on palettes / adapter renders generic fields bound to `node.data.properties`; inferred extras work; no Enso-named public API; blobs stay uninterpreted
- `agentTabs.enabled` false hides the strip; double-click still opens `/agent/:id` when `doubleClick` is true; nested Back still returns
- `agentTabs.doubleClick: false` stops canvas dblclick enter; chip click still enters when the strip is on; both false means no builder enter
- `[document]` loads a graph; invalid payload keeps last good + status
- Save/Run handlers receive the document when set; otherwise download / simulate remain
- Shell fills the host panel (`100%`), not `100vh`
- Can install `enso-workflow-builder` and import the public API (no `src` copy)

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
| Empty-when-omit library (no Enso HTTP) | Sees empty-remote or host/adapter cards | Sees result | Primary |
| Nested skills from agent-shell `[palettes]` | Sees matching nested list | Sees result | Primary |
| Repeater Properties catalog | Sees empty pickers (no dummy workflows) | Read-only inspect | — |
| Host properties schema / adapter | Sees schema fields or General only | Read-only inspect | Primary |
| Dynamic `node.data.properties` + inference / addProperty | Sees map fields; add when chrome on | Read-only inspect | Primary (`properties` map + chrome) |
| Agent tab bar vs double-click enter | Dblclick / chips / nested Back | View dblclick enter | Primary (`agentTabs.enabled`, `agentTabs.doubleClick`) |
| Host `[document]` / Save / Run hooks / fill-host | Sees loaded graph; Save/Run defaults | View Save still off | Primary |
| npm package `enso-workflow-builder` | Sees result in demo SPA | Sees result | Primary |
| UI feature flags / embed provider | Sees result | Sees result | Primary |
