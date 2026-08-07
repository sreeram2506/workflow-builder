# NFR Requirements — U1

## Scope
Unit U1 (shell, tokens, theme, in-memory seed). Frontend-only local prototype.

## Performance
| ID | Requirement |
|---|---|
| NFR-P-01 | After warm `ng serve` compile, shell should become interactive within ~2s on a mid-range developer laptop |
| NFR-P-02 | No formal Lighthouse/CI performance budget in U1 |
| NFR-P-03 | Theme toggle and sidebar collapse should feel immediate (no perceptible multi-frame lag for these UI-only updates) |

## Scalability
| ID | Requirement |
|---|---|
| NFR-S-01 | U1 targets single-user local usage; no multi-user or load scaling requirements |
| NFR-S-02 | Seed graph size is fixed (~5 nodes); no large-graph performance claims in U1 |

## Availability / Resiliency
| ID | Requirement |
|---|---|
| NFR-A-01 | No uptime SLA; app availability = “loads in supported browser” |
| NFR-A-02 | DR / RTO / RPO remain **N/A** (project-level decision) |
| NFR-A-03 | Theme and in-memory graph intentionally lost on refresh (documented product limitation) |

## Security
| ID | Requirement |
|---|---|
| NFR-SEC-01 | Security Baseline extension disabled; apply hygiene only |
| NFR-SEC-02 | No secrets committed to the repository |
| NFR-SEC-03 | Do not assign untrusted strings via `innerHTML` |
| NFR-SEC-04 | Dependencies installed from the public npm registry via npm |

## Usability / Accessibility
| ID | Requirement |
|---|---|
| NFR-U-01 | Theme toggle and sidebar collapse keyboard-operable |
| NFR-U-02 | Disabled Undo/Redo/Save/Run expose accessible names / disabled reason |
| NFR-U-03 | No full WCAG 2.2 AA audit gate in U1 |
| NFR-U-04 | Evergreen desktop browsers only (Chrome/Edge/Firefox/Safari latest) |

## Maintainability / Testing
| ID | Requirement |
|---|---|
| NFR-M-01 | Strict TypeScript + strict templates; ESLint via Angular defaults/schematic |
| NFR-M-02 | Unit tests via Vitest (Angular Vitest builder when available for chosen version) |
| NFR-M-03 | `fast-check` added as PBT framework (PBT-09); U1 may include a trivial smoke property or dependency-only setup — round-trip properties enforced starting with serialization logic (U7) and other pure domain functions as they appear |
| NFR-M-04 | Feature-folder structure per application design for long-term maintainability |

## Explicit Deferrals (later units)
- Canvas interaction FPS budgets → U2
- Import JSON validation hardening beyond shape checks → U7
- Full view-mode a11y → U8
- Production hosting/CSP → out of scope until Operations/hosting exists

## Extension Compliance (U1 NFR stage)

### Resiliency Baseline
| Rule area | Status | Notes |
|---|---|---|
| Criticality | Compliant | Low prototype |
| RTO/RPO/DR | N/A | Confirmed |
| HA / multi-region | N/A | No backend |
| Observability / CI-CD production | N/A for U1 local prototype | |

### PBT (Partial)
| Rule | Status | Notes |
|---|---|---|
| PBT-09 Framework | Compliant | `fast-check` selected |
| PBT-02/03 | Deferred implementation | No serialize round-trip in U1; framework present |
| PBT-07/08 | Deferred | Generators when domain pure functions land |
