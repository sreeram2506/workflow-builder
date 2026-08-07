# Components — Angular Workflow Builder

**Organization**: `src/app/features/*` + `core/` + `shared/`  
**State**: Split `GraphStore` + `UiStore` behind a facade  
**History**: Deferred (not designed here; Unit 7 / Phase 9)  
**Scope**: Full map for Phases 1–10; Phase 1 implements only items marked **P1**

---

## Folder Map

```
src/app/
  core/                 # singleton services, stores, facades, domain pure modules
  shared/               # presentational UI primitives, pipes, tokens helpers
  features/
    shell/              # top bar, sidebars host, layout
    canvas/             # viewport, SVG graph, HTML nodes, minimap
    palette/            # categorized library + CDK drag
    properties/         # schema-driven form panel
    theme/              # theme toggle / token application
    run/                # simulated run (later)
    serialization/      # export/import UI (later)
```

---

## Component Catalog

| ID | Name | Layer | Phase | Status |
|---|---|---|---|---|
| C-APP | `AppComponent` | root | P1 | **P1** |
| C-SHELL | `ShellLayoutComponent` | features/shell | P1 | **P1** |
| C-TOPBAR | `TopBarComponent` | features/shell | P1 | **P1** |
| C-LEFT | `LeftSidebarComponent` | features/shell | P1 | **P1** (empty/host) |
| C-RIGHT | `RightSidebarComponent` | features/shell | P1 | **P1** (empty/host) |
| C-CANVAS-HOST | `CanvasHostComponent` | features/canvas | P1 | **P1** (placeholder area) |
| C-VIEWPORT | `CanvasViewportComponent` | features/canvas | 2+ | Later |
| C-GRAPH | `GraphRendererComponent` | features/canvas | 2–3+ | Later |
| C-NODE | `WorkflowNodeComponent` | features/canvas | 3+ | Later |
| C-MINIMAP | `MinimapComponent` | features/canvas | 2+ | Later |
| C-ZOOM | `ZoomControlsComponent` | features/canvas | 2+ | Later |
| C-PALETTE | `NodePaletteComponent` | features/palette | 4 | Later |
| C-PALETTE-ITEM | `PaletteItemComponent` | features/palette | 4 | Later |
| C-PROPS | `PropertiesPanelComponent` | features/properties | 6 | Later |
| C-THEME | `ThemeToggleComponent` | features/theme | P1 | **P1** |
| C-RUN | `RunControlsComponent` | features/run | 10 | Later |
| C-SER | `SerializationPanelComponent` | features/serialization | 9 | Later |
| C-MODE | `EditorModeBadgeComponent` | features/shell | later / VM | Later |

---

## Component Responsibilities

### C-APP — AppComponent
- Bootstrap root; host shell; provide application providers if needed

### C-SHELL — ShellLayoutComponent
- Compose top bar + left sidebar + canvas host + right sidebar
- Apply layout CSS using design tokens
- Reflect editor mode classes (edit/view) from UiStore (when mode exists)

### C-TOPBAR — TopBarComponent
- Show workflow title + status pill
- Host action buttons: Undo, Redo, Save, Run (wired later; P1 may be disabled placeholders)
- Host theme toggle slot

### C-LEFT / C-RIGHT — Sidebar hosts
- Collapsible containers
- P1: structural chrome only
- Later: host palette (left) and properties (right)

### C-CANVAS-HOST — CanvasHostComponent (P1)
- Occupies center region with dotted-grid-ready surface styling
- P1: does not implement pan/zoom engine yet
- Later: hosts viewport/graph/nodes

### C-VIEWPORT — CanvasViewportComponent (Later)
- Pan, zoom, pointer gesture handling
- Grid background coordination
- Hosts graph + node overlay layers

### C-GRAPH — GraphRendererComponent (Later)
- SVG edges, lasso/marquee overlay, selection decorations for edges
- Emits connection/lasso intents to facade

### C-NODE — WorkflowNodeComponent (Later)
- HTML card: icon, label, subtitle, category color, status badge
- Handles, selection chrome
- Emits select/drag intents (canvas node drag is custom — not CDK)

### C-MINIMAP / C-ZOOM (Later)
- Overview navigation and zoom UI controls

### C-PALETTE / C-PALETTE-ITEM (Later)
- Categorized searchable library; CDK drag-drop onto canvas

### C-PROPS — PropertiesPanelComponent (Later)
- Reads selected node via facade + schema registry
- Emits property patches to facade (no direct node mutation)

### C-THEME — ThemeToggleComponent (P1)
- Switch light/dark; updates UiStore theme signal / document class

### C-RUN / C-SER / C-MODE (Later)
- Simulated run UI; export/import UI; view-mode indicator

---

## Explicitly Out of Application Design (per plan)
- **HistoryService / undo stack components** — deferred to Phase 9 unit
- No backend clients
- No third-party canvas libraries
