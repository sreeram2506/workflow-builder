# Application Design Summary — Dynamic Properties

Consolidates `dynamic-properties-*.md` design artifacts.

## Decisions locked (plan)

| Q | Answer | Design implication |
|---|---|---|
| Q1 | **A** | Pure `host-properties.dynamic.ts` helpers; no injectable |
| Q2 | **A** | Standalone `dynamic-property.component.ts` under features/shell |
| Q3 | **A** | Batch Save merges full `properties` map via `patchNode` |
| Q4 | **A** | Minimal Add UX (key + value text); new keys as strings |
| Q5 | **A** | No new PropertiesPanelService |

## Artifacts

| File | Content |
|---|---|
| `dynamic-properties-components.md` | Helpers, Dynamic Property, chrome, sidebar, docs |
| `dynamic-properties-component-methods.md` | Method / I/O signatures |
| `dynamic-properties-services.md` | No new service; facade orchestration |
| `dynamic-properties-component-dependency.md` | Matrix + data flows |

## Traceability

| FR / Story | Design coverage |
|---|---|
| FR-DP-01 · US-DP-01 | Properties map via helpers + Save merge |
| FR-DP-02 · US-DP-02 | Dynamic Property component |
| FR-DP-03 · US-DP-02 | `inferControlKind` |
| FR-DP-04 · US-DP-01, US-DP-02 | Schema bind + remaining keys |
| FR-DP-05 · US-DP-03 | Built-ins + collision omit |
| FR-DP-06 · US-DP-04 | `addProperty` chrome + minimal Add UX |
| FR-DP-07 · US-DP-01 | `patchNode` only |
| FR-DP-08 · US-DP-05 | Vendor-neutral docs |
| FR-DP-09 · US-DP-05 | Docs + try host |
| NFR-DP-01..05 | Safe coerce; no HTML inject; PBT on helpers in FD/CG |

## Extension compliance (this stage)

| Extension | Status | Rationale |
|---|---|---|
| Security Baseline | Compliant | No HTML from values; vendor-neutral; infra N/A |
| Resiliency Baseline | Compliant | Safe coerce; DR N/A |
| PBT Partial | Compliant | Pure helpers identified for FD/CG |

## Next

Units Generation (1 unit U-DP-01) → Construction Functional Design → Code Generation → Build and Test.
