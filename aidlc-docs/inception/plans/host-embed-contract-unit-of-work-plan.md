# Unit of Work Plan — Host embed contract

**Role**: Units Planner  
**Status**: STAGE GENERATED — awaiting approval  
**Locked**: Q1=A · Q2=A · Q3=A · Q4=A  
**Application Design**: SKIP (execution plan Q1=A)  
**Execution plan**: Q1=A — **1 unit U-HE-01**; skip FD/NFR/Infra; then CG → Build/Test  
**Stories**: US-HE-01..04  

Plan locked. Unit artifacts generated. Awaiting approval to enter CONSTRUCTION.

**Category notes**
- Story grouping / business domain: Q1  
- Dependencies: single unit (Q1=A) — no inter-unit protocol; Q2 covers construction sequence  
- Team: Q4  
- Technical / deploy: same Angular SPA (Q3)  
- Code organization: brownfield paths (Q3); not greenfield multi-unit  

Additive files after approval: `host-embed-contract-unit-of-work*.md`

---

## Proposed unit

| Unit | Stories | Owns |
|---|---|---|
| **U-HE-01** | US-HE-01..04 | `loadDocument` / `getDocument` / dirty; `[document]` / `(documentChange)`; persist.save / persist.run first-win vs defaults; shell `height: 100%`; embed docs |

Construction (recommended, matches execution plan): skip Functional Design and NFR/Infra; Code Generation → Build and Test.

**Internal order (recommended)**  
1. Facade load/get/dirty + invalid load fail-safe (FR-HE-01..03)  
2. Shell `[document]` / `(documentChange)` (FR-HE-04)  
3. persist.save / persist.run + Save/Run dispatch (FR-HE-05..07)  
4. Shell height 100%; embed docs (FR-HE-08, FR-HE-09)  
5. Specs + serialize/parse PBT if touched  

---

## Execution checklist (Part 2 — after plan approval)

- [x] Generate `host-embed-contract-unit-of-work.md`
- [x] Generate `host-embed-contract-unit-of-work-dependency.md`
- [x] Generate `host-embed-contract-unit-of-work-story-map.md`
- [x] Document brownfield code organization
- [x] Validate all US-HE-01..04 assigned

---

## Question 1

**Story grouping / domain boundary**

A) **Recommended** — All US-HE-01..04 in **U-HE-01** (one construction module: host embed contract)

B) Split into 2 units (document I/O vs Save/Run + height + docs)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Construction stages / dependencies**

A) **Recommended** — Per execution plan: skip Functional Design and NFR/Infra; Code Generation → Build/Test. Single-unit sequence; no inter-unit API.

B) Add Functional Design before Code Generation (same 1 unit)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Code organization (brownfield, same SPA)**

A) **Recommended** — Change in place: `workflow.facade.ts`; `provide-workflow-builder-ui.ts` (`persist?: { save; run }`); `shell-layout.component.ts` (`[document]`, `(documentChange)`, `(save)`, `(run)`, height 100%); `agent-skills-shell.component.ts` (height 100%); serialize/parse as needed; `docs/workflow-builder-ui-embed.md`. No new Angular project. Do not commit `src/app/try/` unless you ask.

B) Extract persist/document I/O into a new `core/embed-contract/` folder this increment

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Team / ownership**

A) **Recommended** — Same stream owns U-HE-01 end-to-end (no split ownership)

B) Split ownership (describe after [Answer]:)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
