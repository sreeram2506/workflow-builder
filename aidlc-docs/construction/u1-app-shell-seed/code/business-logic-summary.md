# Business Logic Summary — U1

## Implemented
- Domain types: `WorkflowDocument`, nodes, edges, enums
- `MockWorkflowRepository` + `SAMPLE_WORKFLOW` (5 nodes, 4 edges, branch)
- `GraphStore` / `UiStore` signal stores
- `WorkflowFacade.initialize()`, `toggleTheme()`, sidebar collapse APIs
- `ThemeApplicator` sets `data-theme` on `documentElement`
- Bootstrap try/catch sets `bootstrapError` for shell banner

## Tests
- `workflow.facade.spec.ts` — seed load + theme toggle
- `theme.utils.spec.ts` — fast-check double-toggle + seed type membership

## Skipped
- Graph mutations beyond seed load
- History / serialize / run
