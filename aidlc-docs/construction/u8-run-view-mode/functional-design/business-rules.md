# Business Rules — U8 Simulated Run & View Mode

## BR-U8-01 — Walk algorithm
Build visit order by BFS from seeds = nodes with `type === 'Trigger'` plus any remaining indegree-0 nodes (deduped). Follow outgoing edges; skip already visited. Do **not** evaluate Condition/Decision predicates — all outgoing edges enqueue targets.

## BR-U8-02 — No seeds / empty
- `nodes.length === 0` → `canvasStatus` “Nothing to run”; do not start
- Seeds empty → `canvasStatus` “No start node”; do not start

## BR-U8-03 — Step timing
For each node in order: set `running`, wait **400 ms**, set `success`. Sequential (one node at a time).

## BR-U8-04 — Run start reset
On successful Run start, set **all** node statuses to `idle` before the walk.

## BR-U8-05 — Post-run statuses
Leave final statuses after completion. **Reset statuses** sets all to `idle` without walking.

## BR-U8-06 — Run concurrency
While `runActive`, **Run** is disabled. **Stop** cancels timers, clears `runActive`, leaves statuses unchanged.

## BR-U8-07 — Run in view mode
Run/Stop/Reset-statuses allowed in view mode. They must not create/delete/move nodes or edges.

## BR-U8-08 — View mode locks (mutate)
Disabled / no-op in view: palette create, node drag, edge draw/reshape, Properties Save, Layout/Route, Import replace, Undo/Redo/Paste, Delete, history-mutating shortcuts.

## BR-U8-09 — View mode allows
Pan, zoom, minimap, selection (inspect), theme toggle, Export, Save-download, Run/Stop/Reset-statuses, Properties **readonly** inspect (US-6.2).

## BR-U8-10 — Mode indicator
When `editorMode === 'view'`, show a clear **View** indicator in the shell/top bar.

## BR-U8-11 — Mode switch during run
Switching edit↔view while run active **Stops** the simulation (same as Stop).

## BR-U8-12 — History
Status-only patches during Run should **not** flood undo (skip history or suppress for status writes). Reset statuses likewise skip history.

## BR-U8-13 — Fail soft
Unexpected throws → `canvasError`; clear `runActive`.
