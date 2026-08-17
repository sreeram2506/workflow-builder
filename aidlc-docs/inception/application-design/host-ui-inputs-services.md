# Services — Host UI chrome inputs (`[ui]`)

---

## Catalog

| ID | Name | Kind | Responsibility |
|---|---|---|---|
| S-HUI-CFG | `UiConfigService` | existing | Bootstrap defaults/JSON/provider only; **unchanged** by `[ui]` |
| S-HUI-MERGE | `merge-ui-features.ts` | pure | Merge instance partial onto full tree |
| S-HUI-TOKEN | `UI_EFFECTIVE_FEATURES` | token | Shell provides effective `Signal<UiFeatures>` |
| S-HUI-SHELL | Shell components | UI | Own `ui` input + provider factory |
| S-HUI-DOCS | Embed guide | docs | Document `[ui]` + precedence |

---

## Orchestration

```text
UiConfigService.features()     (global: defaults←JSON←provider)
        ⊕
shell.ui() partial             (omit ⇒ {})
        │
        ▼
mergeUiFeatures → effectiveFeatures (shell-local computed)
        │
        ├── shell template @if
        └── UI_EFFECTIVE_FEATURES → TopBar / shortcuts / zoom / viewport
```

Text alternative: Instance `[ui]` never writes the global service. Children under a shell inject the shell-provided effective features token.

---

## Non-goals

- Per-instance mutation of `loadStatus`
- Deprecating `provideWorkflowBuilderUi({ features })`
