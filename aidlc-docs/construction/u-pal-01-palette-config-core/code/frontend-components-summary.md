# Frontend / DI Summary — U-PAL-01

No chrome or sidebar UI in this unit.

## Modified

| Path | Change |
|---|---|
| `src/app/core/ui-config/index.ts` | Export palette types |
| `src/app/core/ui-config/ui-config.service.spec.ts` | JSON + provider `palette` overlay |

`UiConfigService.features().palette` is the consumer API. Catalog adapter / `LeftSidebarComponent` remain U-PAL-02.
