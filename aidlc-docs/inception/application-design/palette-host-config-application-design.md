# Application Design Summary — Palette / catalog host config (v1)

Consolidates `palette-host-config-*.md` design artifacts.

## Decisions locked (plan)

| Q | Answer | Design implication |
|---|---|---|
| Q1 | **A** | `palette.*` on existing `UiConfigService` / `merge-ui-features` |
| Q2 | **C** | `provideWorkflowBuilderUi({ features, catalog })` sets optional catalog tokens |
| Q3 | **A** | Catalog applies allow-list; sidebar does not re-filter types |
| Q4 | **A** | U-PAL-01 then U-PAL-02 |
| Q5 | **A** | Pure `resolveDefaultAgents` → `PaletteItem[]` |

## Artifacts

| File | Content |
|---|---|
| `palette-host-config-components.md` | Catalog + responsibilities + config shape |
| `palette-host-config-component-methods.md` | Merge, helpers, adapter, catalog, sidebar contracts |
| `palette-host-config-services.md` | Bootstrap + catalog-load orchestration |
| `palette-host-config-component-dependency.md` | Matrix, data flow, unit split |

## Traceability

| FR / Story | Design coverage |
|---|---|
| FR-PAL-01 · US-PAL-01 | Merge layers; palette on same tree; no secrets in JSON |
| FR-PAL-02 · US-PAL-02, US-PAL-03 | Per-canvas allow-lists; omit / present / `[]` |
| FR-PAL-03 · US-PAL-04 | `resolveDefaultAgents`; AIAgent gate |
| FR-PAL-04 · US-PAL-05 | Catalog tokens; Enso default; one adapter per canvas |
| FR-PAL-05 · US-PAL-06 | Failure → static only, no mocks, banner |
| FR-PAL-06 · US-PAL-02, US-PAL-03 | Featured strip from filtered items |
| FR-PAL-07 · US-PAL-07 | Embed/try docs + example JSON |
| NFR-PAL-04/05 | PBT on filter + defaultAgents in U-PAL-01 |

## Next

Units Generation → Construction (FD → Code Gen per unit → Build and Test). NFR Requirements/Design and Infrastructure Design skipped per execution plan.
