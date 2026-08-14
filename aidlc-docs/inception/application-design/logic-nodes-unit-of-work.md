# Unit of Work — Logic Node Properties Increment

**Deployment model**: Same monolith Angular SPA (no new package)  
**Unit meaning**: Logical construction module after U8  
**Sequencing**: Single unit `U9` — finish Functional Design + Code Generation + Build/Test, then stop for approval  
**Application Design**: Skipped; this unit extends U1/U2/U4/U5 surfaces  

Original U1–U8 catalog is unchanged (`unit-of-work.md`).

---

## Code organization (brownfield)

Extend existing folders. Do **not** add `src/app/features/logic-nodes/`.

```text
src/app/core/domain/
  workflow.models.ts          # WorkflowEdge.condition; node.data fields
  properties.schema.ts        # per-type descriptors for Condition/Decision/Repeater
  logic-node-rules.ts         # NEW pure helpers (max-2, true/false, uniqueness)
  repeater-mock.catalog.ts    # NEW mock Workflow/Agent + versions
src/app/core/facade/
  workflow.facade.ts          # patch edge condition; connect guards
src/app/features/shell/
  right-sidebar.component.ts  # type-specific Properties + connector panel
src/app/features/canvas/      # connect gesture uses logic-node-rules
```

Units do not create a new Angular project.

---

## Unit Catalog (this increment)

### U9 — Logic Nodes (Condition / Router / Repeater)

| Field | Value |
|---|---|
| **Id** | `u9-logic-nodes` |
| **Stories** | US-LN-01, US-LN-02, US-LN-03, US-LN-04, US-LN-05, US-LN-06, US-LN-07 |
| **Responsibility** | Type-specific Properties; hide Ignore Keys on logic types; Condition max-2 true/false outs; Router connector Name+Condition; Router/Repeater label uniqueness; Repeater mock Workflow/Agent + Version + Pause; view-mode inspect |
| **Primary components** | RightSidebar (node + edge forms), canvas connect handlers, schema registry |
| **Primary domain** | `WorkflowNode.data`, `WorkflowEdge.condition`, `logic-node-rules`, mock repeater catalog |
| **Depends on** | U1 stores/facade, U2 canvas, U4 connections, U5 properties panel |
| **Out of scope** | Live Enso API, `routeEdges` algorithm, SVG shape changes, Enso toasts, new npm libs |
| **Internal order** | models/schema -> pure rules -> Properties UI -> connect gesture -> tests |
| **PBT** | Partial on pure helpers (max-2, true/false assign, uniqueness, version reset) |
| **Done when** | US-LN-01..07 pass; `npm test`; `npm run build` |

---

## Construction Rule

After this Units Generation approval, CONSTRUCTION runs **U9 only** (Functional Design → Code Generation → Build and Test). NFR Requirements/Design and Infrastructure Design stay SKIP per execution plan.
