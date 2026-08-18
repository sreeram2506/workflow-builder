# Components — Generic host-driven Properties

**Additive to** existing Properties panel and `provideWorkflowBuilderUi`.  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  
**Unit**: U-HP-01 (types + factory + adapter + sidebar + docs)

---

## Component catalog (changed)

| ID | Name | Layer | Role |
|---|---|---|---|
| C-HP-TYPE | `host-properties.schema.ts` | core/domain | Generic `HostPropertiesSchema` (`sections` / `fields`); sanitize skip-invalid; built-in Condition / Decision / Repeater as these types. Not Enso-named. |
| C-HP-RES | `resolveHostPropertiesSchema` | core/domain | Pure first-win: node schema → adapter → logic built-ins → `null` |
| C-HP-ADP | `provideWorkflowBuilderUi({ properties })` | core/ui-config | Optional sync `schemaFor(node)`; injection token; no instance input |
| C-HP-PAL | `PaletteItem` + `node.factory` | core/domain | Copy `propertiesSchema` and `taskMeta` (not `ensoTask`); `metadata` unchanged |
| C-HP-SIDE | `wb-right-sidebar` | features/shell | Render resolved schema; Save `setAtPath` on `node.data`; General always; no Ignore Keys; no flatten |
| C-HP-FLAT | `enso-task-form.ts` | core/domain | Stop flatten; delete `collectEnsoTaskFields` usage; keep/move coerce helpers only if still needed |
| C-HP-OLD | `properties.schema.ts` | core/domain | Drop Ignore Keys / host-facing `XpmsFieldDescriptor`; keep General helpers (`NODE_STATUS_OPTIONS`, `controlKeyForPath`) |
| C-HP-DOCS | Embed docs | docs | Schema + adapter; no Enso field names |

No new Angular injectable (Q2=A).

---

## Responsibilities

### C-HP-TYPE (Q1=A)

- Public types: sections with fields (`type`, `path`, `label`, `required`, `hidden`, `options`, `placeholder`, optional `ui_component`).
- Field types: `text` | `number` | `boolean` | `select` | `multiselect` | `textarea`.
- `sanitizeHostPropertiesSchema`: drop unknown type, empty path, `..` (or equivalent); keep valid rest; never throw.
- Logic built-ins expressed as `HostPropertiesSchema` (Condition expression; Repeater workflow/version/pause; Router empty sections).
- Public API MUST NOT use `ensoTask`, skillconfig, x_config, PlatformApi, configurations, Xpms.

### C-HP-RES (Q2=A)

- Input: `WorkflowNode`, optional adapter (`schemaFor` or null).
- If `node.data.propertiesSchema` is a present object → sanitize and **win** (even if all fields skipped).
- Else if adapter returns a schema → sanitize and use.
- Else if node type is Condition / Decision / Repeater → built-in schema.
- Else → `null` (General only).

### C-HP-ADP (Q3=A)

- `ProvideWorkflowBuilderUiOptions.properties?: { schemaFor(node): HostPropertiesSchema | null }`
- Token injected like catalog; **sync** (not Observable).
- Omit provider → adapter is absent (next source in first-win).

### C-HP-PAL

- `PaletteItem.propertiesSchema?: HostPropertiesSchema`
- On drop: copy schema to `node.data.propertiesSchema`; copy `taskMeta` to `node.data.taskMeta`; do not write `ensoTask`.
- Opaque blobs uninterpreted.

### C-HP-SIDE (Q5=A)

- General always (label, subtitle, status).
- If resolved schema has visible fields: render sections; `hidden` omitted; required blocks Save; view mode disables.
- Unknown `ui_component` (not a built-in control for `type`) → disabled text with current value; never crash; never special-case Enso ids.
- Paths read/write relative to `node.data`.
- Save still `patchNode`.

### C-HP-FLAT (Q4=A)

- Sidebar MUST NOT call `collectEnsoTaskFields`.
- Leftover `data.ensoTask` unused.
- Delete flatten module if nothing remains; otherwise keep only coerce/display next to the new schema file.

### C-HP-DOCS

- Document palette `propertiesSchema`, adapter `schemaFor`, first-win, paths on `node.data`, General always, opaque `taskMeta`.
- No Enso names or secrets in examples.

---

## Out of scope

- Live `ui_component` → Angular component registry
- Instance `[properties]` input
- Migrating `ensoTask` → `taskMeta`
- Enso HTTP / PlatformApi widgets
- ng-packagr, document I/O, 100vh
- Breaking chrome, `[palettes]`, Condition edges, Router connectors
