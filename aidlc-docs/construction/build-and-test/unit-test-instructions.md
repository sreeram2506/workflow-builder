# Unit Test Execution

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
npm test
```

### 2. Review Test Results
- **Expected**: 203 tests pass, 0 failures (30 files)
- **Test Coverage**: not gated
- **Test Report Location**: terminal (Vitest)

### 3. Fix Failing Tests
1. Read Vitest output
2. Fix source or spec
3. Rerun `npm test`

**U-PAL-01**: `merge-ui-features*.spec.ts`, `palette-host.helpers*.spec.ts`, `ui-config.service.spec.ts` (palette overlay).  
**U-PAL-02**: `enso-task-catalog.service.spec.ts`, `left-sidebar.palette.spec.ts`; chrome/app catalog mocks include `emptyRemote`.
