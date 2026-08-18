# Code Generation Summary — U-HP-01 Generic host-driven Properties

**Stories**: US-HP-01, US-HP-02, US-HP-03, US-HP-04  
**Status**: Part 2 complete (awaiting approval)

## Created (application)

- `src/app/core/domain/host-properties.schema.ts` + spec + PBT
- `src/app/core/domain/host-properties.resolve.ts` + spec + PBT
- `src/app/core/ui-config/properties-adapter.ts`

## Modified

- `src/app/core/domain/palette.catalog.ts`
- `src/app/core/domain/palette-host.helpers.ts` + spec
- `src/app/core/domain/node.factory.ts` + spec
- `src/app/core/ui-config/provide-workflow-builder-ui.ts`
- `src/app/core/ui-config/index.ts`
- `src/app/core/domain/properties.schema.ts`
- `src/app/core/domain/config-path.spec.ts`
- `src/app/core/domain/logic-node-rules.spec.ts`
- `src/app/features/shell/right-sidebar.component.ts` + spec
- `docs/workflow-builder-ui-embed.md`

## Deleted

- `src/app/core/domain/enso-task-form.ts` + spec

## Verification

- `npm test` — 272 passed / 38 files
- `npm run build` — success (existing budget warnings)

## SKIP

- API layer, repository layer, deployment artifacts — N/A (client SPA)
