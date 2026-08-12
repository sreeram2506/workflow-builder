# NFR Requirements — U4 Connections & Edge Reshape

## Scope
Unit U4 (handle draw, direction validation, multi-waypoint reshape, edge delete). Builds on U1–U3. Frontend-only.

## Performance
| ID | Requirement |
|---|---|
| NFR-P-30 | Connection rubber-band + handle hover hit-test feel smooth for seed and ≤100 nodes; **no FPS CI** |
| NFR-P-31 | Draft pointer updates coalesce via existing `CanvasPerformanceScheduler` / rAF |
| NFR-P-32 | Waypoint drag uses the **same rAF batching** pattern as node drag |
| NFR-P-33 | Path recompute for ≤100 edges remains responsive during draft/reshape (no spatial index required) |

## Scalability
| ID | Requirement |
|---|---|
| NFR-S-30 | Responsiveness claim remains **≤100 nodes** (carry U2/U3) |
| NFR-S-31 | Duplicate edges allowed; no special scaling for multi-edge pairs beyond normal render |
| NFR-S-32 | No virtualization of edges in U4 |

## Availability / Resiliency
| ID | Requirement |
|---|---|
| NFR-A-30 | No SLA; local SPA |
| NFR-A-31 | DR N/A; session-only graph |
| NFR-A-32 | Invalid connection complete → **no edge**, red preview only; **no** `canvasError` spam |
| NFR-A-33 | Unexpected throws in create/delete/waypoint paths → fail soft via existing `canvasError` |

## Security
| ID | Requirement |
|---|---|
| NFR-SEC-30 | Security Baseline disabled; hygiene only |
| NFR-SEC-31 | No `innerHTML` for edge/handle labels |
| NFR-SEC-32 | **No new npm libraries** for U4 edge draw |

## Usability / Accessibility
| ID | Requirement |
|---|---|
| NFR-U-30 | Source/target handles have accessible names |
| NFR-U-31 | Escape cancels in-progress connection draft |
| NFR-U-32 | Delete/Backspace behavior documented (waypoint focus → edge delete) |
| NFR-U-33 | Full keyboard connect (Tab/Enter) **not** required in U4 |
| NFR-U-34 | No full WCAG audit gate in U4 |

## Maintainability / Testing
| ID | Requirement |
|---|---|
| NFR-M-30 | Vitest: `validateConnection`, `snapToGrid`, createEdge/delete example tests |
| NFR-M-31 | `fast-check`: connection validation invariants; snapped coords multiples of 16; edge id pattern |
| NFR-M-32 | Keep connection logic in `core/domain` pure helpers + facade; UI in `features/canvas` |

## Explicit Deferrals
- Keyboard-only connect → later a11y polish
- Smart routing performance → U6
- Properties-on-select → U5
- Serialize / history PBT → U7

## Locked answers
| # | Answer |
|---|---|
| Q1 | B — qualitative + rAF draft coalesce |
| Q2 | A — rAF waypoint drag |
| Q3 | A — baseline a11y |
| Q4 | A — validate/snap/id PBT + example create/delete |
| Q5 | A — no new libraries |
| Q6 | A — visual-only invalid feedback |

## Extension Compliance

### Resiliency
| Area | Status |
|---|---|
| Fail-soft invalid connect | Compliant intent |
| Unexpected errors → canvasError | Compliant intent |
| DR / HA | N/A |

### PBT Partial
| Area | Status |
|---|---|
| validateConnection / snap / edge id | Compliant intent |
| Serialize | Deferred U7 |

### Security Baseline
Skipped (disabled)
