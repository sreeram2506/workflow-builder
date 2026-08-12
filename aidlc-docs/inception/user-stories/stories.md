# User Stories — Angular Workflow Builder

**Breakdown**: Feature-based  
**Ordering**: Build Phases 1–10  
**Granularity**: Medium (one story per distinct capability)  
**AC style**: Gherkin for core flows; polish bullets where noted  
**Personas**: P-AUTHOR, P-REVIEWER  
**Phase 7–8**: Epic placeholders only (detailed stories deferred to phase gates)

---

## Persona ↔ Story Mapping

| Story | P-AUTHOR | P-REVIEWER |
|---|---|---|
| US-1.x Shell / seed / theme | ● | ○ |
| US-2.x / US-3.x Canvas navigate & select | ● | ● (navigate/select inspect) |
| US-4.x Palette | ● | Locked in view mode |
| US-5.x Connections | ● | Locked |
| US-6.x Properties | ● | Read-only inspect |
| US-E7 / US-E8 (expanded ACs) | ● | ● |
| US-9.x Serialize / history / autosave | ● | Export optional; mutations locked |
| US-10.x Run | ● | ○ / non-mutating watch |
| US-VM.* View mode | ● toggle | ● consume |

● = primary actor · ○ = secondary / N/A

---

# Phase 1 — Shell, Tokens, Seed

## US-1.1 — Open application shell
**As a** Workflow Author  
**I want** a top bar, left sidebar, canvas area, and right sidebar region  
**So that** I can orient to the editor layout immediately  

**Phase**: 1 · **FR**: FR-01 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given I open the application
When the first screen loads
Then I see a top bar with workflow title and status pill
And I see right-aligned action placeholders for Undo, Redo, Save, and Run
And I see a left sidebar region, a center canvas region, and a right sidebar region
```
- Must match high-fidelity SaaS layout regions inspired by workflowbuilder.io
- Must use CSS custom property design tokens
- Must default to dark theme

## US-1.2 — See seeded mock workflow data
**As a** Workflow Author  
**I want** 4–5 sample nodes and edges loaded from mock data  
**So that** the canvas is not empty on first open  

**Phase**: 1 · **FR**: FR-16 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given the app has started
When the in-memory store initializes
Then the store contains a hardcoded sample workflow with 4–5 nodes and connecting edges
And sample nodes use only v1 types: Trigger, Action, Condition, Delay, End
```
- Must not call a backend or read localStorage

## US-1.3 — Toggle light and dark theme
**As a** Workflow Author  
**I want** to switch between light and dark themes  
**So that** I can work in my preferred appearance  

**Phase**: 1 (tokens) / available ongoing · **FR**: FR-14 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given the app loaded in dark theme
When I switch to light theme
Then canvas, shell, and node chrome update via CSS variables
When I switch back to dark theme
Then the dark tokens apply again
```
- Must not hardcode theme colors outside the token system

---

# Phase 2 — Canvas Navigation

## US-2.1 — Pan the canvas
**As a** Workflow Author  
**I want** to pan the canvas  
**So that** I can move around large workflows  

**Phase**: 2 · **FR**: FR-02 · **Personas**: P-AUTHOR, P-REVIEWER  

**Acceptance criteria**
```
Given I am viewing the canvas
When I pan using the supported pointer gesture
Then the viewport translation updates and grid/content move together
```

## US-2.2 — Zoom the canvas
**As a** Workflow Author  
**I want** zoom controls and wheel/gesture zoom  
**So that** I can inspect detail or see the whole graph  

**Phase**: 2 · **FR**: FR-02 · **Personas**: P-AUTHOR, P-REVIEWER  

**Acceptance criteria**
```
Given I am viewing the canvas
When I zoom in or out via controls or gesture
Then content scales around the expected zoom origin
And zoom level remains within defined min/max bounds
```

## US-2.3 — Use dotted grid background
**As a** Workflow Author  
**I want** a dotted grid on the canvas  
**So that** I have spatial reference while editing  

**Phase**: 2 · **FR**: FR-02 · **Persona**: P-AUTHOR  

**Acceptance criteria**
- Must show a dotted grid that pans/zooms with the viewport
- Must remain readable in dark and light themes

## US-2.4 — Use minimap for navigation
**As a** Workflow Author  
**I want** a minimap  
**So that** I can see overview position and jump the viewport  

**Phase**: 2 · **FR**: FR-02 · **Personas**: P-AUTHOR, P-REVIEWER  

**Acceptance criteria**
```
Given a workflow is loaded
When I interact with the minimap (click/drag viewport indicator as implemented)
Then the main canvas viewport moves to the corresponding area
```

---

# Phase 3 — Render & Selection

## US-3.1 — View custom node cards on canvas
**As a** Workflow Author  
**I want** nodes rendered as cards with icon, label, subtitle, category color, and status badge  
**So that** I can recognize step types at a glance  

**Phase**: 3 · **FR**: FR-04 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given seeded nodes exist in the store
When the canvas renders
Then each node shows icon, label, subtitle, category accent, and status badge
```
- Nodes are HTML cards positioned over SVG graph layer

