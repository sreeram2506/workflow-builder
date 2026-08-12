# NFR Design Patterns — U2 Canvas Engine

## Performance
| Pattern | Application in U2 |
|---|---|
| Shared world transform | Single `.world` layer uses CSS `transform: translate(x,y) scale(s)` bound to viewport signal |
| rAF coalescing | Pointermove updates buffered; at most one viewport/position flush per animation frame via `CanvasPerformanceScheduler` |
| Pointer capture | `setPointerCapture` during pan / node-drag / marquee to keep stream stable |
| Passive wheel | Use `{ passive: true }` when `preventDefault` is not required; otherwise document non-passive path |
| Instant vs eased zoom | Default instant; optional short easing on zoom **buttons** only, skipped when `prefers-reduced-motion: reduce` |
| Qualitative smoothness | No FPS CI; design for ≤100 nodes without virtualization |

## Scalability
| Pattern | Application in U2 |
|---|---|
| Full signal-driven render | Recompute edge views / node positions from stores; **no** spatial index or virtualization in U2 |
| Horizontal scale / caches / queues | **N/A** — single-user local SPA |

## Resilience
| Pattern | Application in U2 |
|---|---|
| Defensive graph render | Skip edges whose source/target node is missing |
| Zoom clamp | Enforce [0.25, 2.0] in `ViewportMath` |
| Illegal pointer sequences | Ignore / no-op (e.g. move without active gesture) |
| Fail-soft pointer handlers | try/catch around interaction handlers; set non-blocking **canvas error** message via facade/UiStore (does not tear down shell) |
| Retries / circuit breakers | **Not used** (no remote I/O) |

## Security (hygiene)
| Pattern | Application in U2 |
|---|---|
| Text bindings only | Labels/subtitles/status via Angular interpolation / property bindings |
| No sanitizer package | Clarification C1 = A; keeps no-new-lib lock |
| No bypass APIs | Do not call `bypassSecurityTrust*` |
| No new network surface | Canvas is local-only |

## Testing
| Pattern | Application in U2 |
|---|---|
| Pure viewport math | `ViewportMath` unit + `fast-check` (clamp + screen↔world round-trip) |
| Example tests | Marquee intersection, selection helpers, component smoke as needed |
| Scheduler | Lightweight unit test that rAF flush coalesces multiple calls to one write (optional fake clock / stub) |

## Infrastructure Design Alignment
Infrastructure Design remains **SKIP** — patterns are in-app only (no cloud components).

## Extension Compliance
| Extension | Status |
|---|---|
| Resiliency | Compliant for local SPA: fail-soft canvas errors; DR N/A |
| PBT Partial | Viewport math properties planned |
| Security Baseline | Skipped (disabled); hygiene patterns applied |
