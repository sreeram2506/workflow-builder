# User Stories — Dynamic Properties

**Breakdown**: Hybrid — feature stories with host and author AC  
**Granularity**: Standard (5 stories)  
**AC style**: Gherkin  
**Personas**: P-HOST, P-AUTHOR, P-REVIEWER (`personas.md`)  
**Requirements**: `dynamic-properties-requirements.md` FR-DP-01..09  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  

**Locked policies**
- Values for host/dynamic fields live in `node.data.properties: Record<string, unknown>`
- Schema metadata from palette `propertiesSchema` / `provideWorkflowBuilderUi({ properties })`; paths bind relative to the properties map
- Remaining map keys use Dynamic Property + inference (no reserved-key filter inside the map)
- General always above; Condition / Router / Repeater built-ins always; colliding dynamic keys omitted (built-in wins)
- `propertiesPanel.addProperty` default `false`; when true, author can add a key
- Save via `patchNode` / document only — no new propertiesChange output
- No Enso-specific names in public API/docs; no live custom widget registry

---

## Persona ↔ Story Mapping

| Story | P-HOST | P-AUTHOR | P-REVIEWER |
|---|---|---|---|
| US-DP-01 Bind schema values to `properties`; Save | ● | ● | ● |
| US-DP-02 Dynamic Property + inference for remaining keys | ● | ● | ○ |
| US-DP-03 Built-ins + omit colliding dynamic keys | ○ | ● | ○ |
| US-DP-04 Add property chrome flag | ● | ● | ○ |
| US-DP-05 Embed docs + try host | ● | ○ | ○ |

● = primary · ○ = secondary / sees result

---

## Traceability FR ↔ US

| FR | Stories |
|---|---|
| FR-DP-01 Properties value map | US-DP-01 |
| FR-DP-02 Dynamic Property component | US-DP-02 |
| FR-DP-03 Inference | US-DP-02 |
| FR-DP-04 Schema + remaining keys | US-DP-01, US-DP-02 |
| FR-DP-05 Built-ins + dynamic | US-DP-03 |
| FR-DP-06 Add property (chrome-gated) | US-DP-04 |
| FR-DP-07 Save / write-back | US-DP-01 |
| FR-DP-08 Vendor neutrality | US-DP-05 |
| FR-DP-09 Docs and try host | US-DP-05 |
| NFR-DP-01 Security | US-DP-01, US-DP-02, US-DP-05 |
| NFR-DP-02 Resiliency | US-DP-01, US-DP-02 |
| NFR-DP-03 PBT Partial | US-DP-01, US-DP-02, US-DP-03 |
| NFR-DP-04 Compatibility | US-DP-01, US-DP-05 |
| NFR-DP-05 UX | US-DP-01 |

---

## INVEST check

| Story | I | N | V | E | S | T |
|---|---|---|---|---|---|---|
| US-DP-01 | ● | ● | ● | ● | ● | ● |
| US-DP-02 | ● | ● | ● | ● | ● | ● |
| US-DP-03 | ● | ● | ● | ● | ● | ● |
| US-DP-04 | ● | ● | ● | ● | ● | ● |
| US-DP-05 | ● | ● | ● | ● | ● | ● |

Independent enough in table order. Negotiable AC. Valuable to host and author. Estimable. Small. Testable via Gherkin.

---

## US-DP-01 — Schema fields bind to `node.data.properties`; Save via `patchNode`

**As a** Host Integrator  
**I want** host schema fields to read and write `node.data.properties`  
**So that** authors configure known keys without the library hardcoding property names  

**FR**: FR-DP-01, FR-DP-04, FR-DP-07, NFR-DP-01, NFR-DP-02, NFR-DP-04, NFR-DP-05 · **Persona**: P-HOST, P-AUTHOR, P-REVIEWER  

