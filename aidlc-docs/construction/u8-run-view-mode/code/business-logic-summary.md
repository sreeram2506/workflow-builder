# Business Logic Summary — U8 Simulated Run & View Mode

## Delivered
- Pure `run-order.ts`: `findRunSeeds` (Trigger ∪ indegree-0), `computeRunOrder` (BFS, visit once)
- `RunSimulationService`: RxJS sequential `running` → delay → `success`; `takeUntil` stopper; reduced-motion ≤50 ms; `environment.runStepDelayMs` (default 400)
- `GraphStore.patchNodeStatuses(..., { skipHistory: true })` for Run / Reset
- UiStore `runActive` + `runAnnouncement`
- Facade: `startRun` / `stopRun` / `resetStatuses` / `setEditorMode` / `toggleEditorMode` (mode switch stops Run)
- Soft fails: empty → “Nothing to run”; no seeds → “No start node”; throws → `canvasError`

## Tests
- `run-order.spec.ts`: examples + fast-check order ⊆ ids / predecessor invariant
- `workflow.facade.spec.ts`: Start/Stop, Reset, view lock + Run allowed, mode-switch Stop, empty soft-fail
