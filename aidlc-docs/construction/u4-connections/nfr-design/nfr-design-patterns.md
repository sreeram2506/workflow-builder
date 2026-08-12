# NFR Design Patterns — U4 Connections & Edge Reshape

## Performance
| Pattern | Application |
|---|---|
| Local connection draft | Draft lives in `CanvasViewport` (or child); **no** UiStore writes until `createEdge` |
| rAF coalesce (draft) | Pointermove updates pending pointer; `CanvasPerformanceScheduler` refreshes preview path |
| rAF coalesce (waypoints) | Same scheduler pattern as node drag for waypoint moves |
| Pure hit-test | World pointer → left-handle hit via node bounds + port offsets (no `elementFromPoint`) |

## Scalability
| Pattern | Application |
|---|---|
| ≤100 node ceiling | Linear scan of nodes for handle hit-test is acceptable |
| Path builder | Pure function over ports + waypoints; recompute on document/draft change |

## Resilience
| Pattern | Application |
|---|---|
| Validate-then-mutate | `validateConnection` before `addEdge` |
| Fail-soft unexpected | try/catch on create/delete/waypoint → `canvasError` |
| Invalid complete | Red preview only; **no** status spam; **no** console warn required |

## Security (hygiene)
| Pattern | Application |
|---|---|
| ARIA on handles | Accessible names via attributes/text |
| Trusted path `d` | Built from numeric geometry only |

## Testing
| Pattern | Application |
|---|---|
| PBT | `validateConnection`, `snapToGrid` (multiples of 16), edge id pattern |
| Example | createEdge / deleteEdges / waypoint insert-move-remove |

## Infrastructure Design Alignment
**SKIP** — no cloud/queues/caches; all in-browser.
