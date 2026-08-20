# Requirements Follow-Up — Dynamic Properties

**Prerequisite**: Answers in `dynamic-properties-requirement-verification-questions.md` received.  
Fill each `[Answer]:`, then reply **`answered`**.

---

## Interpreted answers (for confirmation)

| Q | Your answer | Interpretation |
|---|---|---|
| 1 | B + freeform | Values live under a dedicated map on the node; UI definitions come from host config (`propertiesSchema` / provider), like agents/palettes |
| 2 | A | Keep schema for known fields; allow additional dynamic keys |
| 3 | freeform (“show both / no exclude”) | Within the dynamic map, **do not** hide keys via a library reserved-key list |
| 4 | B | Infer primitives; empty/undefined → text; other → read-only JSON |
| 5 | C | “Add property” only when host enables a chrome flag |
| 6 | A | Always keep General above |
| 7 | B | Built-ins always for Condition/Router/Repeater; dynamic keys additional |
| 8 | A | Palette schema + `provideWorkflowBuilderUi({ properties })` only |
| 9 | A | `patchNode` / document only — no new output |
| 10 | B | Full edit + Save write-back in one unit |
| 11–13 | A / A / B | Security on; Resiliency on; PBT partial (pure + serialization) |

---

## Follow-up Question 1 — Exact storage key for the dynamic value map

A) Use `node.data.properties` as `Record<string, unknown>`

B) Use a different key name (specify after [Answer]:)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Follow-up Question 2 — Same key in built-in config and in the dynamic map

When Condition / Router / Repeater has a built-in field (e.g. expression) **and** the same key exists under the dynamic map:

A) Show both (built-in section + dynamic field) — host must avoid duplicate keys

B) Built-in wins for that key; omit the duplicate from the dynamic list

C) Dynamic map wins for that key; hide the built-in field

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Follow-up Question 3 — Chrome flag for “Add property” (Q5 = C)

A) Add `propertiesPanel.addProperty: boolean` (default `false`) under existing UI chrome / `provideWorkflowBuilderUi`

B) Reuse a generic canvas/properties flag you already have (name it after [Answer]:)

C) Defer Add-property UI to a later pause; this increment only edits existing keys (overrides Q5)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Follow-up Question 4 — Schema field + same key in `properties` map

When `propertiesSchema` defines field `foo` **and** `node.data.properties.foo` also exists:

A) Schema field binds to `node.data.properties.foo` (single source of values in the map)

B) Schema fields bind to paths on `node.data` as today; dynamic map is a separate bag shown afterward

C) Schema-only keys never appear twice; dynamic section shows only keys **not** covered by schema

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Optional freeform

```text

```