## US-3.2 — View edges between nodes
**As a** Workflow Author  
**I want** edges drawn between connected nodes  
**So that** I understand flow relationships  

**Phase**: 3 · **FR**: FR-05 (render only) · **Persona**: P-AUTHOR  

**Acceptance criteria**
- Must render edges for seeded connections
- Must remain visible and selectable-highlightable at current zoom

## US-3.3 — Select nodes and see highlight
**As a** Workflow Author  
**I want** to select one or more nodes  
**So that** I can target them for later edit actions  

**Phase**: 3 · **FR**: FR-02 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given nodes are visible
When I click a node
Then it becomes selected with a highlighted border
When I multi-select or lasso-select nodes
Then all matched nodes show selection highlight
```

## US-3.4 — Lasso / marquee select
**As a** Workflow Author  
**I want** marquee selection  
**So that** I can select a group of nodes quickly  

**Phase**: 3 · **FR**: FR-02 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given I am in edit mode on the canvas
When I drag a marquee over nodes
Then nodes intersecting the marquee become selected
```

---

# Phase 4 — Palette

## US-4.1 — Browse categorized palette
**As a** Workflow Author  
**I want** a categorized, searchable node library  
**So that** I can find Trigger, Action, Condition, Delay, and End  

**Phase**: 4 · **FR**: FR-03 · **Persona**: P-AUTHOR  

**Acceptance criteria**
- Must list only approved v1 types
- Must support category collapse/expand and search filtering

## US-4.2 — Drag node from palette to canvas
**As a** Workflow Author  
**I want** to drag a palette item onto the canvas  
**So that** a new node is created at the drop position  

**Phase**: 4 · **FR**: FR-03 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given I am in edit mode
When I drag a palette node type and drop it on the canvas
Then a new node of that type is added to the in-memory store
And it appears at the drop location in canvas coordinates
```
- Palette DnD uses `@angular/cdk/drag-drop` only (not for moving existing canvas nodes)

---

# Phase 5 — Connections

## US-5.1 — Connect nodes via handles
**As a** Workflow Author  
**I want** source and target handles  
**So that** I can draw edges between steps  

**Phase**: 5 · **FR**: FR-05 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given two nodes are on the canvas in edit mode
When I drag from a source handle to a valid target handle
Then a new edge is created in the store and rendered
```

## US-5.2 — Reject invalid connections
**As a** Workflow Author  
**I want** invalid connections blocked  
**So that** the graph stays well-formed  

**Phase**: 5 · **FR**: FR-05 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given I attempt a connection in the wrong direction or to an invalid target (e.g., self-loop per Phase 5 rules)
When I complete the gesture
Then no edge is created
And I receive clear visual feedback that the connection is invalid
```
- v1 typing = direction only; any valid source may connect to any valid target

## US-5.3 — Reshape edges with waypoints
**As a** Workflow Author  
**I want** to drag edge waypoints that snap to grid  
**So that** I can improve edge readability manually  

**Phase**: 5 / 8-adjacent capability from FR-09 · **FR**: FR-09 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given an edge is selected in edit mode
When I drag a waypoint
Then the edge path updates and the waypoint snaps to the grid
```

