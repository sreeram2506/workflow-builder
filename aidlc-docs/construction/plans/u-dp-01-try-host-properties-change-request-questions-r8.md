# U-DP-01 — Change Request Questions (Round 8)

You selected **Request Changes** after Round 7 (global `propertiesDefaults` + card `libraryProperties`; package defaults in `host-properties.library.ts`). Answer below so we can update before re-approval.

**Current expected behavior**
- Package field definitions: `src/app/core/domain/host-properties.library.ts`
- Global enable/disable: `provideWorkflowBuilderUi({ propertiesDefaults: { Action: { timeout: false } } })`
- Per card: `libraryProperties: { timeout: false }` on palette / default-agent rows
- Custom fields: card `propertiesSchema` / `properties` or shell `[properties]`
- `/try-ui` → Catalog **Host properties** samples: Library Default Action, Library Timeout Off, Library Default Trigger

---

## Question 1
What still needs to change?

A) Where / how to configure defaults is unclear or wrong API — describe after [Answer]:

B) Wrong package default fields (paths, types, or which node types) — list desired set after [Answer]:

C) Enable/disable (`propertiesDefaults` / `libraryProperties`) behavior wrong — describe after [Answer]:

D) Try-host sample / docs only

E) Unrelated UI / Properties panel issue — describe after [Answer]:

X) Other (please describe after [Answer]: tag below)

[Answer]: The workflow builder must provide only name and description as built-in default properties for every node type. All other node properties must be supplied by the consuming application through configuration; the workflow builder must not maintain predefined property sets such as note, timeout, owner, paused, or enabled. Additional properties should be configurable individually using true/false, with configured properties enabled by default when no explicit value is provided. The host application should be able to globally configure these properties and optionally override them for individual palette/default-agent cards. Existing useLibraryProperties all-or-nothing behavior should be removed in favor of per-property configuration. Existing nodes must not be modified or have their stored properties removed when configuration changes; enable/disable configuration should primarily control properties available on newly created nodes.And remove all the properties that are set for now and keep only name and description

## Question 2
Where are you checking?

A) `/try-ui` with Catalog **Host properties**

B) `/try-ui` with a different Catalog preset

C) Full SPA `/`

D) Embedded host outside this repo

E) Code / docs review only

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3
Severity / scope?

A) Small fix (copy, one sample, docs)

B) Behavior bug in library / schema / enable maps

C) Broader redesign

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Resolution (2026-08-20 Round 8)

1. Package library defaults are **only** `name` + `description` for every node type (removed note/timeout/owner/paused/enabled).
2. Host supplies all other properties via `propertiesSchema` / `properties` / `[properties]`.
3. Per-path enable remains: global `propertiesDefaults` + card `libraryProperties` (new drops only).
