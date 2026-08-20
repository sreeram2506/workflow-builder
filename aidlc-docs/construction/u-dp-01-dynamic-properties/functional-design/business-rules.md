# Business Rules — U-DP-01 Dynamic Properties

---

## BR-DP-01 — Value map (FR-DP-01, Q5=A)

Host/dynamic field values SHALL live in `node.data.properties` as a plain `Record<string, unknown>`. Missing or non-object → treat as `{}` on read; Save writes a plain object. Panel MUST NOT crash.

## BR-DP-02 — Schema bind (FR-DP-04, Q1=A, Q7=A)

Schema field `path` is relative to the properties map (`getAtPath` / `setAtPath`). Dotted paths allowed. Schema-backed fields use existing sidebar controls (not Dynamic Property).

## BR-DP-03 — Covered vs remaining (FR-DP-04, Q1=A, Q2=A)

`coveredPaths` = visible schema `field.path` strings (exact). Remaining keys = `Object.keys(properties)` in insertion order, excluding keys in `coveredPaths` ∪ `collisionIds`. Nested schema path `a.b` does not auto-exclude top-level key `a` unless `a` is itself covered or colliding.

## BR-DP-04 — Inference (FR-DP-03)

| Value | Control |
|---|---|
| string | text |
| number | number |
| boolean | boolean |
| null / undefined | text (empty) |
| other | read-only JSON textarea |

## BR-DP-05 — Built-ins + collision (FR-DP-05, Q4=A)

Condition / Decision / Repeater built-in sections always show when applicable (U-HP-01 paths on `node.data`). Collision omit from dynamic list: Condition `condition`; Repeater `repeater.workflowId`, `repeater.versionId`, `repeater.is_paused` (+ other built-in field paths); Decision empty set. Exact string match on map keys.

## BR-DP-06 — General (NFR-DP-05)

General (label, subtitle, status) always above configuration sections.

## BR-DP-07 — Add property (FR-DP-06, Q3=A)

When `propertiesPanel.addProperty` is false/omitted: no Add UI. When true: key + value text + Add; trim key; empty → no-op; duplicate → overwrite; new values are strings.

## BR-DP-08 — Save (FR-DP-07)

Batch Save merges full `properties` map via `patchNode`. No new shell output event.

## BR-DP-09 — Safety (NFR-DP-01)

Do not render labels/values as HTML. Unknown widgets remain disabled text (U-HP-01). No Enso-specific names in public API.

## BR-DP-10 — Docs / try (FR-DP-08, FR-DP-09, NFR-DP-04)

Embed docs document map binding, inference, addProperty, and migration off top-level schema value paths. Try host demonstrates schema + extras.

## BR-DP-11 — PBT (Q6=A, NFR-DP-03)

See P-DP-01..03 in `business-logic-model.md`.
