# Code Generation Summary — U-RAD-01 Remove APIs and dummy data

**Stories**: US-RAD-01, US-RAD-02, US-RAD-03, US-RAD-04  
**Status**: Part 2 complete (awaiting approval)

## Created (application)

- `src/app/core/data/enso-task-catalog.service.pbt.spec.ts`
- `src/app/features/agent/nested-skills-library.component.spec.ts`

## Modified

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`
- `angular.json`
- `src/app/core/data/enso-task-catalog.service.ts`
- `src/app/core/data/catalog.types.ts`
- `src/app/core/data/enso-task-catalog.service.spec.ts`
- `src/app/features/agent/nested-skills-library.component.ts`
- `src/app/core/facade/workflow.facade.ts`
- `src/app/core/facade/workflow.facade.spec.ts`
- `src/app/core/domain/agent-skills.spec.ts`
- `src/app/core/domain/properties.schema.ts`
- `src/app/core/domain/logic-node-rules.spec.ts`
- `src/app/features/shell/right-sidebar.component.ts`
- `docs/workflow-builder-ui-embed.md`
- `README.md`

## Deleted

- `proxy.conf.json`
- `src/app/core/domain/enso-pipeline.mapper.ts` + spec
- `src/app/core/domain/enso-task.mapper.ts` + spec
- `src/app/core/domain/mock-skills.catalog.ts`
- `src/app/core/domain/repeater-mock.catalog.ts`

## Verification

- `npm test` — 258 passed / 35 files
- `npm run build` — success (existing budget warnings)

## SKIP

- API layer, repository layer, deployment artifacts — N/A (client SPA)
