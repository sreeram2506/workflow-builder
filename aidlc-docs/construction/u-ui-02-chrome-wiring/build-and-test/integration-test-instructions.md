# Integration Test Instructions — U-UI-02

## Purpose
Confirm U-UI-01 resolved flags actually hide/show shell chrome (U-UI-01 + U-UI-02 together).

## Test Scenarios

### Scenario 1: Config service → shell gates
- **Description**: `UiConfigService.applyLayers` / JSON merge changes which regions `ShellLayout` mounts
- **Setup**: `npm test` (jsdom TestBed)
- **Test Steps**: covered by `ui-chrome-gates.spec.ts` (library off, Save shortcut, canvas chrome master, zoom-only, inset)
- **Expected Results**: `data-testid` nodes absent when flags are false; graph host stays when `canvas.enabled` is false
- **Cleanup**: none

### Scenario 2: JSON file → runtime chrome (manual)
- **Description**: Active `wb-ui-config.json` drives the running SPA
- **Setup**: `npm start` (or reuse the existing dev server)
- **Test Steps**:
  1. Open `http://localhost:4200/`
  2. Copy an example over the active file:
     ```bash
     cp src/assets/examples/wb-ui-config.all-off.json src/assets/wb-ui-config.json
     ```
  3. Click back into the browser window (focus reload) or refresh
  4. Confirm libraries, top bar, and canvas chrome are hidden; grid/nodes still exist if a graph is present
  5. Restore:
     ```bash
     echo '{}' > src/assets/wb-ui-config.json
     ```
- **Expected Results**: chrome follows flags; theme is `topBar.theme` only (no root `themeToggle`)
- **Cleanup**: restore `{}` or the intended working JSON

### Scenario 3: Palette agent → single tab
- **Description**: Clicking the same library Blank Agent twice must not open a second tab
- **Setup**: defaults (`{}` or all-on), `npm start`
- **Test Steps**: click Blank Agent twice
- **Expected Results**: one node, one tab
- **Cleanup**: none

## Setup Integration Test Environment

### 1. Start Required Services
```bash
npm start
```

No extra containers. Optional Enso catalog uses `proxy.conf.json` if that backend is running; chrome gates do not depend on it.

### 2. Configure Service Endpoints
None. Config URL is `/assets/wb-ui-config.json`.

## Run Integration Tests

### 1. Execute Integration Test Suite
```bash
npm test
```

There is no separate `test:integration` script; chrome gates run in the unit suite.

### 2. Verify Service Interactions
- U-UI-01 merge + initializer still pass
- U-UI-02 shell gates pass
- Manual smoke: `docs/workflow-builder-ui-config-try.md`

### 3. Cleanup
Stop `ng serve` if you started it for this stage. Leave it running if you were already developing.
