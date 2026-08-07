# Component Dependencies — Angular Workflow Builder

## Dependency Matrix (UI → services)

| Component | Depends on | Notes |
|---|---|---|
| AppComponent | ShellLayout | Root host |
| ShellLayout | TopBar, LeftSidebar, CanvasHost, RightSidebar, UiStore/Facade (mode classes) | P1 |
| TopBar | WorkflowFacade, ThemeToggle | P1 |
| ThemeToggle | WorkflowFacade | P1 |
| LeftSidebar | NodePalette (later) | P1 host only |
| RightSidebar | PropertiesPanel (later) | P1 host only |
| CanvasHost | CanvasViewport (later) | P1 placeholder |
| CanvasViewport | GraphRenderer, WorkflowNode(s), Minimap, ZoomControls, Facade | Later |
| GraphRenderer | GraphStore via Facade | Later |
| WorkflowNode | Facade (select/move/handle) | Later |
| NodePalette | PaletteCatalog, CDK drag-drop, Facade | Later |
| PropertiesPanel | Facade, NodeSchemaRegistry | Later — patch only via facade |
| RunControls | SimulationRunService / Facade | Later |
| SerializationPanel | SerializationService / Facade | Later |

## Store / Facade Dependencies

```
WorkflowFacade
  ├── GraphStore
  ├── UiStore
  ├── MockWorkflowRepository (P1)
  ├── NodeSchemaRegistry (later)
  ├── ConnectionService → domain/validateConnection (later)
  ├── SerializationService → domain/serialize|deserialize (later)
  ├── AutoSaveService (later)
  ├── SimulationRunService (later)
  ├── EdgeRoutingService (later)
  └── LayoutService (later)
```

**Rule**: UI components depend on `WorkflowFacade` (and presentational inputs), not on multiple stores for writes.

## Communication Patterns
- **One-way data**: Stores expose signals; templates read via facade selectors
- **Commands**: User intents call facade methods
- **No event bus** required for v1
- **CDK drag-drop**: Palette → canvas drop coordinates converted in facade/`CanvasHost`

## Data Flow (P1)

```text
MockWorkflowRepository.getSampleWorkflow()
        |
        v
WorkflowFacade.loadSeed()
        |
        +--> GraphStore.setGraph(nodes, edges, meta)
        +--> UiStore.resetDefaults(theme=dark, mode=edit)
        |
        v
Shell / TopBar / ThemeToggle render from facade signals
CanvasHost shows empty/styled region (full render in later unit)
```

## Data Flow (Later — edit node property)

```text
PropertiesPanel.onPatch()
    -> WorkflowFacade.patchNode(id, patch)
    -> GraphStore.updateNode(...)
    -> signals refresh -> WorkflowNode + PropertiesPanel
```

## Coupling Constraints
- Properties panel **must not** mutate node objects directly (Q6 = A)
- Canvas node dragging **must not** use CDK (palette only)
- History not in graph; when added later, facade will coordinate snapshots without changing component dependency rule
