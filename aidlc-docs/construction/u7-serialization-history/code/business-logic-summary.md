# Business Logic Summary — U7 Serialization, Autosave, History, Clipboard

## Delivered
| Module | Role |
|---|---|
| `workflow.serialize.ts` | `schemaVersion: 1`, serialize, parse, allowlist, validate, filename |
| `SerializationService` | Download via Blob + object URL |
| `HistoryService` | Undo/redo stacks (cap 100), gesture coalesce, suppress |
| `GraphStore` interceptor | Push snapshot before eligible writes; viewport skips history |
| `AutoSaveService` | RxJS debounce 500 ms dirty/lastSaved |
| `ClipboardService` | In-app copy payload |
| Facade | undo/redo, save/export download, importJson, copy/paste |

## Behaviors
- Save/Export download JSON; Import file+paste replaces document
- Invalid import preserves prior state
- Node/waypoint drag: one history entry per gesture
- Layout: one history gesture covering positions + route

## Tests
- Serialize PBT round-trip + invalid/allowlist examples
- Facade undo / import reject / copy-paste smoke
