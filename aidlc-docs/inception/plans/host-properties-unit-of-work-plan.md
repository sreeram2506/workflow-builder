# Unit of Work Plan — Generic host-driven Properties

**Role**: Units Planner  
**Status**: STAGE APPROVED — FD PLAN OPEN  
**Locked**: Q1=A · Q2=A · Q3=A · Q4=A  
**Application Design**: Approved (Q1–Q5=A)  
**Execution plan**: Q1=A — **1 unit U-HP-01**  
**Stories**: US-HP-01..04  

Fill every `[Answer]:`, then reply in chat (for example `answered`). Unit artifacts will not be generated until this plan is approved.

**Category notes**
- Story grouping / business domain: Q1  
- Dependencies: single unit (Q1=A) — no inter-unit protocol; Q2 covers construction sequence  
- Team: Q4  
- Technical / deploy: same Angular SPA (Q3)  
- Code organization: brownfield paths (Q3); not greenfield multi-unit  

Additive files: `host-properties-unit-of-work*.md`

---

## Proposed unit

| Unit | Stories | Owns |
|---|---|---|
| **U-HP-01** | US-HP-01..04 | Generic schema types + sanitize; factory copy; properties adapter; first-win resolve; right-sidebar render/save; stop flatten; embed docs |

Construction (recommended): Functional Design → Code Generation → Build and Test. Skip NFR/Infra per execution plan.

**Internal order (recommended)**  
1. Types + sanitize (`host-properties.schema.ts`)  
2. Factory copy (`propertiesSchema`, `taskMeta`)  
3. Adapter token + `resolveHostPropertiesSchema`  
4. Right-sidebar first-win render/save; no Ignore Keys; unknown widget disabled  
5. Delete flatten usage  
6. Docs + specs / PBT  

---

## Execution checklist (Part 2 — after plan approval)

- [x] Generate `host-properties-unit-of-work.md`
- [x] Generate `host-properties-unit-of-work-dependency.md`
- [x] Generate `host-properties-unit-of-work-story-map.md`
- [x] Document brownfield code organization
- [x] Validate all US-HP-01..04 assigned

---

## Question 1

**Story grouping / domain boundary**

A) **Recommended** — All US-HP-01..04 in **U-HP-01** (one construction module: host Properties contract)

B) Split into 2 units (schema+render vs adapter+docs)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Construction stages / dependencies**

A) **Recommended** — Per execution plan: Functional Design → Code Generation → Build/Test; skip NFR/Infra. Single-unit sequence; no inter-unit API.

B) Skip Functional Design (go straight to Code Generation)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Code organization (brownfield, same SPA)**

A) **Recommended** — Change in place: add `host-properties.schema.ts` (+ resolve helper); extend `palette.catalog.ts`, `node.factory.ts`, `provide-workflow-builder-ui.ts`, `right-sidebar.component.ts`; trim `properties.schema.ts` / `enso-task-form.ts`; update `docs/workflow-builder-ui-embed.md`. No new Angular project.

B) Put schema + resolver under a new `core/properties/` folder in this increment

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Team / ownership**

A) **Recommended** — Same stream owns U-HP-01 end-to-end (no split ownership)

B) Split ownership (describe after [Answer]:)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
