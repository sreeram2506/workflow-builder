# Unit of Work Plan — Dynamic Properties

**Role**: Units Planner  
**Status**: STAGE APPROVED — FD PLAN OPEN  
**Locked**: Q1=A · Q2=A · Q3=A · Q4=A  
**Application Design**: Approved (Q1–Q5=A)  
**Execution plan**: Q1=A — **1 unit U-DP-01**  
**Stories**: US-DP-01..05  

Unit artifacts approved. CONSTRUCTION Functional Design plan open.

**Category notes**
- Story grouping / business domain: Q1  
- Dependencies: single unit (Q1=A) — no inter-unit protocol; Q2 covers construction sequence  
- Team: Q4  
- Technical / deploy: same Angular SPA (Q3)  
- Code organization: brownfield paths (Q3); not greenfield multi-unit  

Additive files: `dynamic-properties-unit-of-work*.md`

---

## Proposed unit

| Unit | Stories | Owns |
|---|---|---|
| **U-DP-01** | US-DP-01..05 | Dynamic helpers; Dynamic Property component; `propertiesPanel.addProperty`; sidebar bind/save to `node.data.properties`; remaining keys + built-in collision; embed docs + try host |

Construction (recommended): Functional Design → Code Generation → Build and Test. Skip NFR/Infra per execution plan.

**Internal order (recommended)**  
1. Chrome: `propertiesPanel.addProperty` default false  
2. Pure helpers: `host-properties.dynamic.ts` (map, infer, remaining keys, collision)  
3. `dynamic-property.component.ts`  
4. Right-sidebar: schema → properties map; remaining keys; Save merge; Add UX  
5. Docs + try host + specs / PBT  

---

## Execution checklist (Part 2 — after plan approval)

- [x] Generate `dynamic-properties-unit-of-work.md`
- [x] Generate `dynamic-properties-unit-of-work-dependency.md`
- [x] Generate `dynamic-properties-unit-of-work-story-map.md`
- [x] Document brownfield code organization
- [x] Validate all US-DP-01..05 assigned

---

## Question 1

**Story grouping / domain boundary**

A) **Recommended** — All US-DP-01..05 in **U-DP-01** (one construction module: dynamic Properties)

B) Split into 2 units (bind+inference vs addProperty+docs)

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

A) **Recommended** — Change in place: add `host-properties.dynamic.ts` (+ specs); add `features/shell/dynamic-property.component.ts`; extend `ui-features.types.ts` / normalize; extend `right-sidebar.component.ts`; update `docs/workflow-builder-ui-embed.md` + try host. No new Angular project.

B) Put Dynamic Property under a new `features/properties/` folder in this increment

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Team / ownership**

A) **Recommended** — Same stream owns U-DP-01 end-to-end (no split ownership)

B) Split ownership (describe after [Answer]:)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Follow-up — Question 1 still blank

**Q1 (Story grouping) was empty.** Please choose:

A) **Recommended** — All US-DP-01..05 in **U-DP-01**

B) Split into 2 units (bind+inference vs addProperty+docs)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Optional freeform

```text

```
