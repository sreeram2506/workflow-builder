# Frontend / DI Summary — U-UI-01

## Created

| Path | Role |
|---|---|
| `src/app/core/ui-config/ui-config.token.ts` | `WORKFLOW_BUILDER_UI_FEATURES` |
| `src/app/core/ui-config/provide-workflow-builder-ui.ts` | Host `provideWorkflowBuilderUi` |
| `src/app/core/ui-config/ui-config.service.ts` | `features()`, `is()`, `loadStatus()`, `applyLayers` |
| `src/app/core/ui-config/ui-config.initializer.ts` | `uiConfigAppInitializer` |
| `src/app/core/ui-config/ui-config.service.spec.ts` | HTTP 404/invalid/ok + provider wins |
| `src/app/core/ui-config/index.ts` | Barrel |

## Modified

| Path | Change |
|---|---|
| `src/app/app.config.ts` | `provideAppInitializer(uiConfigAppInitializer)` |
| `angular.json` | Map `src/assets` → `/assets` |
| `src/assets/wb-ui-config.json` | `{}` stub (no secrets) |

No chrome component gates in this unit.
