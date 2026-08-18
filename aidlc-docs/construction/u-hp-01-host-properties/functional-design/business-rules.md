# Business Rules — U-HP-01 Generic host-driven Properties

---

## BR-HP-01 — Generic schema (FR-HP-01)

Public types live in `host-properties.schema.ts` (not Enso-named). Fields: `type` (`text` | `number` | `boolean` | `select` | `multiselect` | `textarea`), `path`, `label`, `required`, `hidden`, `options`, `placeholder`, optional `ui_component`.

Public API SHALL NOT use `ensoTask`, skillconfig, x_config, PlatformApi, configurations, Xpms.

## BR-HP-02 — Sanitize invalid fields (FR-HP-09, NFR-HP-01)

Skip fields with unknown `type`, empty `path`, or `..` in the path. Never throw. Remaining fields render. A present schema object still wins after skip (Q1=A).

## BR-HP-03 — First-win resolve (FR-HP-02, Q1=A, Q2=A)

1. `node.data.propertiesSchema` is a non-null plain object (not array), including `{}` → sanitize and **win**.
2. Else `schemaFor(node)`: on throw or non-object, skip adapter and continue.
3. Else Condition / Decision / Repeater built-in `HostPropertiesSchema`.
4. Else `null` (General only).

## BR-HP-04 — Drop copy (FR-HP-03, Q4=A)

`sanitizeHostPaletteItems` copies a plain-object `propertiesSchema`. `createWorkflowNodeFromPaletteItem` copies `propertiesSchema` and `taskMeta` (not `ensoTask`). Opaque blobs are not interpreted.

## BR-HP-05 — Render and Save (FR-HP-04, Q3=A, Q7=A)

General always first. Each section is a heading plus fields. `hidden` not shown and not written from the form. Required empty blocks Save. Coerce: boolean; number via `Number`; text/textarea/select string; multiselect `string[]`. Paths relative to `node.data`. View mode disables.

## BR-HP-06 — Logic built-ins (FR-HP-05, Q6=A)

No host/adapter schema: Condition expression; Repeater workflow/version/pause with empty option lists; Router empty sections. Do not clear existing Repeater ids. Host schema on a Repeater replaces configuration fields; Condition true/false edges and Router connectors stay.

## BR-HP-07 — General only (FR-HP-06)

Non-logic types with `null` resolve: General only. SHALL NOT show Ignore Keys.

## BR-HP-08 — Unknown widget (FR-HP-07)

`ui_component` that is not a built-in control for `type` → disabled text with current value. Never crash. Never special-case Enso ids. No live component registry.

## BR-HP-09 — No flatten (FR-HP-08)

Do not call `collectEnsoTaskFields`. Do not walk `taskMeta` or leftover `ensoTask` into fields.

## BR-HP-10 — Docs (FR-HP-10, NFR-HP-01)

Embed docs: palette `propertiesSchema`, `provideWorkflowBuilderUi({ properties })`, first-win, paths on `node.data`. No Enso names or secrets.

## BR-HP-11 — PBT (Q5=A, NFR-HP-03)

See Testable Properties in `business-logic-model.md` (P-HP-01..03).