**Acceptance criteria**
```text
Given a selected node with propertiesSchema defining a visible text field path "timeout"
And node.data.properties.timeout is "30"
When Properties opens
Then the timeout control shows "30"
And General (label, subtitle, status) remains visible above configuration
```
```text
Given the author changes the timeout control to "60" and Saves
When patchNode completes
Then node.data.properties.timeout is "60"
And no new shell propertiesChange output is required for the host to observe the document
```
```text
Given node.data.properties is missing
When the author Saves a schema field value
Then node.data.properties is created as a map containing that key
```
```text
Given view / read-only mode
When a reviewer selects a node with host schema bound to properties
Then the Properties form is disabled (no Save)
```

---

## US-DP-02 — Remaining keys use Dynamic Property + inference

**As a** Workflow Author  
**I want** extra keys in `node.data.properties` to appear with inferred controls  
**So that** the host can introduce new properties without a library release  

**FR**: FR-DP-02, FR-DP-03, FR-DP-04, NFR-DP-01, NFR-DP-02, NFR-DP-03 · **Persona**: P-AUTHOR, P-HOST  

**Acceptance criteria**
```text
Given a node whose propertiesSchema covers path "timeout"
And node.data.properties also has keys "timeout", "retryCount" (number 3), and "enabled" (boolean true)
When Properties opens
Then timeout renders once via schema (not duplicated as inferred)
And retryCount renders as a number control via Dynamic Property
And enabled renders as a boolean control via Dynamic Property
```
```text
Given node.data.properties.notes is undefined or null (or the key is present with empty string)
When Properties renders notes without schema metadata
Then a text control is shown (empty)
```
```text
Given node.data.properties.payload is a nested object
When Properties renders payload without schema metadata
Then a read-only JSON textarea is shown
And the author cannot edit it through that control
```
```text
Given several keys in node.data.properties
When Properties lists inferred keys
Then the library does not hide keys via a built-in reserved-key filter inside the map
And property labels/values are not rendered as raw HTML
```

---

## US-DP-03 — Built-ins always; colliding dynamic keys omitted

**As a** Workflow Author  
**I want** Condition / Router / Repeater built-in configuration to remain  
**So that** logic nodes stay usable while host dynamic keys appear additionally  

**FR**: FR-DP-05, NFR-DP-03 · **Persona**: P-AUTHOR  

**Acceptance criteria**
```text
Given a selected Condition node with built-in expression configuration
And node.data.properties also contains an unrelated key "tag" = "vip"
When Properties opens
Then built-in Condition fields still show
And tag appears in the dynamic/host section below
And General remains above
```
```text
Given a Condition (or Router / Repeater) built-in field identity "condition" (or equivalent built-in path id)
And node.data.properties.condition also exists
When Properties opens
Then the built-in field is shown
And properties.condition is omitted from the dynamic list (built-in wins)
```

---

## US-DP-04 — Add property when chrome flag is on

**As a** Host Integrator  
**I want** `propertiesPanel.addProperty` (default false)  
**So that** authors only add keys when my product enables that chrome  

**FR**: FR-DP-06 · **Persona**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```text
Given propertiesPanel.addProperty is false or omitted (default)
When an author opens Properties for a node
Then there is no Add property control
And existing keys remain editable per other stories
```
```text
Given propertiesPanel.addProperty is true via provideWorkflowBuilderUi / UI chrome merge
When the author adds a new key "customFlag" with an initial value and Saves
Then node.data.properties.customFlag holds that value
```

---

## US-DP-05 — Embed docs and try host (vendor-neutral)

**As a** Host Integrator  
**I want** embed docs and a try-host example for the properties map contract  
**So that** other teams adopt dynamic properties without Enso-specific naming  

**FR**: FR-DP-08, FR-DP-09, NFR-DP-01, NFR-DP-04 · **Persona**: P-HOST  

**Acceptance criteria**
```text
Given docs/workflow-builder-ui-embed.md
When a host reads the Properties / dynamic properties sections
Then they see node.data.properties as the value map
And they see schema paths bind relative to that map
And they see inference rules and propertiesPanel.addProperty
And they see that hosts must migrate off top-level node.data schema value paths
And public examples do not use Enso field names
And examples contain no access tokens
```
```text
Given the try / demo host
When a host opens the demo
Then at least one example shows schema fields plus extra dynamic keys in properties
And optionally demonstrates addProperty when the flag is on
```
