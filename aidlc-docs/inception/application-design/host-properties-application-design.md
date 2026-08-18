# Application Design Summary — Generic host-driven Properties

Consolidates `host-properties-*.md` design artifacts.

## Decisions locked (plan)

| Q | Answer | Design implication |
|---|---|---|
| Q1 | **A** | New `host-properties.schema.ts`; built-ins in those types; no host-facing Xpms / Ignore Keys |
| Q2 | **A** | Pure `resolveHostPropertiesSchema`; no new injectable |
| Q3 | **A** | Sync `schemaFor(node)` on `provideWorkflowBuilderUi({ properties })` |
| Q4 | **A** | Delete flatten usage; keep coerce helpers only if needed |
| Q5 | **A** | Unknown `ui_component` → disabled text |

## Artifacts

| File | Content |
|---|---|
| `host-properties-components.md` | Types, resolver, adapter, factory, sidebar, docs |
| `host-properties-component-methods.md` | Sanitize, resolve, copy, bind/save |
| `host-properties-services.md` | Orchestration (first-win + drop copy) |
| `host-properties-component-dependency.md` | Matrix, data flow, U-HP-01 |

## Traceability

| FR / Story | Design coverage |
|---|---|
| FR-HP-01 · US-HP-01 | Generic types in new domain file |
| FR-HP-02 · US-HP-02 | Pure first-win resolver |
| FR-HP-03 · US-HP-01 | Factory copy `propertiesSchema` + `taskMeta` |
| FR-HP-04 · US-HP-01 | Sidebar render + `setAtPath` Save |
| FR-HP-05 · US-HP-02 | Logic built-ins as `HostPropertiesSchema` |
| FR-HP-06 · US-HP-02 | `null` resolve → General only; no Ignore Keys |
| FR-HP-07 · US-HP-03 | Unknown widget disabled text |
| FR-HP-08 · US-HP-03 | No `collectEnsoTaskFields` |
| FR-HP-09 · US-HP-01 | Sanitize skip-invalid |
| FR-HP-10 · US-HP-04 | Embed docs |
| NFR-HP-01 | Skip `..`; no blob walk; no Enso names in public API |
| NFR-HP-02 | Skip-invalid; adapter absence → next source |
| NFR-HP-03 | PBT Partial planned for FD/CG |

## Extension compliance (this stage)

| Extension | Status | Rationale |
|---|---|---|
| Security Baseline | Compliant | Unsafe paths skipped; blobs uninterpreted; no Enso names in public contract |
| SECURITY-01–08, 10, 12, 14 | N/A | No new stores, APIs, auth, or infra |
| Resiliency Baseline | Compliant | Fail-safe skip; DR N/A |
| Property-Based Testing | Compliant | Sanitize / first-win / no-walk planned for FD/CG |

## Next

Units Generation (1 unit U-HP-01) → Construction Functional Design → Code Generation → Build and Test.
