# Unit of Work Plan — Host logic extras + agent metadata

**Role**: Units Planner  
**Status**: GENERATION COMPLETE — AWAITING STAGE APPROVAL  
**Locked**: Q1=A · Q2=A · Q3=A · Q4=A  
**Application Design**: Approved (Q1–Q5=A)  
**Execution plan**: Q1=A — **1 unit U-LIM-01**  
**Stories**: US-LIM-01..04  

Fill every `[Answer]:`, then reply in chat (for example `answered`). Unit artifacts will not be generated until this plan is approved.

**Category notes**
- Story grouping / domain: Q1  
- Dependencies: single unit (Q1=A) — no inter-unit protocol  
- Team: Q4  
- Technical / deploy: same Angular SPA (Q3)  
- Code organization: brownfield paths (Q3); not greenfield multi-unit  

Additive files: `logic-icons-metadata-unit-of-work*.md`

---

## Proposed unit

| Unit | Stories | Owns |
|---|---|---|
| **U-LIM-01** | US-LIM-01..04 | `icon-url.ts`, host sanitizers, `featuredLogicItems`, catalog compose omit, sidebar icons, factory `data.metadata`, embed docs |

Construction (recommended): Functional Design → Code Generation → Build and Test. Skip NFR/Infra per execution plan.

---

## Execution checklist (Part 2 — after plan approval)

- [x] Generate `logic-icons-metadata-unit-of-work.md`
- [x] Generate `logic-icons-metadata-unit-of-work-dependency.md`
- [x] Generate `logic-icons-metadata-unit-of-work-story-map.md`
- [x] Document brownfield code organization
- [x] Validate all US-LIM-01..04 assigned

---

## Question 1 — Story grouping

A) **Recommended** — All US-LIM-01..04 in **U-LIM-01** (one construction module)

B) Split into 2 units (sanitizers/types vs sidebar/docs)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2 — Construction stages

A) **Recommended** — Per execution plan: FD → Code Gen → Build/Test; skip NFR/Infra

B) Skip Functional Design (go straight to Code Generation)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3 — Code organization

A) **Recommended** — `core/domain/icon-url.ts` + extend `palette-host.helpers`, `palette.catalog` types, `ui-features.types` / `merge-ui-features`, `enso-task-catalog.service`, `left-sidebar`, `node.factory`; docs in `docs/workflow-builder-ui-embed.md`; try host gitignored

B) New `core/domain/palette-host/` folder for sanitizers + featured helper + icon-url

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4 — Team / ownership

A) **Recommended** — Same stream owns U-LIM-01 end-to-end (no split ownership)

B) Split ownership (describe after [Answer]:)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
