# Unit of Work — Generic host-driven Properties

**Parent label**: Generic host-driven Properties  
**Deployment model**: Same monolith Angular SPA (no new package)  
**Unit meaning**: One logical construction module  
**Sequencing**: Single unit — FD → Code Generation → Build and Test (plan Q2=A)  
**Ownership**: Same stream (plan Q4=A)  
**Construction**: Functional Design → Code Generation; skip NFR Requirements/Design and Infrastructure Design (plan Q2=A)  
**Product boundary**: Host-driven Properties schema (palette copy + adapter); no Enso flatten; no Ignore Keys  
**Application Design**: `host-properties-application-design.md`  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A  
**Depends on**: Properties panel, `getAtPath`/`setAtPath`, `provideWorkflowBuilderUi`, palette drop (U-HPI / U-LIM) — COMPLETE

---

## Code organization (brownfield) — Q3=A

```text
src/app/
  core/domain/
    host-properties.schema.ts           # ADD types, sanitize, logic built-in schemas
    host-properties.schema.spec.ts      # ADD example + PBT Partial
    host-properties.resolve.ts          # ADD resolveHostPropertiesSchema (or colocate in schema file)
    host-properties.resolve.spec.ts     # ADD first-win cases
    palette.catalog.ts                  # CHANGE PaletteItem.propertiesSchema
    palette-host.helpers.ts             # CHANGE copy propertiesSchema on sanitize if palettes overlay
    node.factory.ts                     # CHANGE copy propertiesSchema + taskMeta (not ensoTask)
    node.factory.spec.ts                # CHANGE
    properties.schema.ts                # CHANGE drop Ignore Keys / host-facing Xpms
    enso-task-form.ts                   # CHANGE/DELETE flatten; keep coerce only if needed
    enso-task-form.spec.ts              # CHANGE/DELETE
  core/ui-config/
    provide-workflow-builder-ui.ts      # CHANGE properties?: { schemaFor }
    properties-adapter.ts               # ADD token + schemaFor type (or colocate in provide file)
  features/shell/
    right-sidebar.component.ts          # CHANGE first-win render/save; no flatten; no Ignore Keys
    right-sidebar.component.spec.ts     # EXTEND schema render/save; Action taskMeta; unknown widget

docs/
  workflow-builder-ui-embed.md          # CHANGE propertiesSchema + properties adapter
```

No new Angular project. No `core/properties/` folder (Q3≠B). Do not commit `src/app/try/` or Enso field names in the public API.

---

## Unit Catalog

### U-HP-01 — Generic host-driven Properties

| Field | Value |
|---|---|
| **Id** | `u-hp-01-host-properties` |
| **Stories** | US-HP-01, US-HP-02, US-HP-03, US-HP-04 |
| **Responsibility** | Generic schema types + sanitize; drop copy; sync properties adapter; first-win resolve; sidebar render/save; stop flatten; embed docs |
| **Primary components** | `host-properties.schema.ts`, resolver, `provideWorkflowBuilderUi({ properties })`, `node.factory`, `wb-right-sidebar`, embed docs |
| **Depends on** | Existing `config-path` get/set; General form; logic connector UI; `[palettes]` overlay |
| **Out of scope** | Live widget registry; instance `[properties]` input; migrating leftover `ensoTask`; Enso HTTP / PlatformApi; ng-packagr; 100vh; breaking chrome / Condition edges / Router connectors |
| **Internal order** | Types+sanitize → factory copy → adapter+resolve → sidebar → delete flatten → docs/tests |
| **PBT** | Partial — skip-invalid; no `..` write; first-win; `taskMeta` not walked |
| **Done when** | US-HP-01..04 AC pass; schema Save writes paths; omit schema → logic built-ins; Action + `taskMeta` not flattened; unknown widget safe; `npm test` / `npm run build` green |

---

## Construction Rule

After Units Generation approval, CONSTRUCTION runs **U-HP-01** (Functional Design → Code Generation → Build and Test), then Operations placeholder.
