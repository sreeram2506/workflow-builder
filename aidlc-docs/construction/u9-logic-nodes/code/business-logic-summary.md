# Business Logic Summary — U9 Logic Nodes

## Delivered
- `WorkflowEdge.condition` plus `EdgePatch` / `RepeaterData`
- `logic-node-rules.ts` — `nextConditionOutLabel`, `isRouterRepeaterLabelUnique`, `repeaterAfterWorkflowChange`, `readRepeaterData`
- `repeater-mock.catalog.ts` — Claims Intake (2), Policy Check (1), Notify Desk (2)
- `properties.schema.ts` — Condition expression; Decision empty; Repeater workflow/version/pause; v1 invariant scoped to non-logic types
- `workflow.serialize.ts` — round-trip `edge.condition` (missing → `''`)
- `GraphStore.patchEdge` / `WorkflowFacade.patchEdge` accept `condition`
- `WorkflowFacade.createEdge` applies Condition true/false (silent reject at max 2) and Router `Blank Condition`

## Tests
- `logic-node-rules.spec.ts` (+ Partial PBT)
- Registry scoped invariant
- Serialize condition/repeater round-trip
- Facade Condition/Router createEdge + patchEdge condition
