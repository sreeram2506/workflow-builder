# U-DP-01 — Round 6 Clarification Questions

Your Round 6 Q1 answer is ambiguous. We need to pin down **what** “true/false”, **add/remove**, and **default true** mean before changing code.

**Your Q1 text:**
> i want to set some default Properties for agents and other nodes but they can be configurable by setting true or false if user wants or if he wants he can add and remove but by default they should be set to true

Today:
- Library defaults live in `host-properties.library.ts` (Action, AIAgent only)
- Host can override via palette/`[properties]` schema
- Users can add extra keys only when `propertiesPanel.addProperty: true` (default is **false**)

---

## Question 1
What should the **true/false** control?

A) A host/UI flag that turns **library default Properties** on/off (default **on** / `true`)

B) Default **boolean fields** inside Properties (e.g. `enabled`, `paused`) whose seed value is **`true`**

C) Both A and B

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2
If there is a flag (Q1 A or C), where should hosts set it?

A) `ui.propertiesPanel.libraryDefaults` (or similar) on `[ui]` / JSON — default `true`

B) On each palette / default-agent card (e.g. `useLibraryProperties: false` to opt out)

C) Both: global default `true`, per-card override optional

D) No flag — always apply library defaults when host omits schema (current behavior), just expand the defaults

X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 3
What does **add and remove** mean?

A) End-user in Properties: turn on `addProperty` by default (`true`) so they can add/remove dynamic keys

B) Host author: can add/remove fields in their own `propertiesSchema` / `properties` (already works; no code change)

C) End-user: remove individual **library default** fields from a node (hide/delete from that instance)

X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 4
Which types need **library default Properties** (beyond today’s Action / AIAgent)?

A) Keep Action + AIAgent only; just change seeds / flag behavior

B) All droppable node types that can show Properties (Action, AIAgent, Trigger, …) — list extras after [Answer]:

C) Agents only (AIAgent + default-agent cards without schema)

D) Nodes only (Action and similar), not agents

X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 5
What should the **default field set** be? (schema + seed values)

A) Keep current Action (`note`, `timeout`) and AIAgent (`owner`, `paused: false`) — only change flag / addProperty behavior

B) Change boolean seeds to `true` (e.g. AIAgent `paused: true` or add `enabled: true`) — list exact fields after [Answer]:

C) Replace with a shared minimal set for all covered types — describe fields after [Answer]:

X) Other (please describe after [Answer]: tag below)

[Answer]: default means if any node is created we have the list of  properties that we need to set them if no properties configured by user in their application
