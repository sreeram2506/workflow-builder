# Unit of Work Plan — Host UI chrome inputs (`[ui]`)

**Role**: Units Planner  
**Status**: GENERATION COMPLETE — AWAITING STAGE APPROVAL  
**Application Design**: Approved (Q1–Q4=A)  
**Proposed unit**: **U-HUI-01** (single unit)  
**Locked**: Q1=A · Q2=A · Q3=A

Additive files: `host-ui-inputs-unit-of-work*.md`

---

## Execution checklist (after plan approval)

- [x] Generate `host-ui-inputs-unit-of-work.md`
- [x] Generate `host-ui-inputs-unit-of-work-dependency.md`
- [x] Generate `host-ui-inputs-unit-of-work-story-map.md`
- [x] Document brownfield code organization
- [x] Validate all US-HUI-01..04 assigned

---

## Question 1 — Story grouping

A) **All US-HUI-01..04 in U-HUI-01** (recommended)

B) Split stories across multiple units (override)

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 2 — Construction stages

A) **Per execution plan** — FD → Code Gen → Build/Test; skip NFR/Infra

B) Skip Functional Design

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 3 — Code organization

A) **Recommended** — extend `core/ui-config/` (token + optional effective reader helper); shell/agent providers; update TopBar/shortcuts/zoom/viewport inject; docs in `docs/` + README

B) New `core/ui-config/effective/` subfolder only

X) Other (describe after [Answer]:)

[Answer]: A
