# Unit Test Execution

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
npm test
```

(`package.json`: `ng test --watch=false`, Vitest.)

### 2. Review Test Results
- **Expected**: 300 tests pass, 0 failures (41 files)
- **Test Coverage**: not gated
- **Test Report Location**: terminal (Vitest)

Verified 2026-08-19: 300 passed / 41 files.

### 3. Fix Failing Tests
1. Read Vitest output
2. Fix source or spec
3. Rerun `npm test`

**U-NP-01 focus**
- `src/public-package-api.spec.ts` — import from `'enso-workflow-builder'`; shells, `provideWorkflowBuilderUi`, `WorkflowFacade`; selectors `wb-shell-layout` / `wb-agent-skills-shell`

**Regression (prior units)**
- Host embed contract (`shell-layout.embed-contract.spec.ts`, facade load/dirty/persist)
- Serialize PBT Partial (`workflow.serialize.spec.ts`)
- Agent enter without tabs, Host Properties, palettes, chrome flags, Condition edges, Router connectors
