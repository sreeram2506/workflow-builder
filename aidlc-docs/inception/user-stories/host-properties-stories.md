# User Stories — Generic host-driven Properties

**Breakdown**: Hybrid — feature stories with host and author AC  
**Granularity**: Standard (4 stories)  
**AC style**: Gherkin  
**Personas**: P-HOST, P-AUTHOR, P-REVIEWER (`personas.md`)  
**Requirements**: `host-properties-requirements.md` FR-HP-01..10  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  

**Locked policies**
- Package renders schema and writes `node.data`; host owns product-specific meaning
- Supply order (first win): `node.data.propertiesSchema` → `provideWorkflowBuilderUi({ properties })` → Condition / Decision / Repeater built-ins → General only
- Field `path` is relative to `node.data` (host may use `taskMeta.foo`)
- `palette.taskMeta` copies to `node.data.taskMeta`; leftover `data.ensoTask` unused (no migrate, no flatten)
- Skip invalid fields; schema object still wins (no fall-through)
- Built-in field types only; unknown `ui_component` → disabled text; no live widget map
- General (label / subtitle / status) always visible
- No Ignore Keys mock; do not flatten any blob
- No Enso field names in the public embed API
- Chrome flags, `[palettes]`, Condition true/false edges, Router connector conditions unchanged

---

## Persona ↔ Story Mapping

| Story | P-HOST | P-AUTHOR | P-REVIEWER |
|---|---|---|---|
| US-HP-01 Schema copy, render, Save to path | ● | ● | ● |
| US-HP-02 Supply order; General only; no Ignore Keys | ● | ● | ○ |
| US-HP-03 Opaque blobs not flattened; unknown widget safe | ● | ● | ○ |
| US-HP-04 Embed docs: schema + properties adapter | ● | ○ | ○ |

● = primary · ○ = secondary / sees result

---

## Traceability FR ↔ US

| FR | Stories |
|---|---|
| FR-HP-01 Generic schema types | US-HP-01 |
| FR-HP-02 Resolve schema (first win) | US-HP-02 |
| FR-HP-03 Palette and factory copy | US-HP-01 |
| FR-HP-04 Render and save | US-HP-01 |
| FR-HP-05 Logic built-in fallback | US-HP-02 |
| FR-HP-06 General only when no schema | US-HP-02 |
| FR-HP-07 Unknown widget safe | US-HP-03 |
| FR-HP-08 Stop flatten path | US-HP-03 |
| FR-HP-09 Invalid schema fields | US-HP-01 |
| FR-HP-10 Docs | US-HP-04 |
| NFR-HP-01 Security (no blob walk; skip `..`; no Enso names in API) | US-HP-01, US-HP-03, US-HP-04 |
| NFR-HP-02 Resiliency (skip-invalid; adapter absence → next source) | US-HP-01, US-HP-02 |
| NFR-HP-03 PBT Partial (skip-invalid; first-win; no-walk) | US-HP-01, US-HP-02, US-HP-03 |

---

## INVEST check

| Story | I | N | V | E | S | T |
|---|---|---|---|---|---|---|
| US-HP-01 | ● | ● | ● | ● | ● | ● |
| US-HP-02 | ● | ● | ● | ● | ● | ● |
| US-HP-03 | ● | ● | ● | ● | ● | ● |
| US-HP-04 | ● | ● | ● | ● | ● | ● |

Independent enough to implement in that order (copy/render → supply order → no-flatten → docs). Negotiable AC. Valuable to host and author. Estimable as one unit or four slices. Small. Testable via Gherkin.

---

## US-HP-01 — Host schema copies on drop; Properties renders and Save writes paths

**As a** Host Integrator  
**I want** optional `propertiesSchema` on a palette item copied onto the dropped node and rendered in Properties  
**So that** authors edit generic fields and Save writes `node.data` at each `path`  

**FR**: FR-HP-01, FR-HP-03, FR-HP-04, FR-HP-09, NFR-HP-01, NFR-HP-02, NFR-HP-03 · **Persona**: P-HOST, P-AUTHOR, P-REVIEWER  

