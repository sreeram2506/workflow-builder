# NFR Design Patterns — U3 Node Palette

## Performance
| Pattern | Application |
|---|---|
| CDK DropList connection | Palette `cdkDrag` items → canvas viewport `cdkDropList` via `cdkDropListConnectedTo` |
| Search debounce | RxJS `debounceTime(150)` on search subject in palette component |
| Rapid create | Prefer single `createNode` per drop; reuse `CanvasPerformanceScheduler` if batching ever needed |

## Scalability
| Pattern | Application |
|---|---|
| Fixed catalog | ~8 items; no virtual scroll |
| Graph ceiling | Rely on U2 ≤100 node claim; no palette-side pagination |

## Resilience
| Pattern | Application |
|---|---|
| Validate-then-create | Type ∈ catalog; document present |
| Fail-soft create | try/catch around `createNode` paths; set non-blocking `canvasError` (or library status) on unexpected throw |
| Invalid drop | Outside canvas DropList → no create |

## Security (hygiene)
| Pattern | Application |
|---|---|
| Text bindings | Catalog label/description via interpolation |
| No bypass | Do not use `bypassSecurityTrust*` |

## Testing
| Pattern | Application |
|---|---|
| Example tests | Catalog filter, createNode defaults |
| PBT | `type` ∈ catalog; id matches `n-{type}-…` |

## Infrastructure Design Alignment
**SKIP** — no cloud components; CDK is an in-app dependency only.
