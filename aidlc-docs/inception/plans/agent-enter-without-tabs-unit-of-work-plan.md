# Unit of Work Plan — Enter agent without tab bar

**Role**: Units Planner  
**Status**: STAGE APPROVED — CG PLAN OPEN  
**Locked**: Q1=A · Q2=A · Q3=A · Q4=A  
**Application Design**: SKIP (execution plan Q1=A)  
**Execution plan**: Q1=A — **1 unit U-AE-01**; skip FD/NFR/Infra; then CG → Build/Test  
**Stories**: US-AE-01..04  

Fill every `[Answer]:`, then reply in chat (for example `answered`). Unit artifacts will not be generated until this plan is approved.

**Category notes**
- Story grouping / business domain: Q1  
- Dependencies: single unit (Q1=A) — no inter-unit protocol; Q2 covers construction sequence  
- Team: Q4  
- Technical / deploy: same Angular SPA (Q3)  
- Code organization: brownfield paths (Q3); not greenfield multi-unit  

Additive files after approval: `agent-enter-without-tabs-unit-of-work*.md`

---

## Proposed unit

| Unit | Stories | Owns |
|---|---|---|
| **U-AE-01** | US-AE-01..04 | Gate `openAgentTab` when `agentTabs.enabled` is false; keep dblclick/chip `selectAgentTab`; nested Back/Solution when strip not mounted; nested no re-enter; View still enters; embed docs |

Construction (recommended, matches execution plan): skip Functional Design and NFR/Infra; Code Generation → Build and Test.

**Internal order (recommended)**  
1. Gate `openAgentTab` on effective `agentTabs.enabled` (FR-AE-05)  
2. Confirm solution-canvas dblclick still calls `selectAgentTab` (FR-AE-01); nested canvas still no-ops (FR-AE-03)  
3. Nested Back/Solution when tab strip is not mounted (FR-AE-04); chips unchanged when bar on (FR-AE-02)  
4. View-mode enter still works (FR-AE-06)  
5. Embed docs: `agentTabs.enabled` is chrome, not a routing block (FR-AE-07, FR-AE-08)  
6. Specs  

---

## Execution checklist (Part 2 — after plan approval)

- [x] Generate `agent-enter-without-tabs-unit-of-work.md`
- [x] Generate `agent-enter-without-tabs-unit-of-work-dependency.md`
- [x] Generate `agent-enter-without-tabs-unit-of-work-story-map.md`
- [x] Document brownfield code organization
- [x] Validate all US-AE-01..04 assigned

---

## Question 1

**Story grouping / domain boundary**

A) **Recommended** — All US-AE-01..04 in **U-AE-01** (one construction module: enter/exit without tab bar)

B) Split into 2 units (gate `openAgentTab` + dblclick vs nested Back + docs)

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

A) **Recommended** — Change in place: `workflow.facade.ts` (`openAgentTab` gate); `canvas-viewport.component.ts` (keep dblclick enter; nested no re-enter); `shell-layout.component.ts` / `agent-skills-shell.component.ts` (Back/Solution when strip not mounted); `docs/workflow-builder-ui-embed.md`. No new Angular project. Do not commit `src/app/try/` unless you ask.

B) Extract enter/exit into a new `core/agent-nav/` helper module in this increment

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Team / ownership**

A) **Recommended** — Same stream owns U-AE-01 end-to-end (no split ownership)

B) Split ownership (describe after [Answer]:)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
