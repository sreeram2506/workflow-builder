# Unit Test Execution

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
npm test
```

(`package.json`: `ng test --watch=false`, Vitest.)

### 2. Review Test Results
- **Expected**: 298 tests pass, 0 failures (40 files)
- **Test Coverage**: not gated
- **Test Report Location**: terminal (Vitest)

Verified 2026-08-19: 298 passed / 40 files.

### 3. Fix Failing Tests
1. Read Vitest output
2. Fix source or spec
3. Rerun `npm test`

**U-HE-01 focus**
- `workflow.serialize.spec.ts` — `parseWorkflowUnknown` non-object fail; missing `schemaVersion` still parses; PBT JSON + object round-trip
- `workflow.facade.spec.ts` — valid load; invalid load keeps last good; dirty after edit / clean after Save; `getDocument` flushes nested; persist.save/run vs defaults; instance save wins over provider
- `shell-layout.embed-contract.spec.ts` — `[document]` load + `documentChange`; invalid payload keeps graph; bound `(save)` skips `saveDownload`; Export still wired; shells not `100vh`

**Regression (prior units)**
- Agent enter without tabs, Host Properties, palettes, chrome flags, Condition edges, Router connectors
