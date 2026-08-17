# Business Logic Summary — U-UI-01

## Created

| Path | Role |
|---|---|
| `src/app/core/ui-config/ui-features.types.ts` | UiFeatures tree, paths, load status, JSON URL |
| `src/app/core/ui-config/merge-ui-features.ts` | defaults, normalize, merge, theme alias, path index, resolve |
| `src/app/core/ui-config/merge-ui-features.spec.ts` | Table-driven unit tests |
| `src/app/core/ui-config/merge-ui-features.pbt.spec.ts` | fast-check BR-11 invariants |

## Rules implemented

- Defaults all-on; merge defaults → JSON → provider
- Unknown keys ignored; non-boolean leaves omitted
- `themeToggle` overwrites `topBar.theme` in same layer
- Soft-fail status kinds: ok / missing / invalid
