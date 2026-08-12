# Requirements — Angular Workflow Builder

## Intent Analysis Summary

| Field | Value |
|---|---|
| **User request** | Build a frontend-only Angular Workflow Builder replicating workflowbuilder.io UX; canvas/graph from scratch; mock/in-memory data only |
| **Request type** | New Project (greenfield) |
| **Scope** | System-wide SPA (shell + custom graph engine + palette + properties + history/serialization/run simulation) |
| **Complexity** | Complex |
| **Requirements depth** | Comprehensive |
| **Project criticality** | Low (prototype / internal tool; in-memory state only) |

---

## 1. Product Goal

Deliver an internal, frontend-only visual workflow builder that matches the layout, interaction patterns, and high-fidelity visual design of [workflowbuilder.io](https://workflowbuilder.io) (Synergy Codes), implemented entirely in Angular with a custom canvas/graph engine (no third-party workflow/canvas node libraries unless explicitly approved later).

---

## 2. Confirmed Technical Decisions

| Decision | Choice |
|---|---|
| Framework | Angular (latest stable), standalone components, signals for state |
| Graph rendering | **SVG + HTML node cards** — edges/grid/lasso/minimap in SVG; nodes as positioned HTML |
| Palette DnD | `@angular/cdk/drag-drop` for palette only (not canvas node dragging) |
| Properties forms | `@angular/forms` reactive forms |
| Backend | None |
| Persistence | In-memory signal store only — **not localStorage, not API** |
| Auto-save | Debounced write to in-memory store; **does not survive page refresh** |
| Default theme | Dark |
| Default mode | Edit |
| Handle typing (v1) | Direction only (source vs target); any source may connect to any target |
| Visual fidelity | High fidelity to workflowbuilder.io (spacing, sidebars, control placement) |
| Browser baseline | Modern evergreen desktop (Chrome/Edge/Firefox/Safari latest); no mobile layout goal |
| Build gates | Implement **Phase 1 only**, then stop for review before Phase 2 |
| Node catalog (v1) | Trigger, Action, Condition, Delay, End, Decision, Notification, AI Agent (expanded 2026-08-07 per change request) |
| Forbidden libs | No ngx-vflow, React Flow wrappers, or other canvas/node graph libraries without explicit approval |

---

## 3. Functional Requirements

### FR-01 Layout Shell
- Top bar: workflow title, status pill, undo/redo, Save, Run (actions right-aligned)
- Left sidebar: collapsible categorized node palette with search
- Center: workflow canvas
- Right sidebar: schema-driven properties panel; visible when a node is selected

### FR-02 Visual Workflow Canvas
- Pan and zoom
- Multi-select and lasso/marquee select
- Dotted grid background
- Minimap
- Zoom controls
- Selection highlight (border) on selected nodes/edges

### FR-03 Node Library / Palette
- Categorized node types (v1 catalog below)
- Search filter
- Drag from palette onto canvas via CDK drag-drop
- Drop creates a new node at drop position in canvas coordinates

### FR-04 Custom Nodes
Each node displays:
- Icon
- Label
- Subtitle
- Category accent color
- Status badge

### FR-05 Connections / Handles
- Source and target handles on nodes
- User can draw edges between handles
- Validation (v1): connection must be source → target; reject invalid direction/self-loops as designed during Phase 5
- Typed kinds beyond direction are **out of scope for v1** (confirmed)

### FR-06 Smart Edge Routing
- Auto-route edges to reduce overlaps and remain readable at any zoom
- Complexity level to be confirmed before Phase 7 (stop-and-ask gate)

### FR-07 Auto-Layout
- One-click layout with vertical / horizontal / layered options
- Hand-rolled vs approved utility lib to be confirmed before Phase 8 (stop-and-ask gate)

### FR-08 Schema-Driven Properties Panel
- Right sidebar form fields generated from per-node-type JSON schema
- Live-updates selected node data on edit
- Fields grouped by section

### FR-09 Edge Reshaping
- Drag waypoints on edges
- Snap to grid

### FR-10 JSON Serialization
- Export workflow state as downloadable / pasteable JSON
- Import JSON into canvas state
- No backend call

### FR-11 Auto-Save
- Debounced save into in-memory store (signal-backed service)
- Explicit product limitation: **state is lost on browser refresh**

### FR-12 Undo / Redo / Copy / Paste
- Full history stack
- Keyboard shortcuts

### FR-13 Read-Only / View Mode
- Same canvas; editing controls locked when view mode is active
- Default on load: Edit mode

### FR-14 Theming
- Light and dark themes via CSS custom properties
- Default on first load: Dark

### FR-15 Simulated Run
- Run button walks the mock graph and animates/logs node status changes
- No real workflow execution engine

### FR-16 Seed Data
- Hardcoded JSON/array with 4–5 sample nodes and edges using the v1 node catalog

---

## 4. Node Catalog (v1)

| Type | Role |
|---|---|
| Trigger | Workflow entry |
| Action | Generic processing step |
| Condition | Branching decision |
| Delay | Wait / timer step |
| Decision | Route the workflow |
| Notification | Send alerts or notifications |
| AI Agent | AI-assisted step |
| End | Terminal node |

Catalog expanded 2026-08-07 (Decision, Notification, AI Agent) from reference UI change request. Further types still require explicit approval.

---

## 5. Visual Style Requirements

- Clean minimal SaaS aesthetic aligned with high-fidelity reference to workflowbuilder.io
- Dark theme default; light theme supported via tokens
- Canvas: dotted grid background
- Nodes: card-like HTML surfaces, soft shadows, ~8px rounded corners, category accent color, sans-serif UI font
- Layout regions as specified in FR-01

---

## 6. Non-Functional Requirements

### NFR-01 Performance (desktop editing)
- Canvas interactions (pan/zoom/select/drag) must feel responsive for typical demo graphs (tens of nodes; not thousands)
- Exact FPS targets deferred until NFR stages if executed; flag if from-scratch routing becomes a bottleneck

### NFR-02 Maintainability
- Modular Angular feature structure (shell, canvas, palette, properties, store, history)
- Signals as primary state pattern

### NFR-03 Testability
- Pure graph utilities (serialize/deserialize, connection validation, layout transforms) unit-testable
- Property-based tests required for round-trips / invariants under Partial PBT mode (see Extensions)

### NFR-04 Accessibility (baseline)
- Keyboard shortcuts for undo/redo/copy/paste as specified
- Broader a11y audit not required for v1 unless later approved

### NFR-05 Security
- Security Baseline extension: **disabled** for this project
- Still: no secrets in repo; import JSON treated as untrusted structure (validate shape before applying)

### NFR-06 Resiliency / Availability
- Workload criticality: **Low** (prototype)
- RTO/RPO/DR: **N/A** for this phase (frontend-only, in-memory, no multi-region)
- No production HA/DR infrastructure in scope

### NFR-07 Compatibility
- Evergreen desktop browsers only; desktop-first; no mobile layout goal

---

## 7. Explicit Out of Scope (v1)

- Backend / APIs / auth
- localStorage or any cross-refresh persistence
- Real workflow execution
- Mobile / tablet responsive layouts
- Third-party canvas/workflow libraries (unless later explicitly approved)
- Additional node types beyond the locked v1 catalog (unless approved)
- Port-kind typing beyond source/target direction
- Pixel-perfect cloning of proprietary assets not available for reuse (approximate with high-fidelity layout/spacing/behavior)

---

## 8. Phased Delivery (Build Order)

| Phase | Scope | Gate |
|---|---|---|
| 1 | Angular scaffold, layout shell, design tokens, mock seed (4–5 nodes/edges) | Stop for review |
| 2 | Canvas: pan, zoom, grid | Explicit confirmation |
| 3 | Render mock nodes/edges, selection highlight | Explicit confirmation |
| 4 | Palette + drag-to-canvas (v1 types only) | Explicit confirmation |
| 5 | Handles, drawing edges, basic validation | Explicit confirmation |
| 6 | Schema-driven properties panel | Explicit confirmation |
| 7 | Smart edge routing (ask complexity first) | Explicit confirmation |
| 8 | Auto-layout (ask hand-rolled vs lib) | Explicit confirmation |
| 9 | Export/import JSON, in-memory auto-save, undo/redo | Explicit confirmation |
| 10 | Simulated Run (status animation walk) | Explicit confirmation |

**Construction policy:** After planning approval, implement **only Phase 1**, then stop.

---

## 9. Working Method Constraints

Before implementing any functionality not listed above (new node type, field, interaction, or library):

> Before I build [X], I need to confirm: [specific question(s)].  
> Do you want to add this as a requirement, or should I skip it for now?

Do not advance to the next build phase without explicit user confirmation.

Flag anywhere “from scratch” is significantly harder than a library so the user can decide on an exception.

---

## 10. Extension Configuration

| Extension | Enabled | Mode | Notes |
|---|---|---|---|
| Security Baseline | No | — | Skipped (PoC) |
| Resiliency Baseline | Yes | Full | Many rules N/A for frontend-only mock; RTO/RPO = N/A (clarification Q1 = E) |
| Property-Based Testing | Yes | Partial | Enforce PBT-02, PBT-03, PBT-07, PBT-08, PBT-09 (serialization / pure graph utilities) |

### Resiliency compliance notes (Requirements stage)
| Rule area | Status | Rationale |
|---|---|---|
| Critical workload ID | Compliant | Documented as Low-criticality prototype SPA |
| RTO/RPO / DR | N/A | User selected E — no DR for this phase |
| Multi-region / HA infra | N/A | No backend/deployed services in scope |
| Observability / CI-CD / incident process | Deferred / N/A for now | No Operations deployment in current scope; revisit if packaging for production |

### PBT compliance notes (Requirements stage)
| Rule | Status | Rationale |
|---|---|---|
| PBT-02 Round-trip | Planned | JSON export/import serialize ↔ deserialize must be property-tested |
| PBT-03 Invariants | Planned | Graph mutation invariants (e.g., edge endpoints reference existing nodes) where applicable |
| PBT-07/08/09 | Deferred to NFR/tech stack | Framework selection during construction NFR if that stage runs |

---

## 11. Acceptance Criteria (Program-Level)

1. User can open the app and see shell + seeded workflow without a backend.
2. User can pan/zoom, select nodes, edit properties (once those phases land), connect nodes, and export/import JSON.
3. Save/auto-save update in-memory state only; refresh clears state (documented).
4. Run simulates status walk on mock graph.
5. Light/dark themes work via CSS variables; dark is default.
6. No unauthorized libraries or undeclared node types ship without user approval.
7. Phase gates honored: Phase 1 delivered and reviewed before Phase 2 starts.

---

## 12. Open Items Deferred to Later Phase Gates

- Phase 7: acceptable smart-routing complexity
- Phase 8: hand-rolled vs approved layout utility
- Exact property schema fields per node type (ask before inventing fields in Phase 6)
- Minimap interaction depth beyond “present and navigable” (ask if expanding beyond basic)
