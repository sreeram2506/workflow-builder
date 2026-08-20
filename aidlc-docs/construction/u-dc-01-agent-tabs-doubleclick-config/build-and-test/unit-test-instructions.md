# Unit Test Execution

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
npm test
```

(`package.json`: `ng test --watch=false`, Vitest.)

### 2. Review Test Results
- **Expected**: 308 tests pass, 0 failures (42 files)
- **Test Coverage**: not gated
- **Test Report Location**: terminal (Vitest)

Verified 2026-08-20: 308 passed / 42 files.

### 3. Fix Failing Tests
1. Read Vitest output
2. Fix source or spec
3. Rerun `npm test`

**U-DC-01 focus**
- `merge-ui-features.spec.ts` — `agentTabs.doubleClick` default true; independent of `enabled`; explicit false
- `merge-ui-features.pbt.spec.ts` — omit → true; explicit false wins
- `canvas-viewport.agent-dblclick.spec.ts` — default enters; false does not; nested no re-enter; view + false does not enter
- `workflow.facade.spec.ts` — `selectAgentTab` / chips still navigate (not gated)

**Regression (prior units)**
- Agent enter without tabs, Host embed, palettes, chrome flags, Condition edges, Router connectors
