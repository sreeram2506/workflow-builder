# Intent Analysis — Generic host-driven Properties

| Field | Value |
|---|---|
| **User request** | Generic host-driven Properties (not Enso-specific) |
| **Request type** | Enhancement (brownfield) |
| **Scope** | Schema types, palette/node copy, properties adapter, right-sidebar render, stop flattening `ensoTask`, embed docs |
| **Complexity** | Moderate |
| **Requirements depth** | Standard |
| **Clarity after Q1–Q9** | Clear — no contradictions |
| **Answers** | Q1=A · Q2=A · Q3=A · Q4=B · Q5=A · Q6=A · Q7=A · Q8=A · Q9=B |

## Locked decisions

| ID | Decision |
|---|---|
| Q1 | `taskMeta` on drop; leftover `ensoTask` unused |
| Q2 | Field paths relative to `node.data` |
| Q3 | Skip invalid fields; render rest; schema still wins |
| Q4 | Built-in field types only; unknown `ui_component` → disabled text; no live widget map |
| Q5 | Palette `propertiesSchema` + `provideWorkflowBuilderUi({ properties })`; no instance input |
| Q6 | General always visible |
| Q7 | Security Baseline **Yes** |
| Q8 | Resiliency Baseline **Yes** (directional; DR N/A) |
| Q9 | PBT **Partial** |

## Known surfaces (at analysis time)

| Surface | What it is today |
|---|---|
| Properties UI | `wb-right-sidebar` only |
| Flatten path | If `node.data.ensoTask` exists, `collectEnsoTaskFields` walks the blob (`enso-task-form.ts`) |
| Built-in schemas | `NODE_TYPE_SCHEMAS` — Ignore Keys mock on non-logic types; Condition / Router / Repeater built-ins |
| Palette drop | `PaletteItem.taskMeta` copied to `data.ensoTask`; extras `metadata` / icons already copy |
| Host DI | `provideWorkflowBuilderUi({ features, catalog })` — no properties adapter |
| Out of scope (stated) | Enso HTTP, x_config, skillconfig, configurations, PlatformApi widgets, ng-packagr, document I/O, 100vh |

## Locked from the request (not re-asked)

- Package renders schema and writes `node.data`; host owns Enso-shaped meaning
- Supply order: `node.data.propertiesSchema` → optional adapter → logic built-ins → General only
- Do not show Ignore Keys mock; do not flatten any blob
- Opaque `taskMeta` / `metadata` uninterpreted
- Unknown widget: skip or disabled text; never crash; never special-case Enso types
- Do not break chrome flags, `[palettes]`, Condition true/false edges, Router connector conditions
- Public embed API has no Enso field names
