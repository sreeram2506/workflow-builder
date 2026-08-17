# Frontend Components Summary — U-HUI-01

**Unit**: `u-hui-01-host-ui-inputs`

## Modified

| File | Change |
|---|---|
| `shell-layout.component.ts` | `ui` input; `uiConfig` rename; effective computed; provide token; region gates |
| `agent-skills-shell.component.ts` | Same (independent scope) |
| `top-bar.component.ts` | `injectEffectiveUi()` |
| `chrome-shortcuts.directive.ts` | `injectEffectiveUi()` for Save |
| `zoom-controls.component.ts` | `injectEffectiveUi()` |
| `canvas-viewport.component.ts` | `injectEffectiveUi()` |
| `docs/workflow-builder-ui-embed.md` | Precedence + `[ui]` section |
| `README.md` | Pointer mentions `[ui]` |

## Created

| File | Role |
|---|---|
| `ui-effective.token.ts` | Token + `EffectiveUiReader` |
| `effective-ui-reader.ts` | Factory |
| `inject-effective-ui.ts` | Inject helper |
| `host-ui-inputs.spec.ts` | Omit/`{}`/partial/isolation/reactive/agent shell |
| `effective-ui-reader.spec.ts` | Reader unit tests |
