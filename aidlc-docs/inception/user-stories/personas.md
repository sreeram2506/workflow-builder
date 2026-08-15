# Personas — Angular Workflow Builder

## Persona Map

| ID | Name | Mode focus | Primary goals |
|---|---|---|---|
| P-AUTHOR | Workflow Author | Edit (default) | Design, connect, configure, simulate, export workflows |
| P-REVIEWER | Workflow Reviewer | View / read-only | Inspect layout and configuration without changing the graph |

---

## P-AUTHOR — Workflow Author

### Profile
- **Role**: Internal builder / automation designer using the workflow canvas daily
- **Environment**: Desktop evergreen browser; dark theme preferred by default
- **Skill level**: Comfortable with visual editors; not required to write code

### Goals
- Assemble a workflow from palette nodes quickly
- Connect steps correctly and configure node properties
- Validate flow with simulated Run
- Export/import JSON for sharing within the team
- Undo mistakes and copy/paste nodes while editing

### Frustrations
- Losing work unexpectedly (must understand in-memory auto-save does not survive refresh)
- Opaque connection rules
- Cluttered canvas when zoomed or densely connected

### Success looks like
- Can go from seeded canvas → edited graph → Run → exported JSON without leaving the SPA
- Controls feel close to workflowbuilder.io layout and interaction patterns

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

## Persona ↔ Capability Focus

| Capability area | P-AUTHOR | P-REVIEWER |
|---|---|---|
| Shell / theme | Primary | Secondary (inspect) |
| Canvas navigation | Primary | Primary |
| Palette / create nodes | Primary | Locked |
| Connections / reshape | Primary | Locked |
| Properties edit | Primary | Read-only inspect |
| History / clipboard | Primary | Locked |
| Import/export | Primary | Export may be allowed; import locked unless later approved |
| Run simulation | Primary | Allowed if non-mutating display only |
| View mode toggle | Primary (enter/exit) | Primary (remain in view) |
| Solution palette Blank Agent | Primary | Locked add |
| Nested skills canvas | Primary | Read-only navigate + Back |
| Mock skills placement | Primary | Locked |
