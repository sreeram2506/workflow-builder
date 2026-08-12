# Code Generation Summary — U3

## Application code
- Dependency: `@angular/cdk@^20.2.14` (latest 20.x; no 20.3 CDK published)
- Domain: `palette.catalog.ts`, `node.factory.ts`
- Store/facade: `GraphStore.addNode`, `WorkflowFacade.createNode` / `createNodeAtViewportCenter`, `UiStore.viewSize`
- UI: Nodes Library categories/search/CDK drag; drag-end hit-test over canvas viewport → `createNode`

## Verification
- `npm test` — 17 passed
- `npm run build` — success

## Skipped
- API layer (`code/api-layer-SKIP.md`)
- Deployment artifacts (`code/deployment-SKIP.md`)

## Explicitly not included
Connection drawing (U4), Properties editing (U5), smart routing (U6), history/serialize (U7), run/view-mode (U8)