---

# Phase 6 — Properties Panel

## US-6.1 — Edit selected node via schema form
**As a** Workflow Author  
**I want** a right-sidebar form generated from the node type schema  
**So that** I can configure the selected node  

**Phase**: 6 · **FR**: FR-08 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given a node is selected in edit mode
When the properties panel opens
Then fields are generated from that node type’s JSON schema and grouped by section
When I change a field value
Then the selected node’s data in the store updates live
```
- Must use reactive forms
- Exact field lists must be confirmed before inventing new fields (stop-and-ask)

## US-6.2 — Inspect properties in view mode
**As a** Workflow Reviewer  
**I want** to see property values without editing them  
**So that** I can review configuration safely  

**Phase**: 6 + view mode · **FR**: FR-08, FR-13 · **Persona**: P-REVIEWER  

**Acceptance criteria**
```
Given view mode is active and a node is selected
When the properties panel is shown
Then values are visible
And inputs are disabled / non-editable
```

---

# Phase 7 — Smart Edge Routing

## US-E7 — Route edges (obstacle-aware)
**As a** Workflow Author  
**I want** an explicit “Route edges” action that computes obstacle-aware paths  
**So that** connections stay readable without manually dragging every waypoint  

**Phase**: 7 · **FR**: FR-06 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given a workflow with nodes and edges on the canvas
When I click “Route edges”
Then each edge’s waypoints are replaced with a medium obstacle-aware route (hand-rolled grid/A* or equivalent)
And node AABBs are treated as obstacles (excluding the edge’s own ports)
And routing does not run on node-move debounce or live during drag
And if a path cannot be found for an edge, that edge falls back to the existing horizontal bezier without throwing
And in view mode the Route control is disabled / no-op
```

## US-E7.1 — Reshape after auto-route
**As a** Workflow Author  
**I want** to reshape waypoints after routing  
**So that** I can fine-tune paths the auto-router produced  

**Phase**: 7 · **FR**: FR-06 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given Route edges has replaced waypoints
When I drag waypoints / use U4 reshape gestures
Then the edge updates like any hand-edited multi-waypoint edge
And a later Route edges run again replaces those waypoints
```

---

# Phase 8 — Auto-Layout

## US-E8 — One-click layouts
**As a** Workflow Author  
**I want** Vertical, Horizontal, and Layered one-click layouts  
**So that** I can tidy graph positions without a layout library  

**Phase**: 8 · **FR**: FR-07 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given a workflow with multiple nodes
When I choose Layout ▾ → Vertical
Then nodes are packed along Y with fixed spacing (hand-rolled; no new npm deps)
When I choose Layout ▾ → Horizontal
Then nodes are packed along X with fixed spacing
When I choose Layout ▾ → Layered
Then nodes are ranked left→right via BFS from indegree-0 / Trigger-like sources, stacked within rank on Y
And in view mode Layout controls are disabled / no-op
```

## US-E8.1 — Layout then auto-route
**As a** Workflow Author  
**I want** applying a layout to also route edges once  
**So that** positions and paths update together  

**Phase**: 8 · **FR**: FR-07 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given I apply any layout mode (Vertical, Horizontal, or Layered)
When layout finishes updating node positions
Then Route edges runs once automatically (same behavior as US-E7)
And I can still click Route edges alone later without re-layout
```

---

# Phase 9 — Serialization, Auto-Save, History

## US-9.1 — Export workflow JSON
**As a** Workflow Author  
**I want** to export the current workflow as JSON  
**So that** I can download or paste it elsewhere  

**Phase**: 9 · **FR**: FR-10 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given a workflow exists in memory
When I export JSON
Then I receive a complete serializable blob of nodes, edges, and relevant viewport/metadata
And no backend call is made
```

## US-9.2 — Import workflow JSON
**As a** Workflow Author  
**I want** to import a JSON workflow  
**So that** I can restore or share graphs in-session  

