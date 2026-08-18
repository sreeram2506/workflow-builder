# Application Design Summary — Remove APIs and dummy data

Consolidates `remove-apis-dummy-data-*.md` design artifacts.

## Decisions locked (plan)

| Q | Answer | Design implication |
|---|---|---|
| Q1 | **A** | Keep `EnsoTaskCatalogService`; strip HTTP; omit-without-adapter = empty-remote; delete Enso-only mappers/token helpers |
| Q2 | **A** | Adapter failure keeps static fallback + banner |
| Q3 | **A** | Convert `wb-nested-skills-library` to `[palettes]`; delete `MOCK_SKILLS`; do not mount new chrome |
| Q4 | **A** | Delete `repeater-mock.catalog.ts`; empty Repeater pickers |
| Q5 | **A** | No new injectable; HttpClient remains for UI-config JSON only |

## Artifacts

| File | Content |
|---|---|
| `remove-apis-dummy-data-components.md` | Catalog, env/proxy, nested library, Repeater, docs |
| `remove-apis-dummy-data-component-methods.md` | `loadCatalog` empty-omit; nested palettes API; schema |
| `remove-apis-dummy-data-services.md` | Orchestration (overlay / adapter / empty-remote) |
| `remove-apis-dummy-data-component-dependency.md` | Matrix, data flow, U-RAD-01 |

## Traceability

| FR / Story | Design coverage |
|---|---|
| FR-RAD-01 · US-RAD-01 | No Enso HTTP; strip env + proxy; delete catalog HTTP helpers |
| FR-RAD-02 · US-RAD-01 | Omit-without-adapter = empty-remote |
| FR-RAD-03 · US-RAD-02 | Delete `MOCK_SKILLS`; facade without mock lookup |
| FR-RAD-04 · US-RAD-02 | Nested library `[palettes]` + `addSkillFromPaletteItem`; left sidebar already binds palettes |
| FR-RAD-05 · US-RAD-03 | Delete repeater mock catalog; empty options |
| FR-RAD-06 · US-RAD-04 | Embed / README |
| NFR-RAD-01 | No credentials in env or docs |
| NFR-RAD-02 | Empty-remote is the no-data path (adapter failure unchanged) |
| NFR-RAD-03 | PBT Partial on omit-without-adapter compose in FD/CG |

## Extension compliance (this stage)

| Extension | Status | Rationale |
|---|---|---|
| Security Baseline | Compliant | Credentials stripped from env; no secrets in design docs |
| Resiliency Baseline | Compliant | Empty-remote no-data path; DR N/A |
| Property-Based Testing | Compliant | Omit-without-adapter invariant planned for FD/CG |

## Next

Units Generation (1 unit U-RAD-01) → Construction Functional Design → Code Generation → Build and Test.
