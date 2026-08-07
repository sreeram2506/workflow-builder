# Services — Angular Workflow Builder

**Style**: Thin Angular services as facades over pure TypeScript domain functions (PBT-friendly).  
**State**: `GraphStore` + `UiStore` coordinated by `WorkflowFacade`.  
**History**: Not designed in this stage (deferred to Phase 9).

---

## Service Catalog

| ID | Service | Phase | Responsibility |
|---|---|---|---|
| S-FACADE | `WorkflowFacade` | **P1** | Orchestrates GraphStore + UiStore; sole UI write API |
| S-GRAPH | `GraphStore` | **P1** | Signals: nodes, edges, graph meta; seed load |
| S-UI | `UiStore` | **P1** | Signals: selection, viewport, editorMode, theme, sidebar collapse |
| S-SEED | `MockWorkflowRepository` | **P1** | Provides hardcoded sample workflow JSON/array |
| S-SCHEMA | `NodeSchemaRegistry` | 6 | Per-type JSON schemas for properties panel |
| S-PALETTE | `PaletteCatalogService` | 4 | Node type catalog for palette |
| S-CONNECT | `ConnectionService` | 5 | Facade helper calling pure validators |
| S-LAYOUT | `LayoutService` | 8 | Auto-layout (after Phase 8 gate) |
| S-ROUTE | `EdgeRoutingService` | 7 | Smart routing (after Phase 7 gate) |
| S-SER | `SerializationService` | 9 | Export/import via pure serialize/deserialize |
| S-AUTOSAVE | `AutoSaveService` | 9 | Debounced in-memory snapshot via facade |
| S-RUN | `SimulationRunService` | 10 | Walk graph; update node status badges |
| S-HISTORY | _(deferred)_ | 9 | Not designed now |

---

## Orchestration Patterns

### Pattern A — UI → Facade → Stores
```
Component → WorkflowFacade.method() → GraphStore and/or UiStore signals update
```
Components do **not** inject GraphStore/UiStore for writes (reads may use facade selectors).

### Pattern B — Facade → Pure Domain
```
WorkflowFacade → domain/validateConnection()
               → domain/serializeWorkflow()
               → domain/deserializeWorkflow()
               → domain/viewportMath()
```
Pure modules live under `core/domain/` (or `core/lib/`) without Angular DI.

### Pattern C — Properties patching
```
PropertiesPanel → facade.patchNode(id, partial)
               → GraphStore updates immutable/signal state
               → UiStore selection unchanged
```

### Pattern D — Theme
```
ThemeToggle → facade.setTheme('light'|'dark')
           → UiStore.theme
           → documentElement data-theme attribute / class
```

---

## P1 Service Behaviors (implement now)

### WorkflowFacade (P1)
- `loadSeed()` — load mock workflow into GraphStore; reset UiStore viewport/selection defaults
- `workflowTitle()` / `status()` — read helpers for top bar
- `setTheme(theme)` / `theme()` 
- `editorMode()` — default `'edit'`
- Selectors for nodes/edges (even if canvas does not render fully in P1)

### GraphStore (P1)
- `nodes`, `edges`, `workflowMeta` signals
- `setGraph(snapshot)` / `resetFromSeed(seed)`
- No mutation helpers beyond seed until later units (keep API ready)

### UiStore (P1)
- `theme`, `editorMode`, `leftCollapsed`, `rightCollapsed`
- `viewport` placeholder defaults
- `selection` empty set

### MockWorkflowRepository (P1)
- `getSampleWorkflow(): WorkflowDocument` — 4–5 nodes + edges; types Trigger/Action/Condition/Delay/End only

---

## Later Services (designed, not P1)

| Service | Notes |
|---|---|
| NodeSchemaRegistry | Maps node type → schema sections/fields; no inventing fields without ask |
| ConnectionService | Direction-only validation via pure function |
| SerializationService | Round-trip JSON; PBT target |
| AutoSaveService | Debounce → in-memory only; no localStorage |
| SimulationRunService | Status animation walk |
| EdgeRoutingService / LayoutService | Gated questions before implementation |
| History | Explicitly deferred — redesign/add in Phase 9 unit |
