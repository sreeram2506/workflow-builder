# Unit of Work — Palette / catalog host config (v1)

**Parent label**: Palette / catalog host config  
**Deployment model**: Same monolith Angular SPA (no new package / no ng-packagr in v1)  
**Unit meaning**: Two logical construction modules  
**Sequencing**: **Strict** — U-PAL-02 starts only after U-PAL-01 Build/Test approved (Q2=A)  
**Ownership**: Same stream (Q3=A)  
**Construction per unit**: Functional Design → Code Generation; skip NFR Requirements/Design and Infrastructure Design; Build and Test after each unit (Q4=A)  
**Product boundary**: Palette allow-lists, `defaultAgents`, catalog adapter — no publishable library, no skills-side `defaultAgents`, no workflow document schema change (Q5=A)  
**Application Design**: `palette-host-config-application-design.md`  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A

UI Configurability U-UI-01 / U-UI-02 catalogs are unchanged. This increment extends them.

---

## Code organization (brownfield) — Q6=A

```text
src/app/
  core/ui-config/                      # EXTEND (U-PAL-01 + catalog tokens in 02)
    ui-features.types.ts               # add palette.* (01)
    merge-ui-features.ts               # omit vs present vs [] (01)
    ui-config.token.ts                 # features token; catalog tokens (02)
    provide-workflow-builder-ui.ts     # features.palette (01); catalog option (02)
    ui-config.service.ts               # resolved palette on features() (01)
  core/domain/
    palette.catalog.ts                 # existing PaletteItem / FEATURED types
    palette-host.helpers.ts            # NEW (01): filter + resolveDefaultAgents
  core/data/
    enso-task-catalog.service.ts       # U-PAL-02: adapter vs Enso; no mocks
  features/shell/
    left-sidebar.component.ts          # U-PAL-02: strip + 0..N default cards

src/assets/
  wb-ui-config.json                    # may include palette samples (02 polish)
  examples/                            # allow-list + defaultAgents JSON (02)

docs/
  workflow-builder-ui-embed.md         # palette + provider catalog (02)
  workflow-builder-ui-config-try.md    # try JSON (02)
```

Units do not create a new Angular project or deployable. Helper filename may be a sibling of `palette.catalog.ts` (FD may lock the exact name).

---

## Unit Catalog

### U-PAL-01 — Palette config core

| Field | Value |
|---|---|
| **Id** | `u-pal-01-palette-config-core` |
| **Stories** | US-PAL-01, US-PAL-02, US-PAL-03, US-PAL-04 |
| **Responsibility** | `UiFeatures.palette` types; merge presence (omit / present / `[]`); `filterPaletteItemsByAllowList`; `resolveDefaultAgents` → `PaletteItem[]`; unit + PBT; JSON/provider still win as chrome |
| **Primary components** | `core/ui-config` types/merge/service, domain helpers |
| **Depends on** | Existing U-UI-01 `UiConfigService` / merge; `PaletteItem` / `NodeType` |
| **Out of scope** | Catalog adapter tokens, Enso wiring, mock removal, sidebar rendering, embed docs |
| **Internal order** | types → merge presence + tests → filter helper + PBT → `resolveDefaultAgents` + PBT → service exposes `features().palette` |
| **PBT** | Partial — allow-list filter (NFR-PAL-04) + defaultAgents merge/defaulting (NFR-PAL-05) |
| **Done when** | Provider overlay wins for `palette.*`; omitted keys = show-all / Blank Agent; `[]` ≠ omitted; `AIAgent` missing from allow-list hides default agents; `npm test` green for this slice |

### U-PAL-02 — Catalog wiring + docs

| Field | Value |
|---|---|
| **Id** | `u-pal-02-catalog-wiring` |
| **Stories** | US-PAL-05, US-PAL-06, US-PAL-07 |
| **Responsibility** | Catalog tokens + `provideWorkflowBuilderUi({ catalog })`; Enso default; apply 01 helpers in `EnsoTaskCatalogService`; drop `MOCK_SOLUTION_AGENTS`; featured strip + 0..N default cards; failure banner + static only; embed/try docs + example JSON |
| **Primary components** | tokens/provider catalog option, `EnsoTaskCatalogService`, `LeftSidebarComponent`, `docs/`, example JSON |
| **Depends on** | **U-PAL-01** (strict) |
| **Out of scope** | Skills `defaultAgents`; ng library; multiple adapters per canvas |
| **Internal order** | adapter contract + tokens → catalog orchestration → remove mocks → sidebar strip/defaults → docs/examples → tests |
| **PBT** | None required beyond 01 unless new pure helpers appear |
| **Done when** | US-PAL-05..07 AC pass; no mock agents on failure; docs show provider-only adapters; suites green |

---

## Construction Rule

After Units Generation approval, CONSTRUCTION runs **U-PAL-01 first** (FD → CG → Build and Test), then **only after approval** starts **U-PAL-02** the same way.
