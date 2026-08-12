# Business Rules — U7 Serialization, Autosave, History, Clipboard

## BR-U7-01 — Session-only persistence
All autosave / history / clipboard state is in-memory. Browser refresh clears the app. No localStorage/IndexedDB/backend.

## BR-U7-02 — Serialize shape
Export/Save JSON includes `schemaVersion: 1` and a complete serializable `WorkflowDocument` (id, name, status, version, updatedAt, viewport, nodes, edges with waypoints/labels/data).

## BR-U7-03 — Import validation
Reject if: not JSON; missing/invalid `schemaVersion` (major ≠ 1); missing required collections; malformed nodes/edges; dangling edge endpoints. On reject: prior GraphStore unchanged + `canvasError`.

## BR-U7-04 — Import replace
Successful import **replaces** the entire document. History undo/redo stacks are **cleared**. Selection cleared.

## BR-U7-05 — Autosave debounce
After a graph mutation, debounce **500 ms** then refresh in-memory autosave snapshot / clean status. Does not write files by itself.

## BR-U7-06 — Save / Export download
Top-bar **Save** and **Export** download the current serialized JSON. ⌘/Ctrl+S does the same. Brief non-error status allowed (`canvasStatus`).

## BR-U7-07 — History eligibility
Push snapshots for: node create/delete/move (gesture-coalesced), edge create/delete, waypoint add/move/remove, layout/route batch, `patchNode` / `patchEdge` (Properties Save).  
**Exclude**: pan, zoom, fit-to-content alone, selection, theme, sidebar collapse, Properties draft keystrokes, Route/Layout only via their graph mutations (those count).

## BR-U7-08 — History depth
Undo stack max **100**. Oldest dropped when exceeded. Redo cleared on new mutation.

## BR-U7-09 — Coalesce node drag
One history entry per node-drag gesture (commit on pointer-up), not per rAF move.

## BR-U7-10 — Undo/redo restore
Restoring a snapshot replaces GraphStore document; does not re-push history for the restore itself (or uses a transaction flag to suppress).

## BR-U7-11 — Copy set
Clipboard includes selected nodes and edges whose **both** endpoints are in the selection.

## BR-U7-12 — Paste
New node/edge ids; positions += (40, 40); pasted nodes become selection; one history entry.

## BR-U7-13 — Shortcut guards
Ignore undo/redo/copy/paste/save shortcuts when focus is in `input`, `textarea`, `select`, or contenteditable (except allow Save if desired — **locked**: ignore in those fields for all listed shortcuts).

## BR-U7-14 — View mode
If `editorMode === 'view'`, mutating actions (import replace, paste, undo/redo apply, Save download still OK as read export?) — **locked for U7**: treat like other mutations — **disable** undo/redo/paste/import that mutate; **Export/Save download allowed** as read-only export of current doc. (Full view lock remains U8; prepare guards.)

## BR-U7-15 — Fail soft
Unexpected throws in serialize/history → `canvasError`; no toast spam.
