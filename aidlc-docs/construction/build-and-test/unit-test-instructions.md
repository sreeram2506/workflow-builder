# Unit Test Execution

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
npm test
```

(`package.json`: `ng test --watch=false`, Vitest.)

### 2. Review Test Results
- **Expected**: 280 tests pass, 0 failures (39 files)
- **Test Coverage**: not gated
- **Test Report Location**: terminal (Vitest)

Verified 2026-08-18: 280 passed / 39 files.

### 3. Fix Failing Tests
1. Read Vitest output
2. Fix source or spec
3. Rerun `npm test`

**U-AE-01 focus**
- `workflow.facade.spec.ts` — bar off: no chips from `openAgentTab` / palette create; `selectAgentTab` still navigates; view still enters; `enterAgentCanvas` without chips; missing agent `ensureAgentRoute` redirects `/`
- `agent-skills-shell.nested-back.spec.ts` — strip off shows `nested-back-to-solution` and click calls `navigateBackToSolution`; strip on shows chips, not nested Back
- `ui-chrome-gates.spec.ts` — `agentTabs.enabled: false` hides `agent-tabs-strip`

**Regression (prior units)**
- Host Properties, palettes, chrome flags other than this enter/exit behavior, Condition edges, Router connectors
