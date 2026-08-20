# Unit Test Execution — U-DP-01 Dynamic Properties

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
cd /Users/trivenigogireddy/Work/workflow-builder
# Use Node 20.19+ / 22.12+
npm test
```

### 2. Review Test Results
- **Expected**: 310 tests pass, 0 failures (verified during Code Generation)
- **Coverage**: not enforced
- **U-DP-01 focus**:
  - `host-properties.dynamic.spec.ts` / `.pbt.spec.ts`
  - `dynamic-property.component.spec.ts`
  - `right-sidebar.component.spec.ts` (properties map Save, collision omit)

### 3. Fix Failing Tests
1. Read Vitest/ng-test output
2. Fix code or expectations in-scope for U-DP-01
3. Re-run `npm test` until green
