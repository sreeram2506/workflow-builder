# Unit Test Execution

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
npm test
```

### 2. Review Test Results
- **Expected**: 258 tests pass, 0 failures (35 files)
- **Test Coverage**: not gated
- **Test Report Location**: terminal (Vitest)

Verified 2026-08-17: 258 passed / 35 files.

### 3. Fix Failing Tests
1. Read Vitest output
2. Fix source or spec
3. Rerun `npm test`

**U-RAD-01 focus**
- `enso-task-catalog.service.spec.ts` — omit-without-adapter empty-remote (`source: 'empty'`); adapter success / empty / failure (static fallback) unchanged
- `enso-task-catalog.service.pbt.spec.ts` — P-RAD-01 (`emptyRemote`), P-RAD-02 (no static featured keys), P-RAD-03 (`source` never `'enso'`), seed `20260817`
- `nested-skills-library.component.spec.ts` — omit/`[]` empty list; palettes listed; Add calls `addSkillFromPaletteItem`
- `workflow.facade.spec.ts` — `addSkillToAgent` does not add mock skills
- `agent-skills.spec.ts` — no `MOCK_SKILLS` / `filterMockSkills`
- `logic-node-rules.spec.ts` — Repeater workflow options empty; no dummy workflow names
