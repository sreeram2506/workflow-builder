# Business Logic Summary — U-PAL-02 Catalog wiring + docs

**Stories**: US-PAL-05, US-PAL-06, US-PAL-07

## Created

| Path | Role |
|---|---|
| `src/app/core/data/catalog.types.ts` | `PaletteCatalogLoad` (`emptyRemote`, `source` includes `adapter` \| `empty`) |
| `src/app/core/ui-config/catalog-adapter.ts` | Adapter contract + `WORKFLOW_BUILDER_CATALOG_SOLUTION` / `_AGENT` |
| `src/app/core/data/enso-task-catalog.service.spec.ts` | Adapter vs Enso; empty-remote; HTTP error static; allow-list |

## Modified

| Path | Change |
|---|---|
| `src/app/core/data/enso-task-catalog.service.ts` | Optional tokens; classify ok / empty-remote / error; U-PAL-01 helpers; no mocks |
| `src/app/core/domain/palette.catalog.ts` | `PaletteItem.origin?: 'default-agent'` |
| `src/app/core/domain/palette-host.helpers.ts` | Tag resolved default-agent rows with `origin` |
| `src/app/core/ui-config/provide-workflow-builder-ui.ts` | `catalog?: { solution?; agent? }` |
| `src/app/core/ui-config/index.ts` | Export adapter types and tokens |

## Deleted

| Path | Reason |
|---|---|
| `src/app/core/domain/mock-agents.catalog.ts` | No remaining `MOCK_SOLUTION_AGENTS` compose path |

## Rules implemented

- Adapter present → Enso HTTP not called for that canvas
- Remote length 0 (success) → `emptyRemote: true`, `items: []`, `error: null`
- Throw / HTTP / invalid shape / missing auth → static filtered + default agents + banner; never “mock agents”; never tokens
- Allow-list applied to static and remote on ok + error paths
