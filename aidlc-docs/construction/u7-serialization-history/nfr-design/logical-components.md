# Logical Components — U7 (NFR Design)

## In-scope

### workflow.serialize (pure module)
| Field | Detail |
|---|---|
| **Type** | Pure TS under `core/domain/workflow.serialize.ts` |
| **APIs** | `serializeWorkflow`, `parseWorkflowJson`, `validateSerialized`, `allowlistSerialized`, `toDownloadFilename` |
| **PBT** | Round-trip serialize ↔ deserialize |

### SerializationService (injectable)
| Field | Detail |
|---|---|
| **Wraps** | Pure serialize helpers + download trigger (`Blob` / object URL) |
| **Used by** | Facade / TopBar Save & Export |

### HistoryService (injectable)
| Field | Detail |
|---|---|
| **Owns** | `undoStack` / `redoStack` (cap 100), `suppressRecording`, `canUndo` / `canRedo` |
| **APIs** | `clear`, `undo`, `redo`, `beginGesture` / `endGesture` (drag coalesce), internal `pushFromDocument` |
| **Clone** | `structuredClone` |

### GraphStore history interceptor (Q2=B)
| Field | Detail |
|---|---|
| **Pattern** | Before eligible document writes, if history recording enabled → ask `HistoryService` to snapshot **current** doc, then apply write |
| **Eligible** | Node/edge/position/waypoint/document replace (import uses suppress or clear-after) |
| **Excluded** | Viewport-only updates (pan/zoom/fit), or mark viewport writes as `skipHistory` |
| **Gesture** | Node drag: `beginGesture` once → moves skip push → `endGesture` optional finalize |

### AutoSaveService (small)
| Field | Detail |
|---|---|
| **Impl** | `Subject` + `debounceTime(500)` |
| **On fire** | Set `dirty=false`, `lastSavedAt`, optional `canvasStatus` quiet update |
| **Triggered by** | Graph mutation notifications (from store or facade after write) |

### Clipboard (in-app)
| Field | Detail |
|---|---|
| **Hold** | `ClipboardPayload` (nodes + internal edges) |
| **May live** | Dedicated tiny service or History/UiStore field — prefer `ClipboardService` or facade-private signal |

### ImportWorkflowDialogComponent (new)
| Field | Detail |
|---|---|
| **Owns** | File input + paste textarea; inline validation message; Confirm/Cancel |
| **Composed into** | Shell or TopBar |
| **Calls** | `facade.importJson(text)` |

### TopBarComponent (evolve)
| Field | Detail |
|---|---|
| **Enable** | Undo / Redo / Save; add Export + open Import dialog |
| **Run** | Remains disabled (U8) |

### WorkflowFacade (evolve)
| Field | Detail |
|---|---|
| **APIs** | `undo`, `redo`, `saveDownload` / `exportDownload`, `importJson`, `copySelection`, `pasteClipboard` |
| **Import** | parse via SerializationService → validate → `history.clear` → `setDocument` (with suppress around replace as needed) |
| **Copy/paste** | Build payload from selection; paste remaps ids + offset; store write records history via interceptor |

### UiStore (evolve)
| Field | Detail |
|---|---|
| **Reuse** | `canvasError`, `canvasStatus` |
| **Optional** | `autoSaveDirty` if not on AutoSaveService alone |

## Explicitly out of scope
| Component | Reason |
|---|---|
| TopBar-only inline import (no component) | Q4 = B |
| Facade-only history (no service) | Q1 = A |
| Pure-module-only serialize (no service) | Q5 = B (service wraps pure) |
| OS clipboard | FD |
| Queues / caches / cloud | Q7 SKIP |

## Dependency diagram

```text
TopBar: Undo/Redo/Save/Export/Import
  -> facade.undo/redo
       -> HistoryService.pop + GraphStore.setDocument (suppress)
  -> SerializationService.download(serialize(doc))
  -> ImportWorkflowDialog -> facade.importJson
       -> SerializationService.parse + allowlist + validate
       -> on fail: inline msg + canvasError
       -> on ok: History.clear; GraphStore.setDocument(replace)

Graph mutating write (facade -> GraphStore)
  -> interceptor: HistoryService.push snapshot (unless suppress / viewport-only / mid-gesture)
  -> apply write
  -> AutoSaveService.next() -> debounce 500ms -> dirty clear

Copy/Paste
  -> facade builds ClipboardPayload / remaps ids
  -> GraphStore batch add (history via interceptor)
```

## Note on Q1=A + Q2=B
`HistoryService` owns stacks; **GraphStore** invokes it on writes (interceptor), rather than each facade method manually calling `pushBefore`. Facade still owns gesture begin/end and undo/redo/import orchestration.

## Infrastructure
Confirm **Infrastructure Design SKIP** for U7.
