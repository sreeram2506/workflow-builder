# NFR Design Patterns — U8 Simulated Run & View Mode

## Performance
| Pattern | Application |
|---|---|
| Sequential RxJS walk | `from(order).pipe(concatMap(id => of(id).pipe(tap(running), delay(stepMs), tap(success))), takeUntil(stop$))` (or equivalent) |
| Step delay | Default **400 ms**; if `prefers-reduced-motion: reduce` → **0–50 ms**; optional `environment.runStepDelayMs` overrides default when not reduced |
| Delay resolve | Read `matchMedia` **once** at Run start |
| History isolation | All status patches use `{ skipHistory: true }` via batch `patchNodeStatuses` |
| Stop teardown | `stop$` / stopper Subject completes active pipeline promptly (NFR-P-73) |

## Scalability
| Pattern | Application |
|---|---|
| ≤100 nodes | Carry-forward qualitative ceiling |
| Single-flight | `runActive` gate: ignore/disable Run while true; one pipeline at a time |

## Resilience
| Pattern | Application |
|---|---|
| Soft empty | No nodes → `canvasStatus` “Nothing to run”; return |
| Soft no-seed | No BFS seeds → `canvasStatus` “No start node”; return |
| Stop / mode-switch | `RunSimulationService.stop()` → takeUntil; clear `runActive`; leave statuses |
| Unexpected throws | `canvasError` + clear `runActive`; no toast library |
| No complete spam | Do **not** set `canvasStatus` “Run complete”; use aria-live only for end announcement |

## Security (hygiene)
| Pattern | Application |
|---|---|
| No network | Simulation is local-only |
| No `innerHTML` | Announcements / labels as text bindings |
| Static SVG OK | Inline template icons for Run/Stop/View (Q7=B) |
| No new packages | RxJS already present via Angular |

## Accessibility / UX
| Pattern | Application |
|---|---|
| Polite live region | TopBar (or adjacent shell chrome) `aria-live="polite"` bound to `runAnnouncement` |
| Announcements | “Running {label}…” per step; “Run complete” at natural end |
| View indicator | Visible when `editorMode === 'view'` |
| Controls | Run/Stop/Reset/view toggle keyboard-operable with accessible names |

## Testing
| Pattern | Application |
|---|---|
| PBT | BFS order: ids ⊂ graph; non-seeds have predecessor earlier in prefix |
| Example | Start → Stop clears `runActive`; view mode locks mutate; Reset → all idle |

## Infrastructure Design Alignment
**SKIP** — frontend-only; no cloud/deploy/storage (Q8=A).
