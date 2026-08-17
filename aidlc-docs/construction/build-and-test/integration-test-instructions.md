# Integration Test Instructions

## Purpose
U-PAL-01 palette merge/helpers plus U-PAL-02 catalog compose and Agents Library UI.

## Test Scenarios

### Scenario 1: Config core → catalog wiring
- **Description**: Resolved `features().palette` filters catalog emit and sidebar cards
- **Setup**: `npm test`
- **Test Steps**: helper specs + `enso-task-catalog.service.spec.ts` + `left-sidebar.palette.spec.ts`
- **Expected Results**: omit vs `[]` vs present; empty-remote empty-state; error static + banner (no mocks)
- **Cleanup**: none

### Scenario 2: JSON → running SPA
- **Description**: `/assets/wb-ui-config.json` palette overlay after focus reload
- **Setup**: `npm start`
- **Test Steps**: copy `src/assets/examples/wb-ui-config.palette-host.json` over the active file; click back into the browser
- **Expected Results**: Claims Agent + Policy Agent; featured types per example allow-list; restore with `echo '{}' > src/assets/wb-ui-config.json`
- **Cleanup**: restore JSON

## Setup Integration Test Environment

### 1. Start Required Services
```bash
npm start
```

### 2. Configure Service Endpoints
None for palette JSON. Enso HTTP is optional; missing/failing auth uses the error path (static + banner).

## Run Integration Tests

### 1. Execute Integration Test Suite
```bash
npm test
```

### 2. Verify Service Interactions
See `docs/workflow-builder-ui-config-try.md`.

### 3. Cleanup
Stop `ng serve` if started only for this stage. Restore `src/assets/wb-ui-config.json` to `{}`.
