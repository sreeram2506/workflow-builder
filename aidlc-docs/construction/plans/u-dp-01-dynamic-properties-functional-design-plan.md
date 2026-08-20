# U-DP-01 Functional Design Plan — Dynamic Properties

**Unit**: `u-dp-01-dynamic-properties`  
**Status**: STAGE APPROVED — CG PLAN OPEN  
**Locked FD**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A  
**Stories**: US-DP-01..05  
**App Design locks**: Pure helpers; Dynamic Property component; batch Save merge; minimal Add UX; no new service  
**UoW locks**: Q1=A · Q2=A · Q3=A · Q4=A  
**Next after FD approval**: Code Generation (NFR/Infra SKIP)

Output dir: `aidlc-docs/construction/u-dp-01-dynamic-properties/functional-design/`

Functional design approved. Code generation plan open.

---

## Execution checklist (after plan approval)

- [x] Generate `business-logic-model.md`
- [x] Generate `business-rules.md`
- [x] Generate `domain-entities.md`
- [x] Generate `frontend-components.md`
- [x] Include Testable Properties (PBT Partial)
- [x] Validate vs US-DP-01..05

---

## Question 1

**Nested `field.path` under the properties map**

A) **Recommended** — Support dotted paths relative to `node.data.properties` via existing `getAtPath` / `setAtPath` (e.g. path `timeout` → `properties.timeout`; path `nested.x` → `properties.nested.x`). Schema “covered” set uses the full path string for remaining-key exclusion (top-level key of a nested path still may appear if present as its own key — exclude only exact path strings and the top-level segment when the schema path is single-segment).

B) Only allow single-segment paths (no dots) in this increment; skip nested schema paths as invalid

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Remaining-key list order**

A) **Recommended** — Stable: `Object.keys` insertion order of the current `properties` map (after filters)

B) Alphabetical sort of remaining keys

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Add property — duplicate or empty key**

A) **Recommended** — Empty/whitespace-only key: ignore Add (no-op). Duplicate key: overwrite the working form value for that key (same as editing). Trim key before insert.

B) Duplicate key shows an inline error and does not overwrite

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Built-in collision id set**

A) **Recommended** — For Condition: omit `condition` from dynamic list. For Repeater: omit `repeater.workflowId`, `repeater.versionId`, `repeater.is_paused` (and any other built-in field paths). For Decision/Router: empty collision set (no built-in fields today). Match paths against **top-level or dotted keys as stored in the properties map** (exact string match on map keys and on schema covered paths).

B) Omit only single-segment keys; never omit dotted keys from the dynamic list

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Malformed `node.data.properties`**

A) **Recommended** — If missing or not a plain object, treat as `{}` for read; on Save write a plain object map. Do not crash the panel.

B) If not a plain object, show an error banner and disable host/dynamic sections

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6

**PBT (Partial)**

A) **Recommended** — Invariants: (1) `inferControlKind` maps string/number/boolean/nullish/other as specified in FR-DP-03. (2) `listRemainingPropertyKeys` never returns a key in the covered set or collision set. (3) Round-trip: write map via `withPropertiesMap` then `getPropertiesMap` yields equal plain entries for generated string keys/values. Example tests for Save merge and Add chrome gate.

B) Example tests only (no new PBT)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7

**Frontend — Dynamic Property vs existing field controls**

A) **Recommended** — Schema-backed fields keep using existing sidebar field controls (bound to properties map). Remaining/inferred keys use `wb-dynamic-property` (or equivalent selector). Add row is sidebar-local when chrome on.

B) Route all host/dynamic fields (including schema) through Dynamic Property only

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Optional freeform

```text

```
