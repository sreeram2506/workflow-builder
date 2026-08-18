# Business Logic Summary — U-HP-01 Generic host-driven Properties

**Stories**: US-HP-01, US-HP-02, US-HP-03

## Created

| Path | Change |
|---|---|
| `src/app/core/domain/host-properties.schema.ts` | Generic schema types; sanitize (skip empty / `..` / unknown type); logic built-ins |
| `src/app/core/domain/host-properties.schema.spec.ts` | Skip invalid fields; keep valid rest |
| `src/app/core/domain/host-properties.schema.pbt.spec.ts` | P-HP-01 |
| `src/app/core/domain/host-properties.resolve.ts` | First-win: plain-object `propertiesSchema` (incl. `{}`) → adapter → built-in → null |
| `src/app/core/domain/host-properties.resolve.spec.ts` | `{}` wins; adapter throw; Action + taskMeta → null |
| `src/app/core/domain/host-properties.resolve.pbt.spec.ts` | P-HP-02, P-HP-03 |
| `src/app/core/ui-config/properties-adapter.ts` | `schemaFor` adapter + `WORKFLOW_BUILDER_PROPERTIES` token |

## Modified

| Path | Change |
|---|---|
| `src/app/core/domain/palette.catalog.ts` | Optional `propertiesSchema` on `PaletteItem` |
| `src/app/core/domain/palette-host.helpers.ts` | Copy plain-object `propertiesSchema` with palette extras |
| `src/app/core/domain/palette-host.helpers.spec.ts` | Overlay copies schema |
| `src/app/core/domain/node.factory.ts` | Copy schema; `taskMeta` → `data.taskMeta` (not `ensoTask`) |
| `src/app/core/domain/node.factory.spec.ts` | Assert `taskMeta` + schema copy |
| `src/app/core/ui-config/provide-workflow-builder-ui.ts` | `options.properties` |
| `src/app/core/ui-config/index.ts` | Re-export adapter + token |
| `src/app/core/domain/properties.schema.ts` | Drop Ignore Keys / Xpms host-facing types; keep General helpers |
| `src/app/core/domain/config-path.spec.ts` | No Ignore Keys invariant; Action/Trigger have no built-in fields |
| `src/app/core/domain/logic-node-rules.spec.ts` | Repeater options still `[]` via built-in schema |

## Deleted

| Path | Reason |
|---|---|
| `src/app/core/domain/enso-task-form.ts` | Flatten is not a form source |
| `src/app/core/domain/enso-task-form.spec.ts` | Same |

## Rules implemented

- Plain-object `node.data.propertiesSchema` (including `{}`) wins and is sanitized; no fall-through
- Adapter `schemaFor` throw / non-object → skip adapter
- Paths empty or containing `..` are dropped; sanitize never throws
- Opaque `taskMeta` is not walked into fields
