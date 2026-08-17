# Business Logic Summary — U-HUI-01

**Unit**: `u-hui-01-host-ui-inputs`

## Delivered

- `mergeInstanceUiFeatures(global, uiInput)` — `mergeUiFeatures(global, normalizePartial(uiInput ?? {}))`; no mutation of global
- `createEffectiveUiReader` + `UI_EFFECTIVE_FEATURES` reader `{ features(), is() }` with fail-open unknown paths
- `injectEffectiveUi()` — optional token, fallback `UiConfigService`
- PBT: instance merge leaves + no base mutation; example tests for omit/`{}`/themeToggle

## Unchanged

- `UiConfigService` bootstrap layers and `loadStatus` (no instance write API)
