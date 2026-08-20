# Components — Dynamic Properties

**Additive to** U-HP-01 host Properties.  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  
**Unit**: U-DP-01 (helpers + Dynamic Property + sidebar + chrome + docs/try)

---

## Component catalog (changed)

| ID | Name | Layer | Role |
|---|---|---|---|
| C-DP-HELP | `host-properties.dynamic.ts` (name illustrative) | core/domain | Pure: ensure/read properties map; infer control type; remaining keys; built-in collision omit |
| C-DP-DYN | `dynamic-property.component.ts` | features/shell | Render one property (metadata or inferred); emit value changes to parent form |
| C-DP-CHR | `PropertiesPanelFeatures.addProperty` | core/ui-config | Chrome flag default `false`; normalize/merge with existing UI features |
| C-DP-SIDE | `wb-right-sidebar` | features/shell | Bind schema fields to `node.data.properties`; list remaining via C-DP-DYN; Save merge properties; Add-property UX when flag on |
| C-DP-RES | `resolveHostPropertiesSchema` | core/domain | Unchanged first-win for **metadata**; consumers read/write values via map helpers |
| C-DP-FAC | Facade `patchNode` | core/facade | Existing; sidebar merges `{ data: { properties } }` on Save |
| C-DP-DOCS | Embed docs + try host | docs / try | Contract + demo |

No new Angular injectable service (Q1=A, Q5=A).

---

## Responsibilities

### C-DP-HELP (Q1=A)

- `getPropertiesMap(data)` → `Record<string, unknown>` (missing → treat as `{}`)
- `inferControlKind(value)` → text | number | boolean | readonlyJson
- `listRemainingPropertyKeys(map, schemaFieldPaths, builtInIds)` → keys not in schema and not colliding with built-ins
- Never throw on malformed map; coerce safely

### C-DP-DYN (Q2=A)

- Inputs: key, value, optional field metadata, disabled
- Renders text / number / boolean / read-only JSON per inference or metadata type
- Does not execute host HTML/JS; unknown widget → disabled text (U-HP-01)

### C-DP-CHR (Q4 context)

- `propertiesPanel.addProperty: boolean` default `false`
- When true, sidebar shows minimal Add UX (key + value text + Add)

### C-DP-SIDE (Q3=A, Q4=A)

- Section order: General → logic built-ins (if applicable) → host schema fields → remaining dynamic keys → optional Add row
- Schema field paths relative to `properties` map
- Save: build properties object from form; `patchNode` merge into `data.properties`
- View mode: disable edits / hide Add

### C-DP-DOCS

- Document map binding, inference, addProperty, migration off top-level paths
- Try host: schema + extra keys; optional addProperty demo
