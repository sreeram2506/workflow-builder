# Unit Test Execution

**Scope**: U1–U8 (Vitest via `@angular/build:unit-test`)

## Test Inventory
| Spec file | Focus |
|---|---|
| `src/app/app.spec.ts` | Shell + seeded nodes + palette smoke |
| `src/app/core/facade/workflow.facade.spec.ts` | create/patch/layout/route + undo/import/copy-paste + Run/Stop/Reset/view |
| `src/app/core/domain/theme.utils.spec.ts` | Theme + seed type PBT |
| `src/app/core/domain/viewport.math.spec.ts` | Zoom / fitToContent PBT |
| `src/app/core/domain/palette.catalog.spec.ts` | Catalog + factory PBT |
| `src/app/core/domain/connection.math.spec.ts` | validateConnection / snap PBT |
| `src/app/core/domain/config-path.spec.ts` | Path helpers + registry |
| `src/app/core/domain/enso-task.mapper.spec.ts` | Enso → palette |
| `src/app/core/domain/enso-task-form.spec.ts` | Flatten ensoTask fields |
| `src/app/core/domain/layout.math.spec.ts` | Layout + layered rank PBT |
| `src/app/core/domain/edge-routing.spec.ts` | Route + fallback |
| `src/app/core/domain/workflow.serialize.spec.ts` | Serialize round-trip PBT; allowlist; invalid import |
| `src/app/core/domain/run-order.spec.ts` | BFS seeds/order + order invariants PBT |

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
cd /Users/sreeram/ofcwork/workflow-builder
npm test
```

### 2. Review Test Results
- **Expected**: **66** tests pass, **0** failures (13 test files)
- **Last verified**: 2026-08-12T08:13:36Z — 66 passed
- **Coverage**: No formal gate

### 3. Fix Failing Tests
1. Read Vitest failure output
2. Fix within U1–U8 scope
3. Re-run `npm test`

## Property-Based Testing (Partial)
- Prior U1–U7 properties plus **BFS run-order invariants** (ids ⊆ graph; non-seeds have predecessor earlier in prefix)
