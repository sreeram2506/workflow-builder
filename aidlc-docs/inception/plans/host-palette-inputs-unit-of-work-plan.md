# Unit of Work Plan — Host palette inputs (Syncfusion-style)

**Role**: Units Planner  
**Status**: APPROVED — GENERATION COMPLETE  
**Locked**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A  
**Application Design**: Approved  
**Proposed units** (from App Design Q5=A / Execution Plan Q1=A): **one unit U-HPI-01**  

Fill `[Answer]:` for each question, then reply in chat. Unit artifacts are not generated until this plan is approved.

Additive artifacts will use prefix `host-palette-inputs-` under `aidlc-docs/inception/application-design/`.

---

## Execution checklist (after plan approval)

- [x] Generate `host-palette-inputs-unit-of-work.md`
- [x] Generate `host-palette-inputs-unit-of-work-dependency.md`
- [x] Generate `host-palette-inputs-unit-of-work-story-map.md`
- [x] Document brownfield code organization in unit-of-work.md
- [x] Validate unit boundaries and dependencies
- [x] Ensure all stories US-HPI-01..06 are assigned

---

## Proposed split (confirm in Q1)

| Unit | Stories | Owns |
|---|---|---|
| **U-HPI-01** Host palette inputs | US-HPI-01..06 | Shell/skills `[palettes]`, solution `[defaultAgents]`, catalog overlay (present wins over provider/Enso), unknown-type drop, embed docs |

**Depends on**: U-PAL-02 COMPLETE (catalog adapter, empty-remote, featured strip, `resolveDefaultAgents`).

---

## Question 1

**Story grouping** — How should US-HPI-01..06 map to units?

A) **Recommended** — Keep **one unit U-HPI-01** with all six stories (shells + catalog overlay + unknown-type drop + docs), matching App Design Q5=A

B) Split docs (US-HPI-06) into a second unit after U-HPI-01

C) Split catalog overlay (US-HPI-04, US-HPI-05) from shell inputs (US-HPI-01..03)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Dependencies / sequencing**

A) **Recommended** — Single unit. Construction is FD → Code Generation → Build and Test. Depends on live U-PAL-02 catalog/sidebar (already in this SPA). No second unit to sequence.

B) Add a gate: U-HPI-01 Functional Design starts only after a re-run of U-PAL-02 Build and Test

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Team / ownership**

A) **Recommended** — Same owner / one stream for U-HPI-01 (shells, catalog, docs)

B) Split ownership — shells vs catalog overlay vs docs (still one merge order)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Technical / construction stages**

A) **Per execution plan** — Functional Design → Code Generation; skip NFR Requirements/Design and Infrastructure Design; Build and Test after the unit; Security/PBT/fail-open in FD/CG

B) Skip Functional Design; go straight to Code Generation plans

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Business / product boundary**

A) Keep increment as **parent `[palettes]` / `[defaultAgents]` on existing shells** — no new Stream canvas node, no `wb-workflow-builder` wrapper, no skills `[defaultAgents]`, no workflow document schema change

B) Expand the unit to add a first-class Stream `NodeType` and factory

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6

**Code organization (brownfield SPA)**

A) **Recommended** — extend `shell-layout.component.ts` and `agent-skills-shell.component.ts` with `input()`; pass overlay through `left-sidebar.component.ts` into `EnsoTaskCatalogService.loadCatalog`; drop unknown types in catalog compose; update `docs/workflow-builder-ui-embed.md`. No new Angular project.

B) New `src/app/core/host-palette/` service instead of extending `EnsoTaskCatalogService`

C) Put overlay detection only on the shells and skip left-sidebar pass-through (would require changing catalog `providedIn: 'root'` — conflicts with App Design Q1=A)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
