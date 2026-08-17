# Unit Test Execution — U-UI-02 Chrome Wiring

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
npm test
```

(`package.json` maps this to `ng test --watch=false` / Vitest.)

### 2. Review Test Results
- **Expected**: all project tests pass, 0 failures
- **Latest run**: **167 passed** / 26 files
- **Test Coverage**: not gated in CI for this increment; Vitest reports pass/fail only
- **Test Report Location**: terminal output from `npm test`

### U-UI-02 specs
| Spec | Focus |
|---|---|
| `src/app/features/shell/ui-chrome-gates.spec.ts` | Library hide, Save shortcut, config banner, layout/zoom/canvas chrome, sidebar inset when top bar off |
| `src/app/core/facade/workflow.facade.spec.ts` | Agent tab idempotency, palette Blank Agent reuse, chrome inset below 72px |
| `src/app/core/domain/agent-tabs.spec.ts` | Open/focus without duplicate `nodeId` (includes PBT) |
| `src/app/core/domain/node.factory.spec.ts` | `paletteKey` + `findExistingAgentForPaletteItem` |
| `src/app/core/ui-config/merge-ui-features.spec.ts` | Merge + canvas action aliases + example all-off |
| `src/app/core/ui-config/ui-config.service.spec.ts` | JSON load, provider wins, focus reload |

U-UI-01 merge PBT still runs: `merge-ui-features.pbt.spec.ts`.

### 3. Fix Failing Tests
If tests fail:
1. Read the Vitest assertion and file path in the terminal
2. Fix the chrome gate, merge, or facade behavior (not the test unless the spec is wrong)
3. Rerun `npm test` until all pass
