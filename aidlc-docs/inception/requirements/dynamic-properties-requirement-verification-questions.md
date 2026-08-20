# Requirements Verification — Dynamic Properties

**Increment**: Dynamic Properties  
**Baseline**: U-HP-01 host-driven Properties (`docs/workflow-builder-ui-embed.md`)  
Fill each `[Answer]:`, then reply in chat (e.g. `answered`).

---

## Question 1 — Where do dynamic key-value properties live on a node?

A) Entire `node.data` is walked as the dynamic map (excluding reserved keys we define)

B) A dedicated map under `node.data.properties` (or similar) only — rest of `data` stays opaque

C) Host-supplied map via adapter only (not stored on the node until Save)

X) Other (please describe after [Answer]: tag below)

[Answer]:B  The Properties Panel should support dynamic node properties through configuration provided by the consuming application. The properties displayed in the panel are the properties of the selected node, but their definitions, such as property label, control type, options, default value, and other UI configuration, can be passed from the application using the Workflow Builder package. The library should not hardcode application-specific property definitions. It should use the provided configuration to render the appropriate UI controls for the node's properties, similar to how agents and palettes are provided as configuration to the Workflow Builder. The approach should also allow new properties or properties with different keys to be introduced by the consuming application without requiring changes to the library.

---

## Question 2 — How does this relate to existing `propertiesSchema` (U-HP-01)?

A) **Extend**: schema metadata still preferred for known paths; remaining dynamic keys get inferred controls

B) **Replace**: stop using section/field schemas; only dynamic KVs + optional per-key metadata

C) **Parallel**: schema-driven Configuration section unchanged; add a separate “Dynamic” section for extra keys

X) Other (please describe after [Answer]: tag below)

[Answer]:A i want to keep some predefined set of keys an if user wants to pass any properties keys , data and components , we have to allow him by handling dynamic similar to default agents and palettes.

---

## Question 3 — Reserved keys (never shown as editable dynamic fields)

A) Exclude a fixed set: `propertiesSchema`, `taskMeta`, `paletteKey`, `iconUrl`, `iconPath`, `metadata`, skills/agent internals

B) Exclude only what the host marks as reserved via adapter config

C) Exclude nothing — host must not put non-editable keys in the dynamic map

X) Other (please describe after [Answer]: tag below)

[Answer]: we can show both no need to exclude anything

---

## Question 4 — Inference when a key has no metadata

A) Infer from runtime value: string→text, number→number, boolean→toggle; other types→read-only JSON textarea

B) Same as A, plus empty/undefined → text box

C) Unknown / non-primitive → skip field (do not show)

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 5 — Adding new keys at runtime in the Properties UI

A) Not in this increment — host/API only adds keys; UI edits existing keys

B) Yes — “Add property” control (key + value) in Properties

C) Yes — but only when host enables a chrome/flag

X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 6 — General section (label / subtitle / status)

A) Always keep General above dynamic/host configuration (current behavior)

B) Fold label/subtitle/status into the dynamic map if present; no separate General

C) Host can hide General via UI chrome flag

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7 — Condition / Router / Repeater built-in configuration

A) Keep first-win: built-ins when no host schema / no dynamic map content

B) Built-ins always apply for those types; dynamic keys are additional

C) Dynamic / host always wins; built-ins only if host opts in

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 8 — How the consuming app supplies metadata / config

A) Palette `propertiesSchema` + existing `provideWorkflowBuilderUi({ properties })` only (extend types as needed)

B) Also allow a new adapter, e.g. `provideWorkflowBuilderUi({ properties: { metadataFor, … } })` for per-key metadata without full schema sections

C) Instance input on the shell (in addition to provider) — e.g. `[propertiesConfig]`

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 9 — Change events to the consuming application

A) Rely on existing graph/document updates (`patchNode`); host observes facade/document — no new output

B) Add an explicit output/event (e.g. `propertiesChange`) with node id + changed paths/values

C) Both: patchNode + optional output when host subscribes

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 10 — Highest-priority slice for first delivery (Q3=B)

A) Read-only dynamic render (infer + metadata) first; Save/write-back in a follow-up pause

B) Full edit + Save write-back to `node.data` in one unit (minimal Dynamic Property component)

C) Full edit + Save + host change event/output in one unit

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 11 — Security Extensions

Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)

B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 12 — Resiliency Extensions

Should the resiliency baseline be applied to this project?

A) Yes — apply as directional best practices and design-time guidance

B) No — skip the resiliency baseline

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 13 — Property-Based Testing Extension

Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints

B) Partial — enforce PBT rules only for pure functions and serialization round-trips

C) No — skip all PBT rules

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Optional freeform

```text

```
