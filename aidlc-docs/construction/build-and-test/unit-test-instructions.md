# Unit Test Execution

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
npm test
```

### 2. Review Test Results
- **Expected**: 259 tests pass, 0 failures (35 files)
- **Test Coverage**: not gated
- **Test Report Location**: terminal (Vitest)

Verified 2026-08-17: 259 passed / 35 files.

### 3. Fix Failing Tests
1. Read Vitest output
2. Fix source or spec
3. Rerun `npm test`

**U-LIM-01 focus**
- `icon-url.spec.ts` — P-LIM-01, P-LIM-02
- `palette-host.helpers.spec.ts` / `.pbt.spec.ts` — extras, featured replace, P-LIM-03..05
- `merge-ui-features.spec.ts` — JSON defaultAgents extras
- `enso-task-catalog.service.spec.ts` — omit static featured when host palettes present
- `node.factory.spec.ts` — `data.metadata`, `data.iconUrl` / `data.iconPath`
- `left-sidebar.palette.spec.ts` — extra Conditions, library icons
- `workflow-node.component.spec.ts` — canvas host icon