**Acceptance criteria**
```text
Given a palette item with propertiesSchema (sections and fields: text, number, boolean, select, multiselect, textarea)
When the author drops that item
Then node.data.propertiesSchema is a copy of that schema
And optional taskMeta copies to node.data.taskMeta (not ensoTask)
And optional metadata still copies to node.data.metadata
```
```text
Given a selected node whose data.propertiesSchema has a visible text field path "timeout"
When the author edits the field and Saves
Then node.data.timeout is the saved value
And General (label, subtitle, status) remains visible above the host sections
```
```text
Given a field with hidden true
When Properties renders the node
Then that field is not shown
```
```text
Given a required visible field that is empty
When the author tries to Save
Then Save is blocked
```
```text
Given a host schema field with unknown type, empty path, or ".." in the path, and another valid field
When Properties renders
Then invalid fields are skipped
And valid fields still render
And the panel does not crash
```
```text
Given view / read-only mode
When a reviewer selects a node with host schema
Then the Properties form is disabled (no Save)
```

---

## US-HP-02 — Supply order: adapter, logic built-ins, General only

**As a** Host Integrator  
**I want** schema resolution to follow first-win order without Ignore Keys  
**So that** authors see adapter fields, logic built-ins, or General only — never a mock flatten  

**FR**: FR-HP-02, FR-HP-05, FR-HP-06, NFR-HP-02, NFR-HP-03 · **Persona**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```text
Given node.data.propertiesSchema is present
And provideWorkflowBuilderUi({ properties }) also returns a schema
When Properties opens
Then the node schema is used (adapter is not used)
```
```text
Given the node has no propertiesSchema
And provideWorkflowBuilderUi({ properties }) schemaFor(node) returns a schema
When Properties opens
Then adapter fields render
And General remains visible
```
```text
Given no node schema and no adapter schema
And the selected node is Condition, Decision (Router), or Repeater
When Properties opens
Then the current built-in configuration fields show (Condition expression; Repeater workflow/version/pause; Router empty configuration)
And Condition true/false edges still work
And Router connector conditions still work
And chrome flags and [palettes] are unchanged
```
```text
Given no node schema and no adapter schema
And the selected node is Action, Trigger, Delay, End, Notification, or AIAgent
When Properties opens
Then only General (label, subtitle, status) is shown
And Ignore Keys is not shown
```
```text
Given node.data.propertiesSchema is present
And every field is invalid and skipped
When Properties opens
Then Configuration is empty
And General still shows
And logic built-ins do not appear (schema still wins)
```

---

## US-HP-03 — Opaque blobs are not flattened; unknown widget is safe

**As a** Workflow Author  
**I want** Properties not to invent fields from `taskMeta` or leftover `ensoTask`  
**So that** a host blob stays opaque and unknown widgets cannot crash the panel  

**FR**: FR-HP-07, FR-HP-08, NFR-HP-01, NFR-HP-03 · **Persona**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```text
Given an Action (or other non-logic node) with no propertiesSchema and no adapter schema
And node.data.taskMeta is a nested object with several keys
When Properties opens
Then collectEnsoTaskFields is not used
And the blob is not walked into form fields
And only General is shown
```
```text
Given a node that still has data.ensoTask from an older drop
When Properties opens
Then ensoTask is not a form source
And the key is left unused (not migrated)
```
```text
Given a visible field whose ui_component is not a built-in control for its type
When Properties renders
Then the field is disabled text (or skipped)
And the panel does not crash
And Enso widget ids are not special-cased
```
```text
Given this increment
When a host looks for a live ui_component to Angular component map
Then that registry is not part of the public API
```

---

## US-HP-04 — Embed docs: properties schema and adapter

**As a** Host Integrator  
**I want** embed docs for `propertiesSchema` and `provideWorkflowBuilderUi({ properties })`  
**So that** other teams supply forms the same way they supply `[palettes]` / catalog  

**FR**: FR-HP-10, NFR-HP-01 · **Persona**: P-HOST  

**Acceptance criteria**
```text
Given docs/workflow-builder-ui-embed.md
When a host reads Properties / schema sections
Then they see how to put propertiesSchema on a palette item (copied on drop)
And they see provideWorkflowBuilderUi({ properties }) schemaFor(node)
And they see first-win order and General always visible
And they see paths are relative to node.data
And public API and examples do not use Enso field names (ensoTask, skillconfig, x_config, PlatformApi, configurations)
And examples contain no access tokens
```
