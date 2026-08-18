# Unit Test Execution

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
npm test
```

(`package.json`: `ng test --watch=false`, Vitest.)

### 2. Review Test Results
- **Expected**: 272 tests pass, 0 failures (38 files)
- **Test Coverage**: not gated
- **Test Report Location**: terminal (Vitest)

Verified 2026-08-18: 272 passed / 38 files.

### 3. Fix Failing Tests
1. Read Vitest output
2. Fix source or spec
3. Rerun `npm test`

**U-HP-01 focus**
- `host-properties.schema.spec.ts` — skip empty path / `..` / unknown type; keep valid rest
- `host-properties.schema.pbt.spec.ts` — P-HP-01 (seed `20260817`)
- `host-properties.resolve.spec.ts` — `{}` wins over Condition built-in; adapter throw → built-in; Action + `taskMeta` → `null`
- `host-properties.resolve.pbt.spec.ts` — P-HP-02 first-win; P-HP-03 no-walk `taskMeta` (seed `20260817`)
- `node.factory.spec.ts` — `taskMeta` → `data.taskMeta` (not `ensoTask`); `propertiesSchema` copied
- `palette-host.helpers.spec.ts` — overlay copies plain-object `propertiesSchema`
- `config-path.spec.ts` — non-logic types have no built-in configuration fields
- `logic-node-rules.spec.ts` — Repeater options still `[]`
- `right-sidebar.component.spec.ts` — schema Save to path; Action + `taskMeta` not flattened; leftover `ensoTask` unused; unknown widget disabled; Condition/Repeater/Router connectors unchanged
