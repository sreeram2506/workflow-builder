# Frontend Components — U7 Serialization, Autosave, History, Clipboard

## Purpose
Enable top-bar history/save/export/import and global shortcuts; thin UI over facade + services.

## Existing (touched)
| Component | Change |
|---|---|
| `TopBarComponent` | Enable Undo / Redo / Save; add Export + Import entry (menu or buttons) |
| `WorkflowFacade` | `undo` / `redo` / `exportDownload` / `importJson` / `copySelection` / `pasteClipboard` / wire history around mutations |
| `CanvasViewport` / shell | Optional: contribute drag end → `history.commitGesture()` |
| `CanvasHost` | Show `canvasStatus` for Saved/Exported; errors for import fail |

## New (presentation)
| Piece | Role |
|---|---|
| Import dialog | File input + textarea paste; Confirm / Cancel |
| Hidden file input | For Import file picker |
| Keyboard listener | Host-level (shell or `app`) for shortcuts with input guard |

## Interaction rules
1. Undo/Redo disabled when stacks empty or view mode.
2. Save/Export always can download current doc in edit mode; Export also OK in view mode.
3. Import opens dialog; success replaces canvas; failure keeps state + error.
4. Copy with empty selection → no-op; Paste with empty clipboard → no-op.

## ASCII — top bar

```text
[Logo] [Undo] [Redo] [Save] [Run disabled] [Export▾?] [Import]
              title · status                         [Theme]
```

## Non-goals
- Full command palette
- OS clipboard sync
- Properties live-history while typing
