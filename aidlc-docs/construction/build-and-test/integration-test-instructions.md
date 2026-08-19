# Integration Test Instructions

## Purpose
U-NP-01 packages the existing builder as `enso-workflow-builder` while the SPA demo stays green. Hosts install the tarball (or later the registry package) and import the public API.

This increment has one construction unit. Automated checks live in Vitest (`npm test`) plus library `ng build` / `npm pack`. There is no separate multi-service runner.

## Test Scenarios

### Scenario 1: Public API from package name
- **Description**: Hosts import shells, provider, and facade from `'enso-workflow-builder'`
- **Setup**: `npm test` (tsconfig.spec paths → `projects/enso-workflow-builder/src/public-api.ts`)
- **Test Steps**: `src/public-package-api.spec.ts`
- **Expected Results**: exports exist; selectors `wb-shell-layout` and `wb-agent-skills-shell`
- **Cleanup**: none

### Scenario 2: Library build + pack
- **Description**: ng-packagr emits dist; `npm pack` produces `enso-workflow-builder-0.1.0.tgz`
- **Setup**: `npm install`
- **Test Steps**:
  ```bash
  npm run build:lib
  npm run pack:lib
  tar -tzf dist/enso-workflow-builder/enso-workflow-builder-0.1.0.tgz
  ```
- **Expected Results**: FESM + `index.d.ts` + `styles/tokens.css`; name `enso-workflow-builder` version `0.1.0`; Angular listed in peerDependencies
- **Cleanup**: tarball stays under `dist/` (gitignored)

### Scenario 3: Tarball does not include try/ or secrets
- **Description**: Packed files must not include `src/app/try/` or `.env`
- **Setup**: after Scenario 2
- **Test Steps**: `tar -tzf dist/enso-workflow-builder/enso-workflow-builder-0.1.0.tgz | grep -E 'try/|\.env'` must print nothing
- **Expected Results**: no try/, no `.env`
- **Cleanup**: none

### Scenario 4: SPA still works
- **Description**: Demo app tests and production build stay green after the library extract
- **Setup**: `npm test` and `npm run build`
- **Test Steps**: existing chrome / palettes / Properties / nested agent / embed-contract specs
- **Expected Results**: 300 tests pass; SPA `dist/workflow-builder`
- **Cleanup**: none

### Scenario 5: Manual host install (optional)
- **Description**: Install the tarball in a separate Angular 20 app
- **Setup**: `npm run pack:lib`; in the host: `npm install ./path/to/enso-workflow-builder-0.1.0.tgz` plus Angular peers
- **Test Steps**: Follow `docs/workflow-builder-ui-embed.md` (package imports, tokens CSS, fill-host height)
- **Expected Results**: host can render `wb-shell-layout`; no copy of this repo’s `src/app`
- **Cleanup**: do not `npm publish`; do not commit `src/app/try/`

## Setup Integration Test Environment

### 1. Start Required Services
```bash
npm start
```

No backend is required. Optional for the SPA demo only.

### 2. Configure Service Endpoints
None. This is a client library.

## Run Integration Tests

### 1. Execute Integration Test Suite
```bash
npm test
npm run pack:lib
```

### 2. Verify Service Interactions
See `docs/workflow-builder-ui-embed.md` (`npm install enso-workflow-builder`, package imports, styles, pack path).

### 3. Cleanup
Stop `ng serve` if started only for this stage. Do not commit `dist/` or `*.tgz`.