**Phase**: 9 · **FR**: FR-10 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given valid workflow JSON
When I import it
Then the in-memory store replaces/loads that graph on the canvas
Given invalid JSON shape
When I import it
Then the load is rejected with a clear error and prior state is preserved
```

## US-9.3 — Debounced in-memory auto-save
**As a** Workflow Author  
**I want** edits auto-saved into the in-memory store  
**So that** Save reflects current state during the session  

**Phase**: 9 · **FR**: FR-11 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given I edit the graph
When the debounce interval elapses
Then the in-memory store snapshot is updated
```
- Must document that refresh clears state (no localStorage)

## US-9.4 — Undo and redo edits
**As a** Workflow Author  
**I want** undo/redo with keyboard shortcuts  
**So that** I can reverse mistakes  

**Phase**: 9 · **FR**: FR-12 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given I have made graph changes
When I undo
Then the previous store snapshot is restored
When I redo
Then the undone change is reapplied
```

## US-9.5 — Copy and paste nodes
**As a** Workflow Author  
**I want** copy/paste with keyboard shortcuts  
**So that** I can duplicate steps quickly  

**Phase**: 9 · **FR**: FR-12 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given one or more nodes are selected in edit mode
When I copy and paste
Then duplicate nodes appear offset on the canvas and are selected
```

---

# Phase 10 — Simulated Run

## US-10.1 — Simulate run over mock graph
**As a** Workflow Author  
**I want** the Run action to walk the mock graph and animate status  
**So that** I can demo execution without a real engine  

**Phase**: 10 · **FR**: FR-15 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given a connected mock workflow
When I click Run
Then node status badges update in walk order
And the simulation does not call a backend
```

---

# View Mode (dedicated)

## US-VM.1 — Enter read-only view mode
**As a** Workflow Author  
**I want** to switch the canvas to view mode  
**So that** reviewers (or I) cannot accidentally edit  

**Phase**: cross-cutting (shell + FR-13) · **Personas**: P-AUTHOR, P-REVIEWER  

**Acceptance criteria**
```
Given the app is in edit mode
When I enable view mode
Then a clear view-mode indicator is shown
And edit interactions are locked
```

## US-VM.2 — Locked controls in view mode
**As a** Workflow Reviewer  
**I want** mutating controls disabled in view mode  
**So that** the graph cannot change while I inspect it  

**Phase**: cross-cutting · **FR**: FR-13 · **Persona**: P-REVIEWER  

**Acceptance criteria**
- Must lock: palette drag-create, node move, edge draw/reshape, property edits, import that replaces graph, destructive delete
- Must allow: pan, zoom, minimap navigation, selection for inspect, theme viewing
- Must keep Run non-mutating if exposed (status animation only; no structural changes)

## US-VM.3 — Return to edit mode
**As a** Workflow Author  
**I want** to leave view mode  
**So that** I can continue editing  

**Phase**: cross-cutting · **FR**: FR-13 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```
Given view mode is active
When I switch back to edit mode
Then previously locked editing controls become available again
```

---

## Requirements Traceability (summary)

| FR | Stories |
|---|---|
| FR-01 | US-1.1 |
| FR-02 | US-2.1–2.4, US-3.3–3.4 |
| FR-03 | US-4.1–4.2 |
| FR-04 | US-3.1 |
| FR-05 | US-3.2, US-5.1–5.2 |
| FR-06 | US-E7, US-E7.1 |
| FR-07 | US-E8, US-E8.1 |
| FR-08 | US-6.1–6.2 |
| FR-09 | US-5.3 |
| FR-10 | US-9.1–9.2 |
| FR-11 | US-9.3 |
| FR-12 | US-9.4–9.5 |
| FR-13 | US-VM.1–3, US-6.2 |
| FR-14 | US-1.3 |
| FR-15 | US-10.1 |
| FR-16 | US-1.2 |

---

## INVEST Check
- **Independent**: Stories slice by capability; Phase 7–8 deferred as epics to avoid false precision
- **Negotiable**: AC allow phase-gate refinement without inventing unapproved fields/types
- **Valuable**: Each story delivers user-visible editor capability
- **Estimable**: Medium size aligned to phase delivery
- **Small**: One capability per story
- **Testable**: Gherkin/core bullets are observable in UI
