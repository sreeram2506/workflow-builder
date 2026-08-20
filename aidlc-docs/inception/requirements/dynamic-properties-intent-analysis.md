# Intent Analysis — Dynamic Properties

| Field | Value |
|---|---|
| **User request** | Dynamic property configuration and rendering (static + fully dynamic); Dynamic Property component; host-supplied config; no Enso-specific names |
| **Source** | More Changes R62 freeform (Q1=B Properties; Q2=C Full AI-DLC; Q3=B highest first) |
| **Request type** | Enhancement (brownfield) — extends U-HP-01 host-driven Properties |
| **Clarity** | Clear intent; several design ambiguities (data shape, precedence, inference, General/built-ins) |
| **Scope estimate** | Multiple components (domain types, resolve, right-sidebar, new Dynamic Property component, embed docs, try host) |
| **Complexity** | Moderate–Complex |
| **Requirements depth** | Standard → Comprehensive on schema/resolve |
| **Increment name** | Dynamic Properties |

## Baseline already in tree (U-HP-01)

- `HostPropertiesSchema` with sections/fields (`text` \| `number` \| `boolean` \| `select` \| `multiselect` \| `textarea`)
- First-win: `node.data.propertiesSchema` → `provideWorkflowBuilderUi({ properties })` → logic built-ins → General only
- Opaque `taskMeta`; no flatten; unknown `ui_component` → disabled text
- Deferred previously: live custom widget registry, instance `[properties]` input

## What this increment adds (requested)

- Iterate **dynamic** key-value properties on the selected node (`Record<string, unknown>`)
- Optional metadata for known keys; **infer UI from value type** when metadata missing
- New **Dynamic Property** component; keep existing Properties shell
- Host config from UI/code or API (host-side); library stays vendor-neutral
- Two-way binding: edits → node + consuming application
