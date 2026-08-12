# Domain Entities — U7 Serialization, Autosave, History, Clipboard

## Carried from prior units
| Entity | Use |
|---|---|
| `WorkflowDocument` | Snapshot / serialize root |
| `WorkflowNode` / `WorkflowEdge` | Graph payload; copy/paste subset |
| `Viewport` | Included in document snapshots & JSON |

## New / logical entities

### SerializedWorkflow
| Field | Meaning |
|---|---|
| `schemaVersion` | `1` |
| …document fields | Same as `WorkflowDocument` (or nested `document`) |

**Locked**: Prefer flat `{ schemaVersion, ...WorkflowDocument fields }` for simplicity.

### HistoryState
| Field | Meaning |
|---|---|
| `undoStack` | `WorkflowDocument[]` (deep clones), max 100 |
| `redoStack` | `WorkflowDocument[]` |
| `suppressRecording` | Flag while applying undo/redo |

### AutoSaveState
| Field | Meaning |
|---|---|
| `lastSavedAt` | Timestamp of last debounce flush |
| `dirty` | True after mutation until debounce fires |

### ClipboardPayload
| Field | Meaning |
|---|---|
| `nodes` | Cloned selected nodes |
| `edges` | Edges with both ends selected |

### Services (logical)
| Name | Role |
|---|---|
| Serialization helpers (pure) | `serializeWorkflow` / `deserializeWorkflow` / `validateSerialized` |
| HistoryService | Stack push/undo/redo/clear; coalesce API |
| AutoSave coordinator | 500 ms debounce status/snapshot |
| Clipboard (in-app) | Hold last copy payload |

## Explicitly not entities
- Remote persist records
- OS clipboard MIME types (in-app clipboard only)
- Per-command inverse objects
