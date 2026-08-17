# Frontend Components Summary — U-PAL-02 Catalog wiring + docs

## Modified

| Path | Change |
|---|---|
| `src/app/features/shell/left-sidebar.component.ts` | Empty-remote exclusive empty-state; `defaultAgentItems()` strip; reload on `features().palette`; no `blankAgentItem()` fallback |
| `src/app/features/shell/left-sidebar.palette.spec.ts` | Empty-remote testid; error banner; allow-list featured; default-agent cards; palette reload |
| `src/app/features/shell/ui-chrome-gates.spec.ts` | Catalog mock `emptyRemote: false` + tagged Blank Agent |
| `src/app/app.spec.ts` | Same catalog mock shape |

## Behavior

- `data-testid="palette-empty-remote"` is the only library body when `emptyRemote`
- Featured strip from `allItems()` (Condition / Decision / Repeater after filter)
- One CDK list `default-agent-strip` with `default-agent-card-{key}`
- Adapter `AIAgent` rows (`origin` not `default-agent`) stay in the solution list
- Catalog reloads when `paletteScope` or `features().palette` changes
