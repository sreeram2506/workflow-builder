# Business Logic Summary — U5 Properties

## Delivered
- `config-path.ts` — immutable `getAtPath` / `setAtPath`
- `properties.schema.ts` — XPMS descriptors; locked boolean Configuration per `NodeType`
- `GraphStore.patchNode` — merge label/subtitle/status/data
- `WorkflowFacade` — `selectionFocusNodeId`, `propertiesDraft`, `patchNode`, `focusNodeInSelection`, auto-expand on sole node select

## Tests
- Path round-trip PBT + registry one-boolean invariant
- Facade patchNode + multi-select focus examples
