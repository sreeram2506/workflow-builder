# Unit of Work Plan — Agent tabs doubleClick config

**Role**: Units Planner  
**Status**: GENERATED — awaiting unit approval  
**Application Design**: SKIP (execution plan approved)  
**Execution plan**: Skip FD/NFR/Infra; **1 unit U-DC-01**; then CG → Build/Test  
**Stories**: US-DC-01..05  

**Locked**: Q1=A · Q2=A · Q3=A · Q4=A. Plan approved. Unit artifacts generated.

**Category notes**
- Story grouping / business domain: Q1  
- Dependencies: single unit (Q1=A default) — no inter-unit protocol; Q2 covers construction sequence  
- Team: Q4  
- Technical / deploy: same Angular SPA (Q3)  
- Code organization: brownfield paths (Q3); not greenfield multi-unit  

Additive files after approval: `agent-tabs-doubleclick-config-unit-of-work*.md`

---

## Proposed unit

| Unit | Stories | Owns |
|---|---|---|
| **U-DC-01** | US-DC-01..05 | Add `agentTabs.doubleClick` (default true); merge layers; gate solution-canvas AIAgent dblclick; keep chip enter and nested no-re-enter; embed docs + JSON examples |

Construction (recommended, matches execution plan): skip Functional Design and NFR/Infra; Code Generation → Build and Test.

**Internal order (recommended)**  
1. Types, defaults, `UI_FEATURE_PATHS`, JSON examples (FR-DC-01, FR-DC-02)  
2. Gate `onNodeDblClick` on effective `agentTabs.doubleClick` (FR-DC-03, FR-DC-07)  
3. Confirm independence from `agentTabs.enabled`; both false = no builder enter (FR-DC-04)  
4. Chip click still enters; nested no re-enter (FR-DC-05, FR-DC-06)  
5. Embed docs + merge invariant tests (FR-DC-08, PBT Partial)  

---

## Execution checklist (Part 2 — after plan approval)

- [x] Generate `agent-tabs-doubleclick-config-unit-of-work.md`
- [x] Generate `agent-tabs-doubleclick-config-unit-of-work-dependency.md`
- [x] Generate `agent-tabs-doubleclick-config-unit-of-work-story-map.md`
- [x] Document brownfield code organization
- [x] Validate all US-DC-01..05 assigned

---

## Question 1

**Story grouping / domain boundary**

A) **Recommended** — All US-DC-01..05 in **U-DC-01** (one construction module: dblclick chrome leaf)

B) Split into 2 units (feature leaf + merge vs canvas gate + docs)

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

A) **Recommended** — Change in place: `ui-features.types.ts` / merge/defaults; `canvas-viewport.component.ts` (`onNodeDblClick` gate); example JSON; `docs/workflow-builder-ui-embed.md`. No new Angular project. Do not commit `src/app/try/` unless you ask.

B) Extract dblclick gating into a new helper module in this increment

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Team / ownership**

A) **Recommended** — Same stream owns U-DC-01 end-to-end (no split ownership)

B) Split ownership (describe after [Answer]:)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
