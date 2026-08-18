# Unit of Work Plan — Remove APIs and dummy data

**Role**: Units Planner  
**Status**: STAGE APPROVED — CONSTRUCTION FD OPEN  
**Locked**: Q1=A · Q2=A · Q3=A · Q4=A  
**Application Design**: Approved (Q1–Q5=A)  
**Execution plan**: Q1=A — **1 unit U-RAD-01**  
**Stories**: US-RAD-01..04  

Fill every `[Answer]:`, then reply in chat (for example `answered`). Unit artifacts will not be generated until this plan is approved.

**Category notes**
- Story grouping / business domain: Q1  
- Dependencies: single unit (Q1=A) — no inter-unit protocol; Q2 covers construction sequence  
- Team: Q4  
- Technical / deploy: same Angular SPA (Q3)  
- Code organization: brownfield paths (Q3); not greenfield multi-unit  

Additive files: `remove-apis-dummy-data-unit-of-work*.md`

---

## Proposed unit

| Unit | Stories | Owns |
|---|---|---|
| **U-RAD-01** | US-RAD-01..04 | Strip Enso HTTP/env/proxy; omit-without-adapter = empty-remote; convert nested library to `[palettes]`; delete `MOCK_SKILLS` and repeater mocks; embed/README |

Construction (recommended): Functional Design → Code Generation → Build and Test. Skip NFR/Infra per execution plan.

**Internal order (recommended)**  
1. Env + proxy + catalog HTTP/mappers out  
2. Omit-without-adapter empty-remote (+ specs/PBT)  
3. Nested palettes conversion + MOCK_SKILLS delete  
4. Repeater mock delete + empty pickers  
5. Docs + remaining tests  

---

## Execution checklist (Part 2 — after plan approval)

- [x] Generate `remove-apis-dummy-data-unit-of-work.md`
- [x] Generate `remove-apis-dummy-data-unit-of-work-dependency.md`
- [x] Generate `remove-apis-dummy-data-unit-of-work-story-map.md`
- [x] Document brownfield code organization
- [x] Validate all US-RAD-01..04 assigned

---

## Question 1

**Story grouping / domain boundary**

A) **Recommended** — All US-RAD-01..04 in **U-RAD-01** (one construction module: catalog HTTP gone + dummy catalogs gone)

B) Split into 2 units (catalog HTTP/empty omit vs nested+repeater+docs)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 2

**Construction stages / dependencies**

A) **Recommended** — Per execution plan: Functional Design → Code Generation → Build/Test; skip NFR/Infra. Single-unit sequence; no inter-unit API.

B) Skip Functional Design (go straight to Code Generation)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 3

**Code organization (brownfield, same SPA)**

A) **Recommended** — Change in place: `enso-task-catalog.service.ts`, `environment.ts` / `environment.prod.ts`, `proxy.conf.json`, delete Enso pipeline/task mapper files, `nested-skills-library.component.ts`, `workflow.facade.ts`, delete `mock-skills.catalog.ts` and `repeater-mock.catalog.ts`, `properties.schema.ts`, `right-sidebar.component.ts`, `docs/workflow-builder-ui-embed.md`, `README.md`. No new Angular project or `core/data/catalog/` folder.

B) Move remaining catalog compose into a new `core/data/palette-catalog/` folder in this increment

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 4

**Team / ownership**

A) **Recommended** — Same stream owns U-RAD-01 end-to-end (no split ownership)

B) Split ownership (describe after [Answer]:)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---
