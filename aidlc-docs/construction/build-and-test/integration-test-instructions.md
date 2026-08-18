# Integration Test Instructions

## Purpose
U-RAD-01 catalog omit-without-adapter empty-remote, nested palettes overlay, Repeater empty pickers, and adapter-when-omit still working.

This SPA has one construction unit. Automated checks live in the Vitest suite (`npm test`). There is no separate multi-service integration runner.

## Test Scenarios

### Scenario 1: Omit palettes without adapter is empty-remote
- **Description**: `loadCatalog` with no host palettes and no adapter returns empty-remote (not static featured, not Enso HTTP)
- **Setup**: `npm test`
- **Test Steps**: `enso-task-catalog.service.spec.ts`; `enso-task-catalog.service.pbt.spec.ts`
- **Expected Results**: `emptyRemote === true`, `source === 'empty'`, `items` / `categories` empty, `error` null; no `Condition` / `Decision` / `Repeater` static featured keys
- **Cleanup**: none

### Scenario 2: Nested Skills Library uses the same palettes overlay
- **Description**: `[palettes]` drives nested skill rows; omit or `[]` shows an empty list; Add uses the facade overlay path
- **Setup**: `npm test`
- **Test Steps**: `nested-skills-library.component.spec.ts`; `workflow.facade.spec.ts`
- **Expected Results**: empty list when palettes omitted or `[]`; listed items Add via `addSkillFromPaletteItem`; `addSkillToAgent` does not look up deleted mock skills
- **Cleanup**: none

### Scenario 3: Repeater pickers have no dummy workflows
- **Description**: Workflow/version option lists are empty; existing `repeater.workflowId` / `versionId` on a node are not cleared by the catalog deletion
- **Setup**: `npm test`
- **Test Steps**: `logic-node-rules.spec.ts`; right-sidebar Repeater option lists in `right-sidebar.component.ts`
- **Expected Results**: no dummy workflow names in options; schema `options: []`
- **Cleanup**: none

### Scenario 4: Adapter-when-omit still works (U-PAL-02)
- **Description**: Host adapters on omit still load; adapter **failure** still uses static fallback plus banner (not empty-remote)
- **Setup**: `npm test`
- **Test Steps**: existing adapter success / empty / failure cases in `enso-task-catalog.service.spec.ts`
- **Expected Results**: success maps adapter items; failure is `errorLoad` + static catalog, not `source: 'empty'`
- **Cleanup**: none

### Scenario 5: Default SPA empty library (manual)
- **Description**: Serve without `[palettes]` and without adapters
- **Setup**: `npm start` (no `/enso-api` proxy)
- **Test Steps**: Open the default app; inspect left library / featured strip
- **Expected Results**: empty-remote UI (`palette-empty-remote`); featured strip hidden; no Enso network calls
- **Cleanup**: stop `ng serve` if started only for this stage

## Setup Integration Test Environment

### 1. Start Required Services
```bash
npm start
```

No backend, proxy, or catalog token is required.

### 2. Configure Service Endpoints
None. Catalog HTTP URLs were removed.

## Run Integration Tests

### 1. Execute Integration Test Suite
```bash
npm test
```

### 2. Verify Service Interactions
See `docs/workflow-builder-ui-embed.md` (omit without adapter = empty-remote; adapter-when-omit kept).

### 3. Cleanup
Stop `ng serve` if started only for this stage.
