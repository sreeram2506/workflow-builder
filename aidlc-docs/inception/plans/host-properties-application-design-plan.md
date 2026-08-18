# Application Design Plan — Generic host-driven Properties

**Role**: Application Architect  
**Status**: APPROVED — ARTIFACTS GENERATED  
**Locked answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  
**Execution plan**: Approved Q1=A (1 unit U-HP-01)  
**Requirements**: FR-HP-01..10 · **Stories**: US-HP-01..04

Fill every `[Answer]:`, then reply in chat (for example `answered`). Design artifacts will not be generated until this plan is approved.

This increment adds a host Properties contract on the existing right sidebar. No new deployable.

---

## Proposed components (after answers; defaults A)

| Component | Kind | Responsibility |
|---|---|---|
| Host properties schema types | New domain file | `sections[]` / `fields[]`; sanitize (skip invalid / `..` / unknown type) |
| Schema resolver | Pure domain function | First-win: `node.data.propertiesSchema` → adapter → logic built-ins → none |
| `provideWorkflowBuilderUi({ properties })` | DI | Optional `schemaFor(node)` (sync); no instance `[properties]` input |
| `PaletteItem` + `node.factory` | Domain | Copy `propertiesSchema` and `taskMeta` (not `ensoTask`) |
| `wb-right-sidebar` | UI | Render resolved schema; Save via `setAtPath` on `node.data`; General always; no flatten; no Ignore Keys |
| `enso-task-form` flatten | Domain | Stop using `collectEnsoTaskFields` as a form source |
| Embed docs | Docs | Schema + adapter; no Enso field names |

---

## Execution checklist (Part 2 — after plan approval)

- [x] Generate `host-properties-components.md`
- [x] Generate `host-properties-component-methods.md`
- [x] Generate `host-properties-services.md`
- [x] Generate `host-properties-component-dependency.md`
- [x] Generate `host-properties-application-design.md` (summary)
- [x] Validate design completeness (FR/US coverage)

---

## Question 1

**Where do generic schema types live?**

A) **Recommended** — New domain file (not Enso-named), e.g. `host-properties.schema.ts`. Built-in Condition / Router / Repeater schemas are expressed in those types. Remove Ignore Keys / `XpmsFieldDescriptor` from the host-facing contract.

B) Add the new types into existing `properties.schema.ts` next to `XpmsFieldDescriptor` and keep both public

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**How is first-win resolution implemented?**

A) **Recommended** — Pure function in domain (e.g. `resolveHostPropertiesSchema(node, adapter)`). `wb-right-sidebar` calls it. No new injectable.

B) New `PropertiesSchemaService` injectable that wraps the same first-win rules

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Properties adapter shape**

A) **Recommended** — Sync `schemaFor(node: WorkflowNode): HostPropertiesSchema | null` on `provideWorkflowBuilderUi({ properties })`, injection token like catalog (but sync, not Observable)

B) Same async shape as catalog adapters (`Observable` / `Promise`)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**`enso-task-form.ts` after flatten is removed**

A) **Recommended** — Delete `collectEnsoTaskFields` usage from the sidebar. Keep path coerce/display helpers only if still needed; otherwise move them next to the new schema file and delete the flatten module.

B) Keep the file and flatten functions unused (dead code) for a later increment

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Unknown `ui_component` presentation**

A) **Recommended** — Show a disabled text control with the current value (never crash). Skip only invalid type/path fields (Q3 RA already: skip invalid; render rest).

B) Skip unknown `ui_component` fields entirely (no disabled placeholder)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
