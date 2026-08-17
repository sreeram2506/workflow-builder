# Frontend Components Summary — U-UI-02

## Created

| Path | Role |
|---|---|
| `src/app/features/shell/agent-tabs.component.ts` | Extracted agent tabs strip (`wb-agent-tabs`) |
| `src/app/features/shell/chrome-shortcuts.directive.ts` | Document shortcuts; Save gated by `topBar.save` |
| `src/app/features/shell/ui-chrome-gates.spec.ts` | Library hide, Save shortcut, config banner |
| `docs/workflow-builder-ui-embed.md` | Embed API + flag table |

## Modified

| Path | Change |
|---|---|
| `top-bar.component.ts` | Removed tabs + HostListener; per-action `UiConfigService` gates |
| `shell-layout.component.ts` | Region `@if`s, banner, `wbChromeShortcuts`, agent-tabs; compact header when top bar off |
| `agent-skills-shell.component.ts` | Same pattern; left = `skillsLibrary` |
| `zoom-controls.component.ts` | `floatingActions` + per-button `canvas.*` / `topBar.*` aliases |
| `canvas-viewport.component.ts` | Gate zoom-controls / minimap |
| `ui.store.ts` | `chromeInsetTop` may be 0–n; agent tabs unique by `nodeId` |
| `ui-config.service.ts` | `is()` reads `featuresSignal` for reactivity |
| `docs/workflow-builder-ui-config-try.md` | Chrome gates live; inset + duplicate-tab notes; no root `themeToggle` |
| `README.md` | Pointer to embed + try docs |
| Example JSON | `all-on` / `all-off` / active config omit root `themeToggle` |

Active `wb-ui-config.json` remains `{}`.
