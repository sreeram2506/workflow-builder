# NFR Design Patterns — U5 Schema-Driven Properties Panel

## Performance
| Pattern | Application |
|---|---|
| Dual-write draft | Form `valueChanges` update `UiStore.propertiesDraft` (working copy of focused node); **no** GraphStore writes until Save |
| Commit on Save | `facade.patchNode` copies draft root fields + `data` into GraphStore; then clear dirty / re-baseline draft |
| Discard on focus change | Clear `propertiesDraft` when `selectionFocusNodeId` changes or selection empties; rebuild from document |
| Canvas source of truth | Graph canvas continues to render **document** nodes until Save (draft is Properties/UI coordination, not live canvas override) |
| No rAF loop | Properties edits are discrete; no `CanvasPerformanceScheduler` requirement |

## Scalability
| Pattern | Application |
|---|---|
| ≤100 node ceiling | Carry-forward; Properties binds one focused node |
| Static schema module | `properties.schema.ts` exports XPMS descriptors per `NodeType` (no injectable registry) |
| Small form | v1 ~4 controls; full FormGroup rebuild on focus change is acceptable |

## Resilience
| Pattern | Application |
|---|---|
| Validate-then-mutate | Save only when form valid; disabled Save when invalid |
| Fail-soft patch | `facade.patchNode` try/catch → `canvasError`; missing node → silent no-op |
| Pure path helpers | `getAtPath` / `setAtPath` throw or return safely; facade catches unexpected throws |
| No component catch required | Form build errors surface via Angular; NFR does not require Properties-level try/catch |

## Security (hygiene)
| Pattern | Application |
|---|---|
| Text-only descriptors | `name` / `description` via interpolation; **never** `innerHTML` |
| Trusted catalog | Static schema strings only |

## Testing
| Pattern | Application |
|---|---|
| PBT | Path round-trip; every `NodeType` has one Configuration boolean at locked `config_path` |
| Example | `patchNode` merges label/subtitle/status/data; draft discard on selection change |

## Infrastructure Design Alignment
**SKIP** — no cloud/queues/caches; all in-browser.
