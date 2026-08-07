# Unit of Work Dependencies

## Sequence (strict)

```text
U1 --> U2 --> U3 --> U4 --> U5 --> U6 --> U7 --> U8
```

No parallel unit construction. Design+code+approval for Unit N must complete before Unit N+1 starts.

## Dependency Matrix

| Unit | Depends on | Dependency type | Notes |
|---|---|---|---|
| U1 | — | — | Creates shared core (GraphStore, UiStore, Facade, seed) |
| U2 | U1 | Hard | Reads graph/viewport signals; fills CanvasHost |
| U3 | U1, U2 | Hard | Drop needs canvas coordinates + facade.createNode |
| U4 | U1, U2 | Hard | Handles on nodes; edges in GraphStore |
| U5 | U1 | Hard | Selection + patchNode; soft dep on U2 for visible selection |
| U6 | U1, U2, U4 | Hard | Needs edges/nodes positions; routing/layout mutate geometry |
| U7 | U1 + graph APIs from U2–U5 | Hard | Serializes full document; history wraps facade mutations |
| U8 | U1–U7 feature surface | Hard | Locks all mutating entry points; run walks graph |

## Shared Core Ownership

| Artifact | Owner unit | Later units may |
|---|---|---|
| GraphStore | U1 | Extend methods/signals only |
| UiStore | U1 | Extend methods/signals only |
| WorkflowFacade | U1 | Add orchestration methods |
| Mock seed / types | U1 | Extend node data shapes only after ask |
| HistoryService | U7 | Introduce (was deferred in app design) |
| NodeSchemaRegistry | U5 | Create |
| EdgeRoutingService / LayoutService | U6 | Create after gates |
| SerializationService / AutoSaveService | U7 | Create |
| SimulationRunService | U8 | Create |

## Integration Points
- **UI → Facade only** for writes (all units)
- **Palette CDK** only in U3
- **Pure domain modules** added when unit needs testable logic (esp. U4 validate, U7 serialize)

## Risk if order violated
- Building U3 before U2: drop targeting unreliable
- Building U7 before graph mutations exist: weak history coverage
- Building U8 early: incomplete lock surface
