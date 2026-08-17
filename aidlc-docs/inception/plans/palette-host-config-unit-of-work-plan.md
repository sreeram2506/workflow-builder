# Unit of Work Plan — Palette / catalog host config (v1)

**Role**: Units Planner  
**Status**: APPROVED — GENERATION COMPLETE  
**Application Design**: Approved (Q1=A · Q2=C · Q3=A · Q4=A · Q5=A)  
**Proposed units** (from App Design / Execution Plan): **U-PAL-01** → **U-PAL-02**  
**Locked plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A

Unit artifacts generated; awaiting unit approval.

Additive artifacts will use prefix `palette-host-config-` under `aidlc-docs/inception/application-design/`.

---

## Execution checklist (after plan approval)

- [x] Generate `palette-host-config-unit-of-work.md`
- [x] Generate `palette-host-config-unit-of-work-dependency.md`
- [x] Generate `palette-host-config-unit-of-work-story-map.md`
- [x] Document brownfield code organization in unit-of-work.md
- [x] Validate unit boundaries and dependencies
- [x] Ensure all stories US-PAL-01..07 are assigned

---

## Proposed split (confirm in Q1)

| Unit | Stories | Owns |
|---|---|---|
| **U-PAL-01** Palette config core | US-PAL-01, US-PAL-02, US-PAL-03, US-PAL-04 | `palette` types, merge presence, allow-list filter, `resolveDefaultAgents`, PBT |
| **U-PAL-02** Catalog wiring + docs | US-PAL-05, US-PAL-06, US-PAL-07 | Adapter tokens, Enso default, no mocks, sidebar strip/0..N defaults, embed examples |

---

## Question 1

**Story grouping** — How should US-PAL-01..07 map to units?

A) **Recommended** — U-PAL-01: US-PAL-01..04 (merge, allow-lists, defaultAgents helpers); U-PAL-02: US-PAL-05..07 (adapter, failure/no mocks, docs). Sidebar **rendering** of filtered types and default cards stays in U-PAL-02.

B) Put all seven stories in one combined unit

C) Move US-PAL-04 into U-PAL-02 (helpers + sidebar cards together); U-PAL-01 is merge + allow-list only

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 2

**Dependencies / sequencing**

A) **Strict** — U-PAL-02 Construction starts only after U-PAL-01 Build and Test is approved

B) **Soft** — U-PAL-02 may start Functional Design after U-PAL-01 Code Gen lands; one combined Build and Test at the end

C) Single Build and Test after both units’ Code Generation (no per-unit B&T gate)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 3

**Team / ownership**

A) **Same owner** for both units (one stream, sequential)

B) Split ownership — config core vs catalog/sidebar (still sequential merge order)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 4

**Technical / construction stages per unit**

A) **Per execution plan** — each unit: Functional Design → Code Generation; skip NFR Requirements/Design and Infrastructure Design; Build and Test after each unit (or as Q2 dictates)

B) Skip Functional Design; go straight to Code Generation plans

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 5

**Business / product boundary**

A) Keep increment as **palette allow-lists, defaultAgents, catalog adapter** — no publishable ng library, no skills-side `defaultAgents`, no workflow document schema change

B) Expand U-PAL-02 to add skills-side `defaultAgents` (was out of scope for v1)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 6

**Code organization (brownfield SPA)**

A) **Recommended** — extend `src/app/core/ui-config/` (palette types, merge, catalog tokens, `provideWorkflowBuilderUi`); pure helpers next to `palette.catalog.ts` (or a sibling domain file); catalog orchestration in `EnsoTaskCatalogService`; sidebar in `left-sidebar.component.ts`; docs under `docs/`; examples under `src/assets/examples/`

B) New `src/app/core/palette-config/` folder instead of extending `ui-config`

C) Keep helpers inside `ui-config/` only (not `core/domain`)

X) Other (please describe after [Answer]: tag below)

[Answer]:A
