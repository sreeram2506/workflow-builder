# NFR Requirements — U6 Smart Routing & Auto-Layout

## Scope
Unit U6 (medium obstacle-aware edge routing; hand-rolled Vertical / Horizontal / Layered layout; Layout ▾ + Route edges UI). Builds on U1–U5. Frontend-only.

## Performance
| ID | Requirement |
|---|---|
| NFR-P-50 | Layout + Route must **feel snappy** on a mid-range laptop for ≤100 nodes / typical edge counts; **no formal ms budget**, **no FPS CI** |
| NFR-P-51 | Route / Layout run as **synchronous** one-shots on user action (not continuous; not during node drag) |
| NFR-P-52 | No continuous rAF loop for routing; existing rAF patterns for drag/viewport remain unchanged |
| NFR-P-53 | Keep grid/A* cell resolution and obstacle padding conservative enough to stay responsive at the ≤100-node ceiling |

## Scalability
| ID | Requirement |
|---|---|
| NFR-S-50 | Responsiveness claim remains **≤100 nodes** (carry U2–U5) |
| NFR-S-51 | No multi-user / server scaling; single-user local prototype |
| NFR-S-52 | No Web Worker / spatial-index infra in U6; algorithm stays in-main-thread pure TS |

## Availability / Resiliency
| ID | Requirement |
|---|---|
| NFR-A-50 | No SLA; local SPA |
| NFR-A-51 | DR N/A; session-only graph |
| NFR-A-52 | Path-not-found per edge → empty/minimal waypoints (existing horizontal bezier); **do not throw** |
| NFR-A-53 | Unexpected throws in layout/route → fail soft via `canvasError` (or equivalent); **no toast spam** |
| NFR-A-54 | When any edge used fallback path, set a brief **non-blocking status string** (e.g. “Some edges used simple paths”); clear/replace on next successful clean route or dismiss per existing shell patterns |
| NFR-A-55 | View mode: Layout / Route are no-ops / disabled |

## Security
| ID | Requirement |
|---|---|
| NFR-SEC-50 | Security Baseline disabled; hygiene only |
| NFR-SEC-51 | **No new npm packages** for layout/routing |
| NFR-SEC-52 | No `innerHTML` for control labels; text binding only |
| NFR-SEC-53 | Layout/Route mutate in-memory graph only; no network |

## Usability / Accessibility
| ID | Requirement |
|---|---|
| NFR-U-50 | Layout ▾ and Route edges keyboard-operable with accessible names; **no** full WCAG audit gate |
| NFR-U-51 | Evergreen desktop browsers only (carry prior units) |
| NFR-U-52 | After any layout, run **fit-to-content once** (implement if missing — reuse viewport math helpers) |
| NFR-U-53 | Route-alone does **not** require fit-to-content |

## Maintainability / Testing
| ID | Requirement |
|---|---|
| NFR-M-50 | Domain helpers in `core/domain` (`layout.math`, `edge-routing` or equivalent); UI thin; mutations via facade |
| NFR-M-51 | Vitest example tests: layout modes produce finite positions; route fallback; facade applyLayout/routeEdges smoke |
| NFR-M-52 | `fast-check` **layout invariants** (Partial PBT): all nodes get finite positions; for acyclic graphs, layered ranks are non-decreasing along edges; + example tests for route fallback |
| NFR-M-53 | Routing PBT deferred beyond example fallback tests (Q4=A) |

## Explicit Deferrals
- Hard ms / FPS CI budgets
- Yielding / Web Worker routing
- Full WCAG audit; rich keyboard Layout menu polish beyond baseline buttons
- Routing waypoint PBT suite
- Undo of layout/route (U7)
- Continuous live routing

## Locked answers
| # | Answer |
|---|---|
| Q1 | A — qualitative performance |
| Q2 | A — synchronous one-shot |
| Q3 | A — baseline a11y |
| Q4 | A — layout invariants PBT + route fallback examples |
| Q5 | A — no new libraries |
| Q6 | B — fail soft + fallback status string |
| Q7 | B — fit-to-content once after layout |

## Extension Compliance

### Resiliency
| Area | Status |
|---|---|
| Fail-soft path-not-found | Compliant intent |
| Unexpected errors → canvasError | Compliant intent |
| Fallback status feedback | Compliant intent (Q6=B) |
| DR / HA / multi-region | N/A (frontend session SPA; DR N/A configured) |
| CI/CD / rollback / RTO | N/A for this unit stage |

### PBT Partial
| Area | Status |
|---|---|
| Layout finite positions + layered rank monotonicity (acyclic) | Compliant intent |
| Route fallback examples | Compliant intent |
| Serialize round-trip | Deferred U7 |
| Routing geometry PBT | Deferred (Q4=A) |

### Security Baseline
Skipped (disabled)
