# Generic host-driven Properties — Requirement Verification Questions

**Increment**: Generic host-driven Properties  
Fill each `[Answer]:`, then reply in chat (e.g. `answered`).

No application code until answers are locked.

---

## Question 1
Where should the opaque host blob live on the dropped node?

A) Copy `palette.taskMeta` to `node.data.taskMeta` on drop. Do not flatten it. Leave leftover `data.ensoTask` unused (no migrate, no form).

B) Copy to `node.data.taskMeta` on drop, and migrate leftover `data.ensoTask` → `data.taskMeta` when binding Properties (still never flatten).

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2
Where do schema field `path` values read and write?

A) Relative to `node.data` (host can use `taskMeta.foo` in the path if the value should sit in the blob)

B) Always relative to `node.data.taskMeta` (schema cannot write other `node.data` keys; General still owns label/subtitle/status)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3
If a host schema is present but some fields are invalid (unknown `type`, empty `path`, `..` in path)?

A) Skip invalid fields; render the rest; never crash

B) Treat the whole schema as missing and continue to the next source (adapter → logic built-ins → General only)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4
How far should optional custom widgets go in this increment?

A) Host registers `ui_component` id → Angular component via `provideWorkflowBuilderUi`; unknown id → disabled text (or skip); never crash

B) Built-in field types only (`text` / `number` / `boolean` / `select` / `multiselect` / `textarea`); unknown `ui_component` → disabled text; no live custom component map yet

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 5
Besides copying `propertiesSchema` from the palette onto the node, how does the host supply a schema?

A) Only `provideWorkflowBuilderUi({ properties })` adapter (`schemaFor(node)`) plus `node.data.propertiesSchema` from drop

B) That adapter plus an instance input on the embed (same idea as `[palettes]`) for a per-instance resolver

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6
When a host schema is shown, is the General block (label, subtitle, status) still always visible?

A) Yes — General always above host sections (and above logic built-ins)

B) No — General only when there is no host schema (no adapter, no `propertiesSchema`)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7
Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)

B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 8
Should the resiliency baseline be applied to this project?

A) Yes — apply the resiliency baseline as directional best practices and design-time guidance (recommended for business-critical workloads, as an informed starting point that you can validate and harden before go-live)

B) No — skip the resiliency baseline (suitable for PoCs, prototypes, and experimental projects where rapid iteration matters more than reliability)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 9
Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints (recommended for projects with business logic, data transformations, serialization, or stateful components)

B) Partial — enforce PBT rules only for pure functions and serialization round-trips (suitable for projects with limited algorithmic complexity)

C) No — skip all PBT rules (suitable for simple CRUD applications, UI-only projects, or thin integration layers with no significant business logic)

X) Other (please describe after [Answer]: tag below)

[Answer]: B
