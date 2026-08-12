# Tech Stack Decisions — U7 Serialization, Autosave, History, Clipboard

## Carry forward
| Concern | Choice |
|---|---|
| Framework | Angular 20 standalone + signals |
| State | GraphStore + UiStore + WorkflowFacade |
| Tests | Vitest + fast-check (Partial PBT) |
| Status / errors | `canvasStatus` / `canvasError` |

## U7-specific
| Concern | Choice | Rationale |
|---|---|---|
| Snapshot clone | `structuredClone` | NFR Q2=A |
| Download | `Blob` + `URL.createObjectURL` + temporary `<a download>` | Q5=A; filename Q7=A |
| Import file | `<input type="file" accept="application/json,.json">` | FD |
| Import paste | Dialog textarea + parse | FD |
| In-app clipboard | Service/signal holding `ClipboardPayload` | Q9 FD; not OS clipboard |
| History | `HistoryService` (or equivalent) with undo/redo stacks | App design deferred → U7 |
| Autosave | Debounce timer (RxJS or facade timeout) 500 ms | FD Q5=B |
| Extra npm packages | **None** | Q5=A |

## Explicitly excluded
- localStorage / IndexedDB helpers
- Toast libraries
- Immutable.js / Immer (unless later stop-and-ask)
- File-saver npm package
