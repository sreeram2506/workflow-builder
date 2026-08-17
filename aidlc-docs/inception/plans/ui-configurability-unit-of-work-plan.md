# Unit of Work Plan — UI Configurability (v1)

**Role**: Units Planner  
**Status**: APPROVED — GENERATION COMPLETE  
**Application Design**: Approved (Q1=A · Q2=C · Q3=A · Q4=C · Q5=A)  
**Proposed units** (from App Design / Execution Plan): **U-UI-01** → **U-UI-02**  
**Locked plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A

---

## Execution checklist

- [x] Generate `ui-configurability-unit-of-work.md`
- [x] Generate `ui-configurability-unit-of-work-dependency.md`
- [x] Generate `ui-configurability-unit-of-work-story-map.md`
- [x] Document brownfield code organization in unit-of-work.md
- [x] Validate unit boundaries and dependencies
- [x] Ensure all stories US-UI-01..08 are assigned

---

## Question 1 — Story grouping

How should stories map to the two units?

A) **Recommended** — U-UI-01: US-UI-01 + US-UI-07 (config provide/merge/defaults + load status); U-UI-02: US-UI-02..06 + US-UI-08 (chrome gates, overlays, tabs, view-mode) + embed docs (FR-UI-10)

B) Put all stories in one combined unit (override two-unit plan)

C) U-UI-01 owns merge only (no status UI); U-UI-02 owns everything user-visible including load-status banner

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 2 — Dependencies / sequencing

A) **Strict** — U-UI-02 Construction starts only after U-UI-01 Build and Test approved

B) **Soft** — U-UI-02 may start FD in parallel after U-UI-01 Code Gen lands; Build/Test can be combined at end

C) Single Build and Test after both units’ Code Gen

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 3 — Team / ownership

A) **Same owner** for both units (sequential delivery by one stream)

B) Split ownership — config core vs chrome (still sequential merge order)

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 4 — Technical / construction stages per unit

A) **Per execution plan** — each unit: Functional Design → Code Generation; skip NFR Requirements/Design and Infrastructure Design; Build and Test after each unit (or as Q2 dictates)

B) Skip Functional Design; go straight to Code Generation plans

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 5 — Business / product boundary

A) Keep increment boundary as **chrome configurability only** (no workflow document schema, no Enso API) — confirm units stay inside that boundary

B) Expand U-UI-02 to include a minimal in-app flag preview panel (was out of scope)

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 6 — Code organization (brownfield)

A) **Recommended** — new `src/app/core/ui-config/` (types, merge, service, provider, initializer); chrome edits in existing `features/shell|agent|canvas|theme`; demo JSON under `public/` or `src/assets/`; embed doc under `docs/` (or `aidlc-docs` pointer)

B) Place config under `core/services/` without a dedicated folder

C) Place config under `features/shell/ui-config/`

X) Other (describe after [Answer]:)

[Answer]: A
