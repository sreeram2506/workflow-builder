# Unit of Work — Dynamic Properties

**Parent label**: Dynamic Properties  
**Deployment model**: Same monolith Angular SPA (no new package)  
**Unit meaning**: One logical construction module  
**Sequencing**: Single unit — FD → Code Generation → Build and Test (plan Q2=A)  
**Ownership**: Same stream (plan Q4=A)  
**Construction**: Functional Design → Code Generation; skip NFR Requirements/Design and Infrastructure Design (plan Q2=A)  
**Product boundary**: `node.data.properties` map + Dynamic Property + chrome addProperty; extends U-HP-01  
**Application Design**: `dynamic-properties-application-design.md`  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A  
**Depends on**: U-HP-01 host Properties (schema, resolve, sidebar) — COMPLETE

---

## Code organization (brownfield) — Q3=A

```text
src/app/
  core/domain/
    host-properties.dynamic.ts          # ADD map helpers, infer, remaining keys, collision
    host-properties.dynamic.spec.ts     # ADD example + PBT Partial
    host-properties.resolve.ts          # REUSE metadata first-win (no change required unless needed)
  core/ui-config/
    ui-features.types.ts                # CHANGE PropertiesPanelFeatures.addProperty
    (normalize / defaults)              # CHANGE default addProperty false
  features/shell/
    dynamic-property.component.ts       # ADD
    right-sidebar.component.ts          # CHANGE bind/save to properties map; remaining keys; Add UX
    right-sidebar.component.spec.ts     # EXTEND

docs/
  workflow-builder-ui-embed.md          # CHANGE properties map + inference + addProperty

src/app/try/
  try-ui-host.component.ts              # CHANGE demo schema + extras / optional addProperty
```

No new Angular project. No `features/properties/` folder (Q3≠B). No Enso names in the public API.

---

## Unit Catalog

### U-DP-01 — Dynamic Properties

| Field | Value |
|---|---|
| **Id** | `u-dp-01-dynamic-properties` |
| **Stories** | US-DP-01, US-DP-02, US-DP-03, US-DP-04, US-DP-05 |
| **Responsibility** | Properties map bind/save; Dynamic Property + inference; built-in collision; addProperty chrome; docs + try host |
| **Primary components** | `host-properties.dynamic.ts`, `dynamic-property.component.ts`, UI chrome, `wb-right-sidebar`, embed docs, try host |
| **Depends on** | U-HP-01 schema/resolve/sidebar; `WorkflowFacade.patchNode`; General + logic built-ins |
| **Out of scope** | Live widget registry; instance `[properties]` input; `propertiesChange` output; migrating built-in values into the map; Enso adapters |
| **Internal order** | Chrome → helpers → Dynamic Property → sidebar → docs/try/tests |
| **PBT** | Partial — inference; remaining-keys; map bind round-trip |
| **Done when** | US-DP-01..05 AC pass; `npm test` / `npm run build` green |

---

## Construction Rule

After Units Generation approval, CONSTRUCTION runs **U-DP-01** (Functional Design → Code Generation → Build and Test), then Operations placeholder.
