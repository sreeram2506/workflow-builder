# Requirements — Generic host-driven Properties

## Intent Analysis Summary

| Field | Value |
|---|---|
| **User request** | Generic host-driven Properties (not Enso-specific) |
| **Request type** | Enhancement (brownfield) |
| **Scope** | Schema types, palette/node copy, properties adapter, right-sidebar render, stop flattening blobs, embed docs |
| **Complexity** | Moderate |
| **Requirements depth** | Standard |
| **Increment name** | Generic host-driven Properties |
| **Answers** | Q1=A · Q2=A · Q3=A · Q4=B · Q5=A · Q6=A · Q7=A · Q8=A · Q9=B |

See `host-properties-intent-analysis.md`.

---

## 1. Goals

1. Hosts configure dropped nodes through a **generic properties schema** (palette copy + optional adapter). This package renders fields and writes `node.data`; it does not know Enso skillconfig, x_config, PlatformApi, or configurations.
2. Stop using `collectEnsoTaskFields` / `data.ensoTask` as a form source. Opaque blobs stay uninterpreted.
3. Remove the Ignore Keys mock. Action/Trigger/etc. with no schema show General only.
4. Document the schema + adapter in embed docs with the same tone as `[palettes]` / catalog. No Enso field names in the public API.

---

## 2. Locked decisions

| Topic | Choice |
|---|---|
| Opaque blob | `palette.taskMeta` → `node.data.taskMeta` on drop; leftover `data.ensoTask` unused (no migrate, no flatten) |
| Field paths | Relative to `node.data` (host may use `taskMeta.foo`) |
| Invalid fields | Skip field; render the rest; never crash. Schema still wins (no fall-through to built-ins) |
| Custom widgets | Built-in types only this increment; unknown `ui_component` → disabled text; no live component map |
| Host supply | `node.data.propertiesSchema` then `provideWorkflowBuilderUi({ properties })`; no instance `[properties]` input |
| General | Always visible (label / subtitle / status) above host or built-in sections |
| Ignore Keys | Do not show |
| Flatten | Do not walk any blob |
| Extensions | Security Yes; Resiliency Yes (DR N/A); PBT Partial |

### Supply order (first win)

1. `node.data.propertiesSchema` (copied from palette on drop)
2. Optional `provideWorkflowBuilderUi({ properties })` adapter: given node → schema (or none)
3. Built-in Condition / Decision / Repeater schemas
4. Otherwise General only

---

## 3. Functional requirements

### FR-HP-01 — Generic schema types

Add a new domain file (not Enso-named) for host properties schema:

- `sections[]` with `fields[]`
- Field: `type` (`text` \| `number` \| `boolean` \| `select` \| `multiselect` \| `textarea`), `path`, `label`, `required`, `hidden`, `options`, `placeholder`
- Optional `ui_component` string is allowed but not a live custom renderer in this increment (see FR-HP-07)

Public types SHALL NOT use Enso names (`ensoTask`, skillconfig, x_config, PlatformApi, configurations, Xpms).

### FR-HP-02 — Resolve schema (first win)

`wb-right-sidebar` SHALL resolve configuration fields in the locked supply order. A present `propertiesSchema` object wins even if every field is skipped as invalid (then Configuration is empty; General still shows). Do not fall through to logic built-ins in that case.

### FR-HP-03 — Palette and factory copy

Extend `PaletteItem` and `createWorkflowNodeFromPaletteItem` so that on drop:

- optional `propertiesSchema` copies onto `node.data.propertiesSchema`
- optional `taskMeta` copies onto `node.data.taskMeta` (not `ensoTask`)
- optional `metadata` continues to copy onto `node.data.metadata`

Opaque blobs SHALL NOT be interpreted.

### FR-HP-04 — Render and save

When a resolved host or built-in schema has visible fields:

- Render sections + fields with the existing reactive forms + `getAtPath` / `setAtPath` on `node.data`
- `hidden: true` fields are not shown
- Required fields block Save (existing validators)
- Save still `patchNode`; view mode still disables the form

### FR-HP-05 — Logic built-in fallback

When no host schema and no adapter schema: keep current Condition / Decision / Repeater configuration fields (Condition expression; Repeater workflow/version/pause; Router empty configuration). Do not break Condition true/false edges or Router connector conditions. Chrome flags and `[palettes]` stay unchanged.

### FR-HP-06 — General only when no schema

Action / Trigger / Delay / End / Notification / AIAgent (and any non-logic type) with no host schema: General only (label, subtitle, status). SHALL NOT show Ignore Keys. SHALL NOT flatten `taskMeta` or leftover `ensoTask`.

### FR-HP-07 — Unknown widget safe

If a field has `ui_component` that is not a built-in control for its `type`, show disabled text (or skip); never crash; never special-case Enso widget ids. Do **not** add a live `ui_component` → Angular component registry in this increment (Q4=B).

### FR-HP-08 — Stop flatten path

Stop using `collectEnsoTaskFields` for the Properties form. Do not treat `ensoTask` as a form source. Existing nodes with `data.ensoTask` keep the key unused.

### FR-HP-09 — Invalid schema fields

Skip fields with unknown `type`, empty `path`, or `..` (or equivalent unsafe path). Render remaining fields. Never crash.

### FR-HP-10 — Docs

Update `docs/workflow-builder-ui-embed.md` for `propertiesSchema` on palette items and `provideWorkflowBuilderUi({ properties })`. Same tone as `[palettes]` / catalog. No Enso field names in the public API or examples. No secrets in examples.

---

## 4. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-HP-01 Security | Do not interpret host blobs; skip unsafe paths (`..`); do not render unknown widgets as HTML; no Enso credentials or Enso field names in public API/docs |
| NFR-HP-02 Resiliency | Invalid field → skip (fail-safe); unknown widget → disabled text; adapter absence → next source; DR N/A (SPA increment) |
| NFR-HP-03 PBT Partial | Invariants: skip-invalid; paths never write via `..`; resolved schema first-win; `taskMeta` is not walked into fields |

---

## 5. Out of scope

- Live custom widget registry (`ui_component` → Angular component)
- Instance `[properties]` input on the embed
- Migrating leftover `data.ensoTask` → `taskMeta`
- Enso HTTP, x_config, skillconfig, configurations, PlatformApi widgets
- ng-packagr, document I/O outputs, 100vh changes
- Changing chrome flags, `[palettes]`, Condition true/false edges, Router connector conditions

---

## 6. Success criteria

- Host schema on a dropped node renders sections/fields; Save writes `node.data` at each `path`
- Omit schema on Condition / Router / Repeater → current logic built-ins
- Action with `taskMeta` blob → General only; blob not flattened
- Unknown `ui_component` → disabled text (or skip); no crash
- `npm test` / `npm run build` green
