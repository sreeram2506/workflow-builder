# Business Logic Model — U-HP-01 Generic host-driven Properties

**Unit**: `u-hp-01-host-properties`  
**Stories**: US-HP-01..04  
**Locked FD**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A

Package renders a host schema and writes `node.data`. It does not interpret Enso-shaped blobs.

---

## Purpose

Resolve a `HostPropertiesSchema` (first win), render it in Properties, Save along field `path`s. Stop flattening `taskMeta` / leftover `ensoTask`. Remove Ignore Keys.

---

## Core process

```text
1. Drop palette item
   -> copy propertiesSchema (plain object) onto node.data.propertiesSchema
   -> copy taskMeta onto node.data.taskMeta (not ensoTask)
   -> copy metadata / icons as today
   -> sanitizeHostPaletteItems also copies propertiesSchema (Q4=A)

2. Select node -> Properties
   -> always bind General (label, subtitle, status)
   -> resolveHostPropertiesSchema(node, adapter | null)
      a. node.data.propertiesSchema is a non-null plain object (not array), including {}
         -> sanitize; WIN (Q1=A); do not fall through
      b. else adapter.schemaFor(node)
         -> if throws or non-object: treat as no adapter schema (Q2=A)
         -> else sanitize and use
      c. else if Condition / Decision / Repeater
         -> logic built-in HostPropertiesSchema
         -> Repeater workflow/version options still [] (Q6=A)
      d. else null -> Configuration empty (General only)

3. Render
   -> skip hidden and invalid fields
   -> section heading + fields (Q7=A)
   -> unknown ui_component -> disabled text
   -> view mode disables form

4. Save
   -> required empty blocks Save
   -> coerce (Q3=A): boolean, Number, string, string[]
   -> setAtPath(node.data, path, value)
   -> hidden fields not written from the form
   -> patchNode
```

---

## Transformations

| Step | Input | Output |
|---|---|---|
| Sanitize schema | unknown | `HostPropertiesSchema` with only valid fields |
| Resolve | node + optional adapter | schema or `null` |
| Drop copy | `PaletteItem` | `data.propertiesSchema`, `data.taskMeta` |
| Save field | form control | coerced value at `path` on `node.data` |

Sanitize is **lossy** (no inverse). Flatten of blobs does not exist.

---

## Testable Properties (PBT Partial)

| ID | Category | Property |
|---|---|---|
| P-HP-01 | Invariant (PBT-03) | `sanitizeHostPropertiesSchema` never keeps a field whose `path` is empty or contains `..` |
| P-HP-02 | Invariant | If `node.data.propertiesSchema` is a plain object, resolve result is **not** the logic built-in schema for that node type (first-win; `{}` still wins) |
| P-HP-03 | Invariant | Resolving without a host/adapter schema does not invent fields from `taskMeta` keys (no-walk) |

PBT-02 N/A (lossy sanitize). Generators: random field types/paths including `..` and empty; node types with/without schema object (PBT-07). `fc.assert` + seed (PBT-08). fast-check (PBT-09).

Example (non-PBT) tests: Save writes `timeout` path; Action + `taskMeta` shows General only; unknown `ui_component` disabled; adapter throw falls through to built-ins.

---

## Persistence

New optional keys on `node.data`: `propertiesSchema`, `taskMeta`. Leftover `ensoTask` unused. Repeater ids not cleared (Q6=A).
