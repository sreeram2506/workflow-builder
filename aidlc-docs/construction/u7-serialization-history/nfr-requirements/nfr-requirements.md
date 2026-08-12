# NFR Requirements — U7 Serialization, Autosave, History, Clipboard

## Scope
Unit U7 (JSON export/import, debounced in-memory autosave status, snapshot undo/redo, copy/paste). Builds on U1–U6. Frontend-only; session-only (no localStorage).

## Performance
| ID | Requirement |
|---|---|
| NFR-P-60 | Undo/redo/save/export feel instant for ≤100 nodes; **no ms CI gate** |
| NFR-P-61 | History snapshots via `structuredClone` (sync on mutation commit / gesture end) |
| NFR-P-62 | Autosave status debounce **500 ms** (FD); no file I/O on debounce |
| NFR-P-63 | No continuous rAF for history; existing canvas rAF patterns unchanged |

## Scalability
| ID | Requirement |
|---|---|
| NFR-S-60 | Responsiveness claim remains **≤100 nodes** |
| NFR-S-61 | Undo stack cap **100** snapshots (FD); oldest dropped |
| NFR-S-62 | Single-user in-memory only; no multi-tab sync |

## Availability / Resiliency
| ID | Requirement |
|---|---|
| NFR-A-60 | No SLA; local SPA; refresh clears state (documented) |
| NFR-A-61 | DR N/A |
| NFR-A-62 | Invalid import → reject; prior GraphStore preserved; `canvasError` + **inline Import dialog message** |
| NFR-A-63 | Unexpected throws in serialize/history/clipboard → `canvasError`; **no toast library** |
| NFR-A-64 | Successful Save/Export → brief `canvasStatus` |

## Security
| ID | Requirement |
|---|---|
| NFR-SEC-60 | Security Baseline disabled; hygiene only |
| NFR-SEC-61 | **No new npm packages** |
| NFR-SEC-62 | JSON via `JSON.parse` / stringify only — **no `eval`** |
| NFR-SEC-63 | Imported strings bound as text; no `innerHTML` of JSON |
| NFR-SEC-64 | Download via `Blob` + object URL; revoke URL after click |

## Usability / Accessibility
| ID | Requirement |
|---|---|
| NFR-U-60 | Undo/Redo/Save/Export/Import keyboard-operable with accessible names; **no** full WCAG audit / no focus-trap requirement |
| NFR-U-61 | Shortcuts ignored in input/textarea/select |
| NFR-U-62 | Download filename: `{sanitizedName}-{ISO-date}.json` (fallback `workflow.json`) |
| NFR-U-63 | Evergreen desktop browsers only (carry prior; `structuredClone` available) |

## Maintainability / Testing
| ID | Requirement |
|---|---|
| NFR-M-60 | Pure `serialize` / `deserialize` / `validate` in `core/domain`; HistoryService + thin UI |
| NFR-M-61 | `fast-check`: serialize ↔ deserialize round-trip on valid generated docs (PBT-02) |
| NFR-M-62 | Example: invalid import rejected; stacks cleared on successful import |
| NFR-M-63 | Example: undo/redo / copy-paste smoke via facade or service tests |

## Explicit Deferrals
- Soft ms budgets / FPS CI
- Focus trap in Import dialog
- History undo equality PBT beyond examples (Q4=A)
- localStorage / backend persist
- OS system clipboard JSON

## Locked answers
| # | Answer |
|---|---|
| Q1 | A — qualitative performance |
| Q2 | A — `structuredClone` |
| Q3 | A — baseline a11y |
| Q4 | A — serialize round-trip PBT + invalid import examples |
| Q5 | A — no new libraries |
| Q6 | B — canvasError + Import inline validation |
| Q7 | A — sanitized name + ISO date filename |

## Extension Compliance

### Resiliency
| Area | Status |
|---|---|
| Import reject preserves state | Compliant intent |
| Errors → canvasError | Compliant intent |
| Inline import validation | Compliant intent (Q6=B) |
| DR / HA | N/A |

### PBT Partial
| Area | Status |
|---|---|
| Serialize ↔ deserialize round-trip | Compliant intent (PBT-02) |
| Invalid import examples | Compliant intent |

### Security Baseline
Skipped (disabled)
