# NFR Design Patterns — U7 Serialization, Autosave, History, Clipboard

## Performance
| Pattern | Application |
|---|---|
| `structuredClone` snapshots | History pushes deep clones of `WorkflowDocument` before eligible writes |
| Stack cap | Max **100** undo entries; drop oldest; clear redo on new mutation |
| Drag coalesce | GraphStore/gesture flag: record one snapshot at node-drag **start**; ignore intermediate moves until pointer-up |
| Autosave debounce | RxJS `Subject` + `debounceTime(500)` updates dirty/lastSaved status only (no file I/O) |
| Download | Sync serialize → `Blob` → object URL → click → revoke |

## Scalability
| Pattern | Application |
|---|---|
| ≤100 nodes | Carry-forward; snapshot cost acceptable under qualitative NFR |
| In-app clipboard | Single `ClipboardPayload` signal/service field |

## Resilience
| Pattern | Application |
|---|---|
| Validate-then-replace | Import parses → allowlist → validate → only then `setDocument` |
| Preserve on fail | Invalid import never touches GraphStore; `canvasError` + **inline dialog message** |
| Suppress on undo/redo | `HistoryService.suppressRecording` while restoring snapshots |
| Fail soft | Unexpected throws → `canvasError`; success Save/Export → `canvasStatus` |

## Security (hygiene)
| Pattern | Application |
|---|---|
| `JSON.parse` only | No `eval` |
| Allowlist import | Strip unknown top-level keys; keep only known `WorkflowDocument` + `schemaVersion` fields (Q6=B) |
| Text binding | Import errors / JSON preview as text |
| Object URL revoke | After download trigger |
| No new packages | File API + Blob only |

## Testing
| Pattern | Application |
|---|---|
| PBT | serialize ↔ deserialize round-trip on valid docs |
| Example | Invalid import rejected; allowlist strips unknowns; undo/redo smoke |

## Infrastructure Design Alignment
**SKIP** — in-browser only (Q7=A).
