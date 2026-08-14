# U9 Code Generation Plan — Logic Nodes

**Status**: APPROVED — Part 2 COMPLETE  
**Unit**: `u9-logic-nodes`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-LN-01 .. US-LN-07  
**Design**: `aidlc-docs/construction/u9-logic-nodes/functional-design/`  

This plan is the single source of truth for Code Generation. Do not generate application code until the plan is approved.

### Locked inputs
| Area | Decision |
|---|---|
| Router new edge | label `Blank Condition`, condition `''` |
| Repeater data | `data.repeater.workflowId`, `versionId`, `is_paused` |
| Uniqueness | trim, case-sensitive, Router+Repeater |
| Condition outs | max 2; fill missing true/false; silent reject |
| Persist | Save-only (U5) |
| Mock catalog | 2–3 workflows, 1–2 versions |
| Stack | existing Angular; no new libraries |
| `routeEdges` | do not change algorithm |

### Stories
| Story | Steps |
|---|---|
| US-LN-01 Condition properties | 2, 7 |
| US-LN-02 Router properties | 2, 7 |
| US-LN-03 Repeater mock config | 1, 2, 7 |
| US-LN-04 Condition edges | 1, 4, 7 |
| US-LN-05 Router connectors | 1, 3, 4, 7 |
| US-LN-06 uniqueness | 1, 7 |
| US-LN-07 view-mode inspect | 7 |

### Dependencies
U1 facade/stores, U2 canvas, U4 `createEdge`, U5 Properties schema + right sidebar, U7 serialize, U8 view lock.

---

## Generation Steps

### Step 1 — Business logic: models + pure rules + mock catalog
- [x] Modify `src/app/core/domain/workflow.models.ts`: add `WorkflowEdge.condition: string`
- [x] Create `src/app/core/domain/logic-node-rules.ts`: `nextConditionOutLabel`, `isRouterRepeaterLabelUnique`, `repeaterAfterWorkflowChange`
- [x] Create `src/app/core/domain/repeater-mock.catalog.ts`: 3 mock workflows (Claims Intake 2 versions, Policy Check 1, Notify Desk 2)
- [x] Modify `src/app/core/domain/connection.math.ts` `createWorkflowEdge` to set `condition: ''` (label still applied by facade for logic types)

### Step 2 — Business logic: schema registry
- [x] Modify `src/app/core/domain/properties.schema.ts`:
  - Condition: required string `condition` at path `condition`
  - Decision: no Ignore Keys (empty or hidden)
  - Repeater: workflowId, versionId, is_paused descriptors
  - Other types: keep Ignore Keys
  - Scope `assertRegistryV1Invariant` to non-logic types

### Step 3 — Business logic: serialize
- [x] Modify `src/app/core/domain/workflow.serialize.ts` parse/serialize to keep `edge.condition` (default `''`)

### Step 4 — Store / facade connect + patchEdge
- [x] Modify `src/app/core/stores/graph.store.ts` `patchEdge` to allow `condition`
- [x] Modify `src/app/core/facade/workflow.facade.ts`:
  - `patchEdge` accepts `condition`
  - `createEdge`: if source Condition, apply `nextConditionOutLabel` (return null if reject); if source Decision, label `Blank Condition` and `condition ''`

### Step 5 — Business logic unit tests (+ PBT Partial)
- [x] Create `src/app/core/domain/logic-node-rules.spec.ts` (true/false fill, reject third, uniqueness, version reset)
- [x] Update `config-path.spec.ts` / registry tests for scoped invariant
- [x] Update `connection.math.spec.ts` / `workflow.facade.spec.ts` / serialize specs for `condition` and Condition/Router createEdge
- [x] PBT Partial on `nextConditionOutLabel` and uniqueness if fast-check already used in repo

### Step 6 — Business logic summary
- [x] Write `aidlc-docs/construction/u9-logic-nodes/code/business-logic-summary.md`

### Step 7 — Frontend: Properties + connector panel
- [x] Modify `src/app/features/shell/right-sidebar.component.ts`:
  - Condition: General + expression; hide Ignore Keys
  - Decision: General; uniqueness validator; hide Ignore Keys
  - Repeater: mock selects + pause; dependent version reset; hide Ignore Keys
  - Edge from Router: Name + Condition required; Save via `patchEdge`
  - Edge from Condition: read-only true/false label; no condition field
  - `data-testid` on new controls
- [x] Modify seed `src/app/core/data/mock-workflow.repository.ts` if needed so sample Condition/Router/Repeater data matches new fields

### Step 8 — Frontend unit tests
- [x] Extend existing right-sidebar / app specs if present for logic-type form branches
- [x] Skip a new e2e suite (none in current stack)

### Step 9 — Frontend summary
- [x] Write `aidlc-docs/construction/u9-logic-nodes/code/frontend-components-summary.md`

### Step 10 — API layer
- [x] SKIP — no backend. Document `api-layer-SKIP.md`

### Step 11 — Repository layer
- [x] SKIP — mock catalog is a static module. Document `repository-layer-SKIP.md`

### Step 12 — Database migrations
- [x] SKIP — in-memory only. Document `database-SKIP.md`

### Step 13 — Documentation
- [x] Write `aidlc-docs/construction/u9-logic-nodes/code/code-generation-summary.md`
- [x] Update README only if it lists node-property behavior (do not invent extra docs)

### Step 14 — Deployment artifacts
- [x] SKIP. Document `deployment-SKIP.md`

### Step 15 — Verify (smoke; full instructions in Build and Test)
- [x] `npm test`
- [x] `npm run build`

---

## Explicit non-goals
- Enso HTTP / `getSkills`
- Toasts
- Query builder
- Changing logic SVG shapes
- Changing `routeEdges` pathfinding
- New npm packages

## Approval
Part 2 generation complete — `npm test` 99 passed; `npm run build` success. Awaiting stage approval to continue to Build and Test.
