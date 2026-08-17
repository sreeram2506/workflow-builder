# Application Design Plan — Palette / catalog host config (v1)

**Role**: Application Architect  
**Status**: APPROVED  
**Requirements**: `palette-host-config-requirements.md`  
**Stories**: `palette-host-config-stories.md`  
**Execution plan**: Approved Q1=A (2 units; App Design + Units; skip NFR/Infra)

**Locked answers**: Q1=A · Q2=C · Q3=A · Q4=A · Q5=A

Design artifacts generated; awaiting design approval.

Additive artifacts will use prefix `palette-host-config-` under `aidlc-docs/inception/application-design/`.

---

## Execution checklist (after plan approval)

- [x] Generate `palette-host-config-components.md`
- [x] Generate `palette-host-config-component-methods.md`
- [x] Generate `palette-host-config-services.md`
- [x] Generate `palette-host-config-component-dependency.md`
- [x] Generate `palette-host-config-application-design.md` (summary)
- [x] Validate design completeness

---

## Proposed component set

| ID | Name | Role |
|---|---|---|
| C-PAL-CFG | Extend `UiConfigService` / merge | `palette.solution.types`, `palette.agent.types`, `defaultAgents` |
| C-PAL-FILTER | Pure allow-list + defaultAgents helpers | Filter rows; omitted vs `[]` vs present |
| C-PAL-ADAPT | Catalog adapter tokens / provider | Host replaces Enso per canvas |
| C-PAL-CAT | `EnsoTaskCatalogService` | Default adapter; apply filter; no mocks on failure |
| C-PAL-LEFT | `LeftSidebarComponent` | Featured strip + lists from filtered catalog |
| C-PAL-DOCS | Embed/try docs + example JSON | Allow-list, defaultAgents, provider-only adapters |

**Units (recommended)**: U-PAL-01 C-PAL-CFG + C-PAL-FILTER; U-PAL-02 C-PAL-ADAPT + C-PAL-CAT + C-PAL-LEFT + C-PAL-DOCS.

---

## Question 1

**Where does palette config live?**

A) Extend existing `UiConfigService` and `merge-ui-features` (`palette.*` on the same resolved tree as chrome)

B) New `PaletteConfigService` beside ui-config (separate JSON key tree loaded the same way)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 2

**How does a host inject catalog adapters?**

A) Optional Angular injection tokens (omit = Enso default)

B) Callbacks on `provideWorkflowBuilderUi({ catalog: { solution, agent } })` only

C) Provider helper that sets the tokens (hosts use `provideWorkflowBuilderUi`; tokens exist for tests)

X) Other (please describe after [Answer]: tag below)

[Answer]:C

---

## Question 3

**Who applies the allow-list filter?**

A) Pure domain helper; catalog service applies it before the sidebar sees items

B) Sidebar only (catalog still emits the full Enso/static list)

C) Catalog applies filter; sidebar also filters as a safety net

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 4

**Unit boundary**

A) Keep **U-PAL-01** (config + filter + defaultAgents) then **U-PAL-02** (adapter, sidebar, failure, docs)

B) Single combined unit

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 5

**defaultAgents → palette rows**

A) Pure helper builds `PaletteItem[]` (`type: AIAgent`); catalog/sidebar consume that list

B) `LeftSidebarComponent` maps config cards to items itself

X) Other (please describe after [Answer]: tag below)

[Answer]:A
