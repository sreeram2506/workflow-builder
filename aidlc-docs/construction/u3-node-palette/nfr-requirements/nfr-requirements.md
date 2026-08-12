# NFR Requirements — U3 Node Palette

## Scope
Unit U3 (categorized searchable palette; CDK drag-drop + click-to-add create). Builds on U1/U2.

## Performance
| ID | Requirement |
|---|---|
| NFR-P-20 | Drag preview and drop create feel snappy for seed and ≤100 nodes; **no CI FPS** |
| NFR-P-21 | If multiple rapid creates occur, coalesce store updates with existing rAF scheduler where practical |
| NFR-P-22 | Search input debounce **150ms** |

## Scalability
| ID | Requirement |
|---|---|
| NFR-S-20 | Catalog size is fixed (~8 types); no virtualization required |
| NFR-S-21 | Created graph remains under U2 ceiling claim (≤100 nodes) for responsiveness expectations |

## Availability / Resiliency
| ID | Requirement |
|---|---|
| NFR-A-20 | No SLA; local SPA |
| NFR-A-21 | DR N/A; session-only graph (create lost on refresh) |
| NFR-A-22 | Invalid drop / unknown type → no-op (fail soft) |

## Security
| ID | Requirement |
|---|---|
| NFR-SEC-20 | Security Baseline disabled; hygiene only |
| NFR-SEC-21 | No `innerHTML` for catalog labels; text bindings |
| NFR-SEC-22 | Dependencies: npm public registry; add `@angular/cdk` only (+ no other new libs) |

## Usability / Accessibility
| ID | Requirement |
|---|---|
| NFR-U-20 | Search input has accessible name; clear control operable |
| NFR-U-21 | Category expand/collapse keyboard-operable |
| NFR-U-22 | Focused palette item activates click-to-add via Enter/Space; drag remains pointer-primary |
| NFR-U-23 | No full WCAG audit gate in U3 |

## Maintainability / Testing
| ID | Requirement |
|---|---|
| NFR-M-20 | Vitest unit tests for catalog filter helpers and `createNode` |
| NFR-M-21 | `fast-check`: created `type` ∈ catalog; id matches `n-{type}-…` |
| NFR-M-22 | Feature folder `features/palette` (or evolve shell library) |

## Locked answers
| # | Answer |
|---|---|
| Q1 | A — `@angular/cdk` matching Angular 20 |
| Q2 | B — qualitative + rAF if rapid creates |
| Q3 | A — 150ms debounce |
| Q4 | A — baseline a11y + keyboard click-to-add |
| Q5 | A — createNode type/id PBT |
| Q6 | A — no libs beyond CDK |

## Extension Compliance

### Resiliency
| Area | Status |
|---|---|
| Fail-soft create/drop | Compliant intent |
| DR / HA | N/A |

### PBT Partial
| Area | Status |
|---|---|
| createNode invariants | Compliant intent |
| Serialize | Deferred U7 |

### Security Baseline
Skipped (disabled)
