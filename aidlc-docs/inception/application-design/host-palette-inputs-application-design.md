# Application Design Summary — Host palette inputs (Syncfusion-style)

Consolidates `host-palette-inputs-*.md` design artifacts.

## Decisions locked (plan)

| Q | Answer | Design implication |
|---|---|---|
| Q1 | **A** | Overlay via left-sidebar `loadCatalog`; catalog stays root |
| Q2 | **A** | `input<T[] \| undefined>()` no default; unbound = omit |
| Q3 | **A** | Catalog drops unknown types |
| Q4 | **A** | Present `[defaultAgents]` wins over JSON/provider |
| Q5 | **A** | One unit U-HPI-01 |

## Artifacts

| File | Content |
|---|---|
| `host-palette-inputs-components.md` | Shell/skills/sidebar/catalog/docs |
| `host-palette-inputs-component-methods.md` | Inputs + `loadCatalog` overlay |
| `host-palette-inputs-services.md` | Precedence + orchestration |
| `host-palette-inputs-component-dependency.md` | Matrix, data flow, unit |

## Traceability

| FR / Story | Design coverage |
|---|---|
| FR-HPI-01 · US-HPI-01, US-HPI-02, US-HPI-03 | Shell/skills inputs |
| FR-HPI-02 · US-HPI-04 | Palettes present wins over catalog provider |
| FR-HPI-03 · US-HPI-01, US-HPI-03 | Omit / `[]` / items |
| FR-HPI-04 · US-HPI-02 | defaultAgents present wins |
| FR-HPI-05 · US-HPI-05 | Catalog drops unknown types |
| FR-HPI-06 · US-HPI-06 | Embed docs |
| NFR-HPI-01 | Omit = U-PAL-02 |
| NFR-HPI-04 | PBT omit/`[]`/drop in FD/CG |

## Next

Units Generation → Construction (FD → Code Gen → Build and Test). NFR Requirements/Design and Infrastructure Design skipped per execution plan.
