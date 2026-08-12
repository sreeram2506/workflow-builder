# NFR Requirements — U8 Simulated Run & View Mode

## Scope
Unit U8 (BFS mock Run animation; Stop/Reset; view-mode toggle + lock surface). Builds on U1–U7. Frontend-only.

## Performance
| ID | Requirement |
|---|---|
| NFR-P-70 | 400 ms sequential steps feel smooth for ≤100 nodes; **no FPS CI** |
| NFR-P-71 | Respect `prefers-reduced-motion: reduce` → step delay **0–50 ms** |
| NFR-P-72 | Status patches use `skipHistory`; no undo flood |
| NFR-P-73 | Stop clears pending RxJS subscriptions/timers promptly |

## Scalability
| ID | Requirement |
|---|---|
| NFR-S-70 | ≤100 nodes ceiling (carry-forward) |
| NFR-S-71 | Single concurrent simulation (`runActive` gate) |

## Availability / Resiliency
| ID | Requirement |
|---|---|
| NFR-A-70 | No SLA; local SPA |
| NFR-A-71 | DR N/A |
| NFR-A-72 | Empty / no-seed → `canvasStatus`; no throw |
| NFR-A-73 | Unexpected throws → `canvasError` + clear `runActive`; **no toast library** |
| NFR-A-74 | No “Run complete” status spam (Q6=A) |

## Security
| ID | Requirement |
|---|---|
| NFR-SEC-70 | Security Baseline disabled; hygiene only |
| NFR-SEC-71 | **No new npm packages** |
| NFR-SEC-72 | No `innerHTML` for run announcements (text / aria-live only) |
| NFR-SEC-73 | Run does not call network |

## Usability / Accessibility
| ID | Requirement |
|---|---|
| NFR-U-70 | Run/Stop/Reset/view toggle keyboard-operable with accessible names |
| NFR-U-71 | `aria-live="polite"` announces “Running {label}…” during steps and “Run complete” at end |
| NFR-U-72 | Clear View mode indicator when `editorMode === 'view'` |
| NFR-U-73 | No full WCAG audit gate |

## Maintainability / Testing
| ID | Requirement |
|---|---|
| NFR-M-70 | Pure `computeRunOrder` / seeds in `core/domain`; RunSimulation service + facade |
| NFR-M-71 | `fast-check`: BFS order invariants (ids ⊂ graph; non-seeds have predecessor in earlier prefix) |
| NFR-M-72 | Example: Start/Stop clears active; view mode locks mutate |

## Explicit Deferrals
- Soft ms complete-walk budgets
- Toast libraries
- Real branch evaluation
- Backend run API

## Locked answers
| # | Answer |
|---|---|
| Q1 | A — qualitative performance |
| Q2 | B — RxJS timer / concatMap delay |
| Q3 | B — baseline + aria-live |
| Q4 | A — BFS order PBT + Run/Stop examples |
| Q5 | A — no new libraries |
| Q6 | A — canvasStatus for empty; canvasError on throws; no complete spam |
| Q7 | A — reduced-motion shortens delay |

## Extension Compliance

### Resiliency
| Area | Status |
|---|---|
| Soft empty/no-seed | Compliant intent |
| Stop / clear runActive on error | Compliant intent |
| DR / HA | N/A |

### PBT Partial
| Area | Status |
|---|---|
| BFS order invariants | Compliant intent |

### Security Baseline
Skipped (disabled)
