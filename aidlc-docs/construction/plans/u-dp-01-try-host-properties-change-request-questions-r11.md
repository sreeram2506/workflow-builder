# Change Request Round 11 — XPMS `x_config` → Properties

API payload shape (`basic_config` / `adv_config`) cannot be placed as a single key inside unified `properties` — every entry must be `{ type, label, value?, … }`. We will add a mapper from XPMS config rows → host properties. Please answer:

## Question 1
Where should the mapped field **path** (storage key under `node.data.properties`) come from?

A) Use full `config_path` as-is (e.g. `config.data.configuration.retrain`)

B) Strip a fixed prefix `config.` and keep the rest (e.g. `data.configuration.retrain`)

C) Use only the last segment of `config_path` (e.g. `retrain`)

D) Other (please describe after [Answer]: tag below)

[Answer]: D

The consumer application (Try-UI) should provide a converter that transforms its own configuration format into the generic property schema expected by the Workflow Builder. The converter should handle the difference between the consumer application's field keys/paths and the Workflow Builder's property schema keys, including mapping the appropriate storage path under node.data.properties. The Workflow Builder package should not contain consumer-specific mapping logic or make assumptions about Try-UI's configuration structure.

## Question 2
How should **Basic** vs **Advanced** groups appear in the Properties panel?

A) Two sections: `Basic` (from `basic_config`) and `Advanced` (from `adv_config`)

B) One section titled `Configuration` (flat list, basic first then advanced)

C) Only show `basic_config` for now; ignore `adv_config`

D) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 3
When API row has `"hidden": true`, what should Properties do?

A) Omit the field entirely (`enabled: false`) — not shown, not seeded in schema

B) Keep in schema with `hidden: true` (package may still omit from visible UI)

C) Other (please describe after [Answer]: tag below)

[Answer]: default false use converter

## Question 4
Where should this mapper live?

A) Package core export (e.g. `mapXpmsXConfigToProperties(x_config)`) for any host to call

B) Try-host / consumer only — package stays unaware of XPMS shapes

C) Auto-detect: if palette `properties.x_config` (or card `x_config`) is present, package expands it

D) Other (please describe after [Answer]: tag below)

[Answer]:B

The mapper should live in the consumer application (Try-UI). The Workflow Builder package should remain configuration-agnostic and should only consume the normalized property schema provided by the consumer. This allows any consuming application—not just Try-UI—to define its own configuration format and provide a converter to the Workflow Builder's generic property schema.

So the architecture is:

Consumer Application (Try-UI)
Consumer Config → Converter → Workflow Builder Property Schema

Workflow Builder Package
Property Schema → Properties Panel → node.data.properties

This is better because if another application uses Workflow Builder later, it can have a completely different configuration structure and implement its own converter, without requiring changes to the Workflow Builder package.

## Question 5
Type mapping defaults — confirm or override:

| API | Proposed control |
| --- | --- |
| `data_type: "boolean"` | `boolean` (toggle switch) |
| `data_type: "integer"` / `"number"` | `number` |
| `data_type: "string"` + `op_type: "categorical"` + `options` | `select` (or `multiselect` if `multi_select: true`) |
| `data_type: "string"` + `multi_select: true` (no options) | `text` (single-line textbox) |
| `data_type: "string"` otherwise | `text` |

A) Accept table as-is

B) For `multi_select: true` without options, use `text` instead of `textarea`

C) Other (please describe after [Answer]: tag below)

[Answer]:A

Accept the proposed type mapping as-is. The converter in the consumer application (Try-UI) should map the consumer configuration's data_type, op_type, options, and multi_select values to the corresponding Workflow Builder property control. Boolean values should render as toggles, integer/number values as number inputs, categorical strings with options as select or multiselect based on multi_select, strings with multi_select: true but without options as textarea for free-form multi-value input, and all other strings as standard text inputs.
