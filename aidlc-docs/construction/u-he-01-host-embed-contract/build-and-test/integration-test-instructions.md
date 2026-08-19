# Integration Test Instructions

## Purpose
U-HE-01 host document I/O, optional Save/Run hooks, and fill-host height in the same Angular SPA.

This SPA has one construction unit for this increment. Automated checks live in the Vitest suite (`npm test`). There is no separate multi-service integration runner.

## Test Scenarios

### Scenario 1: Load `[document]`; invalid keeps last good
- **Description**: Valid object replaces the canvas; non-object / invalid parse keeps last good + canvas error; no throw
- **Setup**: `npm test`
- **Test Steps**: `workflow.facade.spec.ts` host embed contract; `shell-layout.embed-contract.spec.ts` `[document]` cases
- **Expected Results**: sample nodes on success; previous `nodeCount` on failure; non-secret error
- **Cleanup**: none

### Scenario 2: getDocument / dirty / documentChange
- **Description**: After load, dirty is false; committed edit sets dirty; `getDocument` flushes nested onto the solution agent; shell emits `documentChange` after successful load
- **Setup**: `npm test`
- **Test Steps**: facade dirty / nested flush cases; shell `documentChange` subscription
- **Expected Results**: nested edits present on the agent in `getDocument()` while still nested; emit has document `id`
- **Cleanup**: none

### Scenario 3: Save/Run handlers vs defaults
- **Description**: Provider `persist.save` / `persist.run` skip defaults; unbound Save still `saveDownload`; unbound Run still `startRun`; bound shell `(save)` wins over provider; Export unchanged
- **Setup**: `npm test`
- **Test Steps**: facade persist describe; embed-contract Save output + Export
- **Expected Results**: handler called with a document; `saveDownload` / `startRun` not called when hooked
- **Cleanup**: none

### Scenario 4: Fill-host height
- **Description**: Shells use `height: 100%`, not `100vh`; no `[height]` input
- **Setup**: `npm test`
- **Test Steps**: `shell-layout.embed-contract.spec.ts` fill-host height
- **Expected Results**: compiled styles contain `height: 100%` and not `100vh`
- **Cleanup**: none

### Scenario 5: Manual embed / try (optional)
- **Description**: Host panel with definite height; bind `[document]` / `(documentChange)` / persist or `(save)`/`(run)`
- **Setup**: `npm start`; local try harness if present (`/try-ui`). Do not commit `src/app/try/`
- **Test Steps**: See `docs/workflow-builder-ui-embed.md` (Document I/O and persist)
- **Expected Results**: canvas shows host graph; Save does not blob-download when hooked; shell fills the panel
- **Cleanup**: stop `ng serve` if started only for this stage

## Setup Integration Test Environment

### 1. Start Required Services
```bash
npm start
```

No backend is required.

### 2. Configure Service Endpoints
None. Persist handlers are in-process callbacks.

## Run Integration Tests

### 1. Execute Integration Test Suite
```bash
npm test
```

### 2. Verify Service Interactions
See `docs/workflow-builder-ui-embed.md` (`[document]`, persist first-win, fill-host height).

### 3. Cleanup
Stop `ng serve` if started only for this stage.
