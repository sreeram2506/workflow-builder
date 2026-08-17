# Frontend Components Summary — U-HPI-01 Host palette inputs

## Modified

| Path | Change |
|---|---|
| `src/app/features/shell/left-sidebar.component.ts` | `palettes` / `defaultAgents` inputs; overlay keys on `loadCatalog`; reload when inputs change |
| `src/app/features/shell/shell-layout.component.ts` | `[palettes]` / `[defaultAgents]` pass-through |
| `src/app/features/agent/agent-skills-shell.component.ts` | `[palettes]` pass-through |
| `src/app/features/shell/left-sidebar.palette.spec.ts` | Omit vs `[]` vs items; reload; agent scope skips defaultAgents |
| `docs/workflow-builder-ui-embed.md` | Parent template example |

## Created

| Path | Role |
|---|---|
| `src/app/features/shell/shell-layout.palettes.spec.ts` | Shell forwards palettes and defaultAgents to catalog |

## Behavior

- Unbound inputs do not set overlay keys
- `[palettes]="[]"` shows `palette-empty-remote`
- Featured / empty-state UI unchanged from U-PAL-02
