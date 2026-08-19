# Business Logic Summary — U-NP-01 npm package

**Stories**: US-NP-01, US-NP-03  
**Status**: Part 2 complete (awaiting approval)

## Created (application)

- `src/app/core/builder-env.ts` — routing/run timing constants moved under `src/app` so the library compile graph does not leave the app tree
- `projects/enso-workflow-builder/` — ng-packagr library (`enso-workflow-builder` @ `0.1.0`)
- `projects/enso-workflow-builder/src/public-api.ts` — public barrel
- `projects/enso-workflow-builder/src/lib` — git symlink to `src/app` (single source; ng-packagr cannot compile files outside the library folder)

## Modified

- `src/app/core/facade/workflow.facade.ts` — import `environment` from `builder-env`
- `src/app/core/run/run-simulation.service.ts` — same
- `src/environments/environment.ts` — re-exports `builder-env`
- Workspace `package.json` — `ng-packagr` devDependency; `build:lib` / `pack:lib` scripts
- `angular.json` — library project (SPA project unchanged)

## Public barrel (does not export SPA `App` or try/)

`ShellLayoutComponent`, `AgentSkillsShellComponent`, `provideWorkflowBuilderUi`, `WorkflowFacade`, `WorkflowDocument`, palette/UI/persist/catalog/properties types, `uiConfigAppInitializer`, `UiConfigService`

## Unchanged

- Host embed contract behavior (load/get/dirty, persist, height 100%)
- No `npm publish`
- `src/app/try/` not committed
