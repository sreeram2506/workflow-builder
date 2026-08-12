# NFR Requirements — U5 Schema-Driven Properties Panel

## Scope
Unit U5 (XPMS-style schema registry, reactive Properties form, Save → `patchNode`, view-mode readonly readiness). Builds on U1–U4. Frontend-only.

## Performance
| ID | Requirement |
|---|---|
| NFR-P-40 | Form rebuild on focus change and Save feel instant for ≤100 nodes and v1 schema size (~4 controls); **no FPS CI** |
| NFR-P-41 | No continuous rAF loop required for Properties (Save is discrete; not pointer-drag) |
| NFR-P-42 | Path get/set helpers are O(path depth); nested writes must not clone the entire document beyond the patched node |

## Scalability
| ID | Requirement |
|---|---|
| NFR-S-40 | Responsiveness claim remains **≤100 nodes** (carry U2–U4) |
| NFR-S-41 | Schema registry is static in-memory; v1 = one Configuration field per `NodeType` |
| NFR-S-42 | No virtualization of form fields in U5 |

## Availability / Resiliency
| ID | Requirement |
|---|---|
| NFR-A-40 | No SLA; local SPA |
| NFR-A-41 | DR N/A; session-only graph |
| NFR-A-42 | Missing/invalid node on Save → **no-op** |
| NFR-A-43 | Unexpected throws in `patchNode` / path helpers → fail soft via existing `canvasError` (or equivalent shell error signal); **no toast spam** |
| NFR-A-44 | Unsaved edits discarded on selection change (by design — not an error) |

## Security
| ID | Requirement |
|---|---|
| NFR-SEC-40 | Security Baseline disabled; hygiene only |
| NFR-SEC-41 | No `innerHTML` for field labels/descriptions (text binding only) |
| NFR-SEC-42 | **No new npm libraries** for U5 forms/schema rendering |
| NFR-SEC-43 | Descriptor `name` / `description` treated as trusted static catalog strings (not user HTML) |

## Usability / Accessibility
| ID | Requirement |
|---|---|
| NFR-U-40 | Labels associated with controls; Save has accessible name |
| NFR-U-41 | Baseline keyboard focus within panel; **no** full WCAG audit gate |
| NFR-U-42 | View mode: controls disabled/readonly; Save unavailable |
| NFR-U-43 | Empty / edge-only selection shows clear “select a node” empty state |
| NFR-U-44 | Escape-to-collapse Properties **not** required in U5 |

## Maintainability / Testing
| ID | Requirement |
|---|---|
| NFR-M-40 | Vitest: `getAtPath` / `setAtPath` examples; `patchNode` example tests |
| NFR-M-41 | `fast-check`: path round-trip invariants (`set` then `get` = value for safe paths) |
| NFR-M-42 | `fast-check` or parameterized assert: every `NodeType` registry entry has exactly one Configuration boolean at locked `config.data.ignore_keys_in_paragraph` |
| NFR-M-43 | Schema registry + path helpers in `core/domain`; UI in shell/properties feature; mutations via facade |

## Explicit Deferrals
- Rich per-type Configuration catalogs beyond one boolean mock
- JSON Schema / form-builder libraries
- Live/debounced patch
- Edge properties
- Undo/history (U7)
- Full view-mode lock of all mutating chrome (U8)

## Locked answers
| # | Answer |
|---|---|
| Q1 | A — qualitative performance |
| Q2 | A — baseline a11y |
| Q3 | B — path PBT + registry one-boolean property |
| Q4 | A — no new libraries; `@angular/forms` only |
| Q5 | A — fail soft + canvasError |
| Q6 | A — immutable nested path helpers |

## Extension Compliance

### Resiliency
| Area | Status |
|---|---|
| Fail-soft Save / missing node | Compliant intent |
| Unexpected errors → canvasError | Compliant intent |
| DR / HA / multi-region | N/A (frontend session SPA; DR N/A configured) |
| CI/CD / rollback / RTO | N/A for this unit stage |

### PBT Partial
| Area | Status |
|---|---|
| Path round-trip + registry invariant | Compliant intent |
| Serialize round-trip | Deferred U7 |

### Security Baseline
Skipped (disabled)
