# Logical Components — U8 (NFR Design)

## In-scope

### run-order (pure module)
| Field | Detail |
|---|---|
| **Type** | Pure TS under `core/domain/run-order.ts` (name may vary) |
| **APIs** | `findRunSeeds(doc)`, `computeRunOrder(doc)` — BFS from Trigger ∪ indegree-0; visit once |
| **PBT** | Order ⊆ node ids; connectivity predecessor invariant |

### RunSimulationService (injectable) — Q1=A, Q3=A
| Field | Detail |
|---|---|
| **Owns** | RxJS pipeline, stopper Subject, step-delay resolution (reduced-motion + env override) |
| **APIs** | `start(doc)`, `stop()`, optionally expose `isActive` via store |
| **Side effects** | Calls GraphStore status patches (via facade or injected store); updates UiStore `runActive` / `runAnnouncement` |
| **Stop** | Completes stopper → `takeUntil`; leaves node statuses; clears `runActive` |

### GraphStore status batch — Q5=A
| Field | Detail |
|---|---|
| **API** | `patchNodeStatuses(updates, { skipHistory: true })` |
| **Used by** | Per-step running/success; Reset all idle; pre-Run idle reset |
| **History** | Must not push undo frames |

### UiStore signals — Q4=A
| Field | Detail |
|---|---|
| **Existing** | `editorMode`, `canvasStatus`, `canvasError` |
| **Add** | `runActive: boolean`; `runAnnouncement: string \| null` (aria-live) |
| **Clear** | Announcement cleared on idle / after complete (implementation detail) |

### WorkflowFacade (evolve)
| Field | Detail |
|---|---|
| **APIs** | `startRun()`, `stopRun()`, `resetStatuses()`, `setEditorMode(mode)` |
| **Guards** | Empty / no-seed → `canvasStatus`; if `runActive` → no-op start; mode switch → `stopRun()` |
| **View** | Mutations remain no-op; Run/Reset/Export/Save-download allowed |

### TopBarComponent (evolve) — Q6=A, Q7=B
| Field | Detail |
|---|---|
| **Enable** | Run; Stop when `runActive`; Reset statuses; view/edit toggle + View indicator |
| **A11y** | Polite `aria-live` bound to `runAnnouncement`; accessible names; static SVG icons OK |
| **Disable** | Run while `runActive`; mutating chrome already gated by view |

### View lock surface (verify)
| Surface | Behavior |
|---|---|
| Palette / canvas mutate / Properties save / Import / history shortcuts that mutate | Locked in view |
| Pan/zoom/minimap/selection/theme/Export/Save-download/Run/Reset | Allowed |

### environment.ts (optional knob) — Q2=B
| Field | Detail |
|---|---|
| **Add** | `runStepDelayMs?: number` (default **400**) |
| **Rule** | Reduced-motion still wins (0–50 ms) when media query matches |

## Explicitly out of scope
| Component | Reason |
|---|---|
| Backend run client | FD non-goal |
| Toast library | NFR |
| Run log panel | FD non-goal |
| Queues / caches / cloud | Q8 SKIP |

## Dependency sketch

```text
TopBar → WorkflowFacade → RunSimulationService
                       ↘ GraphStore.patchNodeStatuses(skipHistory)
                       ↘ UiStore (runActive, runAnnouncement, canvasStatus/Error, editorMode)
RunSimulationService → pure run-order helpers
```

## Infrastructure
**SKIP** per Q8=A — record SKIP.md at Infrastructure Design stage.
