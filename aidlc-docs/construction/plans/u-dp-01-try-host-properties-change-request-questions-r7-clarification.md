# U-DP-01 — Round 7 Clarification Questions

Your Q1 answer describes a **configurable default-properties catalog** (per node type, each default on/`true` unless the host turns it off; host can add/remove). That is broader than Round 6’s card-level `useLibraryProperties`. We need the config surface and field inventory before coding.

**Your Q1 (summary):** Package defines defaults per node type (all enabled by default). Host config enables/disables each default (`true`/`false`). Enabled → shown in Properties + stored in `node.data.properties`. Host can add custom properties and disable/remove unwanted ones without changing WB core.

---

## Question 1
Where should the host **enable/disable** each library default property?

A) Global UI/package config — e.g. `provideWorkflowBuilderUi` / JSON under something like `propertiesDefaults: { Action: { note: true, timeout: false } }`

B) Per palette / default-agent **card** — e.g. `libraryProperties: { note: true, timeout: false }` on the row (alongside optional `propertiesSchema`)

C) Both: global defaults, optional per-card override

X) Other (please describe after [Answer]: tag below)

[Answer]: c  Use both global defaults and optional per-card override.

The package should define the default property set for each node type, with all properties enabled by default. The host application should be able to configure these globally, for example through provideWorkflowBuilderUi, using a configuration such as propertiesDefaults: { Action: { note: true, timeout: false } }. A palette/default-agent card may optionally override the global configuration when a specific node needs different behavior. This gives the host application centralized configuration while still allowing individual cards to customize their property availability.

## Question 2
What happens to Round 6’s card flag `useLibraryProperties`?

A) Keep it (all-or-nothing opt-out) **in addition to** per-property true/false

B) Replace it with per-property enable/disable only (remove `useLibraryProperties`)

C) Keep `useLibraryProperties` only; reinterpret “true/false” as that flag (no per-property toggles)

X) Other (please describe after [Answer]: tag below)

[Answer]: B

Replace useLibraryProperties with per-property enable/disable configuration and remove useLibraryProperties.

The previous all-or-nothing useLibraryProperties flag is no longer necessary because each library property can now independently be enabled or disabled. For example, an Agent can have owner: true, paused: false, and note: true. This provides more granular control and avoids having two configuration mechanisms that could conflict with each other.

## Question 3
How should the host **add custom** properties (beyond package defaults)?

A) Existing card `propertiesSchema` / `properties` (and optional `[properties]` input) — already works; no new API

B) New config list under the same `propertiesDefaults` (or similar) registry

C) Both A and B

X) Other (please describe after [Answer]: tag below)

[Answer]: A

Use the existing card propertiesSchema / properties and optional [properties] input for custom properties; no new API is required.

The package's predefined properties and the host application's custom properties should work together. The library provides its default properties, while the consuming application can use the existing propertiesSchema/properties mechanism to add additional properties specific to its application or node. There is no need to introduce another custom-property registry unless a future requirement specifically requires one.

## Question 4
What is the **predefined default field set** in the package?

A) Keep current Round 6 sets — Action: `note`, `timeout`; AIAgent: `owner`, `paused`; other types: `note`, `enabled`

B) One shared set for **all** types — list field paths + types after [Answer]:

C) Different set per type — paste a short table (type → fields) after [Answer]:

X) Other (please describe after [Answer]: tag below)

[Answer]: C

Use a different predefined default set per node type:

Action: note, timeout
AIAgent: owner, paused
Other node types: note, enabled

All predefined properties should be enabled (true) by default. The host application can then explicitly set individual properties to false when it does not want them exposed for a particular node type/card.

## Question 5
When a host sets a default property to **`false`**, what should happen for nodes already dropped with that key in `node.data.properties`?

A) Hide from Properties panel only (value may remain in data until Save/cleared)

B) Hide and omit from future Saves / strip from working map when opening Properties

C) Leave existing nodes unchanged; `false` only affects **new** drops

X) Other (please describe after [Answer]: tag below)

[Answer]: C

Leave existing nodes unchanged; false only affects new drops.

If a host changes a default property from true to false, that configuration should affect newly created/dropped nodes only. Existing nodes that already contain the property in node.data.properties should retain their existing data and behavior. This avoids unexpectedly modifying or deleting user-created workflow data simply because the host application's default configuration changed later. The property can be hidden or unavailable for newly created nodes, while existing node data remains intact.

---

## Resolution (2026-08-20 Round 7)

1. Removed `useLibraryProperties`; per-path enable via global `propertiesDefaults` + card `libraryProperties`.
2. Package defaults: Action `note`/`timeout`; AIAgent `owner`/`paused`; others `note`/`enabled` (all on by default).
3. Drop merges enabled library + card `propertiesSchema`/`properties` (host wins same path).
4. Enable-map changes affect **new** drops only (existing snapshots preserved).
5. Custom add still via card schema / `[properties]` (no new registry).
