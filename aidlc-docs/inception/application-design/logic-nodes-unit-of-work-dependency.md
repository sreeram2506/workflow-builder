# Unit of Work Dependencies — Logic Node Properties Increment

Original U1–U8 sequence is unchanged. This increment appends U9.

## Sequence

```text
U1 --> U2 --> U3 --> U4 --> U5 --> U6 --> U7 --> U8 --> U9
```

U9 does not start a parallel unit. It assumes U1–U8 code is already in the tree.

## Dependency Matrix

| Unit | Depends on | Dependency type | Notes |
|---|---|---|---|
| U9 | U1 | Hard | GraphStore, UiStore, WorkflowFacade, WorkflowNode/Edge types, serialize |
| U9 | U2 | Hard | Canvas selection and node/edge hit targets |
| U9 | U4 | Hard | Connect gesture; edge create path to intercept |
| U9 | U5 | Hard | Schema-driven Properties panel and Save/patchNode |
| U9 | U8 | Soft | View-mode lock already exists; U9 adds read-only type-specific fields |

U9 does **not** depend on U3/U6/U7 except that palette already can drop Condition/Decision/Repeater (U3) and serialize must round-trip new fields (U7 APIs owned by U1/U7 — U9 extends document shape).

## Shared Core — U9 may extend

| Artifact | Owner | U9 may |
|---|---|---|
| WorkflowNode / WorkflowEdge | U1 | Add `edge.condition`; document `data.condition`, repeater mock fields |
| NodeSchemaRegistry | U5 | Per-type descriptors; scope `assertRegistryV1Invariant` |
| WorkflowFacade | U1 | Connect guard + patchEdge |
| Right sidebar | U5 | Type-specific sections |
| Canvas connect | U4 | Call pure logic-node-rules before commit |

## Internal U9 order (not separate units)

1. Models + schema
2. Pure rules + mock catalog
3. Properties / connector UI
4. Connect gesture wiring
5. Tests

## Risk if order violated

- UI before schema: forms cannot bind `config_path`
- Connect wiring before pure rules: duplicated/untested branch logic
- Skipping serialize: Save appears to work until reload/export
