# Application Design Plan — Dynamic Properties

**Role**: Application Architect  
**Status**: APPROVED — ARTIFACTS GENERATED  
**Locked answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  
**Execution plan**: Approved Q1=A (1 unit U-DP-01)  
**Requirements**: FR-DP-01..09 · **Stories**: US-DP-01..05

Design artifacts generated. Approve to continue to Units Generation, or request changes.

This increment extends existing host Properties (U-HP-01). No new deployable.

---

## Proposed components (after answers; defaults A)

| Component | Kind | Responsibility |
|---|---|---|
| Properties map helpers | New/extend domain | Read/write `node.data.properties`; remaining-keys filter; built-in collision omit; inference |
| Dynamic Property component | New UI | Render one key from metadata or inferred type |
| `PropertiesPanelFeatures.addProperty` | UI chrome | Default `false`; gate Add-property UI |
| `wb-right-sidebar` | UI (extend) | Schema bind into properties map; list remaining keys; Save via `patchNode`; General + built-ins unchanged order |
| Host schema resolve | Existing | Keep first-win for metadata; values from map (not top-level `node.data` paths) |
| Embed docs + try host | Docs/demo | Contract + example |

---

## Execution checklist (Part 2 — after plan approval)

- [x] Generate `dynamic-properties-components.md`
- [x] Generate `dynamic-properties-component-methods.md`
- [x] Generate `dynamic-properties-services.md`
- [x] Generate `dynamic-properties-component-dependency.md`
- [x] Generate `dynamic-properties-application-design.md` (summary)
- [x] Validate design completeness (FR/US coverage)

---

## Question 1

**Where do inference / remaining-keys helpers live?**

A) **Recommended** — New pure domain module (e.g. `host-properties.dynamic.ts`) next to existing host-properties schema/resolve; sidebar and Dynamic Property call it. No new injectable service.

B) Methods on a new `DynamicPropertiesService` injectable

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Dynamic Property component placement**

A) **Recommended** — Feature component under shell/properties (e.g. `features/shell/dynamic-property.component.ts`), used by `wb-right-sidebar`

B) Inline all controls in `right-sidebar.component.ts` without a separate component (overrides FR-DP-02 “component” as a logical unit only)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**How schema Save writes the properties map**

A) **Recommended** — Build a full `properties` object from form state and `patchNode` with `{ data: { ...prev, properties } }` (merge), same Save button as today

B) Patch each key individually with separate `patchNode` calls on every control change (live write, no Save batch)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 4

**Add-property UX when chrome is on**

A) **Recommended** — Minimal: key text input + value text input + Add button; new keys start as strings; type can change later via inference on re-open after Save if host sets typed values

B) Key + typed value picker (string/number/boolean) before Add

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Service layer for this increment**

A) **Recommended** — No new orchestration service; continue `WorkflowFacade.patchNode` + pure helpers + sidebar

B) Add a thin `PropertiesPanelService` that owns form model ↔ properties map mapping

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Optional freeform

```text

```
