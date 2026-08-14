# Unit Test Execution

**Scope**: U1–U9 (Vitest via `@angular/build:unit-test`)

## Test Inventory
| Spec file | Focus |
|---|---|
| `src/app/app.spec.ts` | Shell + seeded nodes + palette smoke |
| `src/app/core/facade/workflow.facade.spec.ts` | create/patch/layout/route + undo/import/copy-paste + Run/Stop/Reset/view + Condition/Router `createEdge` |
| `src/app/core/domain/theme.utils.spec.ts` | Theme + seed type PBT |
| `src/app/core/domain/viewport.math.spec.ts` | Zoom / fitToContent PBT |
| `src/app/core/domain/palette.catalog.spec.ts` | Catalog + factory PBT |
| `src/app/core/domain/connection.math.spec.ts` | validateConnection / snap PBT |
| `src/app/core/domain/config-path.spec.ts` | Path helpers + scoped registry invariant |
| `src/app/core/domain/enso-task.mapper.spec.ts` | Enso → palette |
| `src/app/core/domain/enso-task-form.spec.ts` | Flatten ensoTask fields |
| `src/app/core/domain/layout.math.spec.ts` | Layout + layered rank PBT |
| `src/app/core/domain/edge-routing.spec.ts` | Route + fallback |
| `src/app/core/domain/workflow.serialize.spec.ts` | Serialize round-trip PBT; `edge.condition` default; repeater data |
| `src/app/core/domain/run-order.spec.ts` | BFS seeds/order + order invariants PBT |
| `src/app/core/domain/logic-node-rules.spec.ts` | Condition true/false, uniqueness, version reset, catalog (U9) |
| `src/app/features/shell/right-sidebar.component.spec.ts` | Condition / Router / Repeater / connector bind (U9) |
| `src/app/core/domain/node-visuals.spec.ts` | Node visual helpers |
| `src/app/core/domain/sidebar-width.spec.ts` | Sidebar clamp |

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
cd /Users/sreeram/ofcwork/workflow-builder
npm test
```

### 2. Review Test Results
- **Expected**: **99** tests pass, **0** failures (17 test files)
- **Last verified**: 2026-08-14T04:03:51Z — 99 passed
- **Coverage**: No formal gate
- **Test Report Location**: Vitest stdout (no HTML report configured)

### 3. Fix Failing Tests
1. Read Vitest failure output
2. Fix within U1–U9 scope
3. Re-run `npm test`

## Property-Based Testing (Partial)
- Prior U1–U8 properties plus **nextConditionOutLabel** fill/reject and **Router/Repeater uniqueness** (trim, case-sensitive)
