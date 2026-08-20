# U-DP-01 — Change Request Questions (Round 7)

You selected **Request Changes** while Round 6 was partially applied. Answer below so we can adjust before finishing / re-approval.

**Already in the tree from Round 6 (not fully closed out):**
- Library defaults for **all** node types (`host-properties.library.ts`) — Action / AIAgent specialized; others share `note` + `enabled: true`
- Per-card `useLibraryProperties` (omit/`true` = on; `false` = opt out)
- Try-host samples: Library Default Action / Opt-Out Action / Library Default Trigger
- Specs updated for the above; docs bullet for `useLibraryProperties` may still be incomplete

---

## Question 1
What still needs to change?

A) Revert / narrow Round 6 (e.g. library defaults only for Action + AIAgent again) — describe after [Answer]:

B) Wrong default fields (shared `note` / `enabled`, or Action / AIAgent set) — list desired fields after [Answer]:

C) `useLibraryProperties` wrong (naming, default, or should be a global UI flag instead) — describe after [Answer]:

D) Unrelated UI / Properties / try-host issue — describe after [Answer]:

E) Finish Round 6 as-is (docs + tests green) — no further product change

X) Other (please describe after [Answer]: tag below)

[Answer]: For each node type, including Agents and other configurable nodes, the workflow builder should support a set of default properties that are automatically available when the node is created, with each default property being enabled (true) by default. These default properties should be defined and controlled through the application/package configuration, so the consuming application can explicitly set a property to true or false depending on whether it wants that property to be available for that node type. When a property is configured as true, it should appear in the node’s Properties panel by default and be stored under node.data.properties; when configured as false, it should not be available or shown for that node. The consuming application should also have the ability to add additional custom properties beyond the predefined defaults and remove/disable properties it does not want to expose. The important distinction is that the workflow builder provides a predefined set of default properties for each supported node type, all enabled by default, while the consuming application has full configuration control to enable, disable, add, or remove properties without requiring changes to the workflow builder’s core implementation.

## Question 2
Where are you checking?

A) `/try-ui` with Catalog **Host properties**

B) `/try-ui` with a different Catalog preset

C) Full SPA `/`

D) Embedded host outside this repo

E) Code / docs review only (not running UI)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3
Severity / scope?

A) Small fix (copy, one sample, docs)

B) Behavior change in library / opt-out / schema binding

C) Broader redesign / revert Round 6

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Clarification needed (2026-08-20)

Q1 describes per-property enable/disable + host-controlled catalog (broader than Round 6).  
See: `u-dp-01-try-host-properties-change-request-questions-r7-clarification.md`

## Resolution (2026-08-20 Round 7)

Applied clarification answers: global `propertiesDefaults` + card `libraryProperties`; removed `useLibraryProperties`; drop-time merge; new drops only for `false`.
