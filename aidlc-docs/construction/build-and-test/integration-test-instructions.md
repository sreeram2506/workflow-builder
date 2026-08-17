# Integration Test Instructions

## Purpose
U-LIM-01 overlay compose, library featured strip, drop mapping, and canvas icon.

## Test Scenarios

### Scenario 1: Host palettes replace featured and keep extras
- **Description**: Non-empty sanitized `[palettes]` omits static Condition/Decision/Repeater and lists host logic cards
- **Setup**: `npm test`
- **Test Steps**: `enso-task-catalog.service.spec.ts` (omit static featured; host extras); `left-sidebar.palette.spec.ts` (two Conditions when palettes present)
- **Expected Results**: AIAgent-only host list has no static Condition; Extra If appears when catalog has two Conditions and palettes are bound
- **Cleanup**: none

### Scenario 2: Drop copies metadata and icon onto the canvas node
- **Description**: Palette item extras persist on `node.data` and render on `wb-workflow-node`
- **Setup**: `npm test`
- **Test Steps**: `node.factory.spec.ts`; `workflow-node.component.spec.ts`
- **Expected Results**: `data.metadata` / `data.iconUrl` / `data.iconPath` copied; canvas shows path or img inside the logic frame
- **Cleanup**: none

### Scenario 3: Try host Extra If (manual)
- **Description**: Local try harness (gitignored `src/app/try/`; do not commit the try route)
- **Setup**: `npm start`; open `/try-ui` if the local try route is enabled
- **Test Steps**: Catalog preset with Extra If; drag Extra If to the canvas
- **Expected Results**: Featured strip shows Extra If with its icon; dropped Condition keeps that icon inside the diamond
- **Cleanup**: stop `ng serve` if started only for this stage

## Setup Integration Test Environment

### 1. Start Required Services
```bash
npm start
```

### 2. Configure Service Endpoints
None. Host overlay skips Enso when `[palettes]` is bound.

## Run Integration Tests

### 1. Execute Integration Test Suite
```bash
npm test
```

### 2. Verify Service Interactions
See `docs/workflow-builder-ui-embed.md`.

### 3. Cleanup
Stop `ng serve` if started only for this stage.
