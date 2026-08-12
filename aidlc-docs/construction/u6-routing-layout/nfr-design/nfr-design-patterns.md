# NFR Design Patterns — U6 Smart Routing & Auto-Layout

## Performance
| Pattern | Application |
|---|---|
| Sync one-shot | `applyLayout` / `routeEdges` run on click (and layout chains into route); never on node-move debounce or live drag |
| Compute-then-commit | Pure helpers produce full `positions` map and/or per-edge `waypoints`; GraphStore applies in **one batch** (or at most nodes-batch then edges-batch) |
| No rAF for routing | Existing `CanvasPerformanceScheduler` stays for pointer/viewport only |
| Fit after layout | After layout+route commit, call `fitToContent(viewW, viewH)` once; Route-alone skips fit |

## Scalability
| Pattern | Application |
|---|---|
| ≤100 node ceiling | Carry-forward; algorithms sized for that claim |
| Env-tunable grid | `environment.routingGridSize` (default **16**) and `environment.routingObstaclePadding` (default documented constant) read by domain router; **no UI** |
| Fixed layout spacing | Rank/node gaps as domain constants (not env unless later needed) |

## Resilience
| Pattern | Application |
|---|---|
| Per-edge fallback | Path-not-found → empty/minimal waypoints (existing bezier); continue remaining edges |
| Fallback status | When any edge fell back, set non-error **`canvasStatus`** on UiStore (e.g. “Some edges used simple paths”); clear on next Layout/Route or when superseded |
| Unexpected throws | Facade try/catch → `canvasError`; do not toast-spam |
| View mode guard | Layout/Route disabled or no-op when `editorMode === 'view'` |

## Security (hygiene)
| Pattern | Application |
|---|---|
| No new packages | Hand-rolled layout + routing only |
| Static chrome | Labels/aria text-bound; **SVG icons allowed** only as static inline templates (Q6=B) |
| No user HTML | Never `innerHTML` for status/control copy |

## Testing
| Pattern | Application |
|---|---|
| PBT | Layout: finite positions; layered ranks non-decreasing along edges (acyclic) |
| Example | Route fallback path; batch applyLayout routes then fits; canvasStatus set when fallback used |
| Viewport | Example/PBT as needed for `fitToContent` clamp invariants |

## Infrastructure Design Alignment
**SKIP** — in-browser only; no cloud/queues/caches (Q7=A).
