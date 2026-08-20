# Agent tabs doubleClick config — Story Generation Plan

**Role**: Product Owner  
**Status**: GENERATED — awaiting story approval  
**Requirements**: `aidlc-docs/inception/requirements/agent-tabs-doubleclick-config-requirements.md` (FR-DC-01..08)  
**Assessment**: `agent-tabs-doubleclick-config-user-stories-assessment.md` — Execute = Yes

**Locked**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A. Plan approved. Stories generated.

---

## Proposed story set (after answers; Q2=A default)

| Story | FR | Persona |
|---|---|---|
| Default `true` / omitted key: canvas dblclick still enters | FR-DC-01, FR-DC-02, FR-DC-03 | P-AUTHOR, P-HOST |
| `doubleClick: false` blocks canvas dblclick; selection/drag unchanged | FR-DC-03, FR-DC-07 | P-AUTHOR, P-REVIEWER |
| Independent of `agentTabs.enabled`; both false = no builder enter | FR-DC-04 | P-AUTHOR, P-HOST |
| Chip single-click still enters when strip is on and dblclick is off; nested no re-enter | FR-DC-05, FR-DC-06 | P-AUTHOR |
| Embed/JSON examples document `agentTabs.doubleClick` | FR-DC-08 | P-HOST |

---

## Execution checklist (Part 2 — after plan approval)

- [x] Update `personas.md` additively (P-HOST: `agentTabs.doubleClick`; P-AUTHOR/P-REVIEWER: gated dblclick)
- [x] Generate `aidlc-docs/inception/user-stories/agent-tabs-doubleclick-config-stories.md` with AC
- [x] Traceability table FR-DC ↔ US
- [x] INVEST + persona map
- [x] Confirm FR-DC-01..08 covered
- [x] No secrets in story examples

---

## Breakdown options (for Q3)

- **User journey**: Host sets flag → author dblclick → enter or stay on solution
- **Feature-based**: leaf/merge; canvas gate; independence matrix; chips/nested; docs
- **Persona-based**: All P-HOST then P-AUTHOR
- **Hybrid**: Feature rows with host and author AC (recommended default)

---

## Question 1

**Personas**

A) **Recommended** — Reuse P-HOST, P-AUTHOR, P-REVIEWER; extend them in `personas.md` for `agentTabs.doubleClick`

B) Add a new persona for canvas-gesture config only

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Granularity**

A) **Recommended** — Standard — about one story per row in the proposed table (~5)

B) Compact — 3 stories (host leaf, canvas gate + matrix, chips/nested/docs)

C) Thin slices — one story per FR (8 stories)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Breakdown**

A) **Recommended** — Hybrid — feature stories with both host and author acceptance criteria

B) User-journey only

C) Persona-based (host stories then author stories)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Acceptance criteria format**

A) **Recommended** — Gherkin (`Given` / `When` / `Then`) like U-AE-01 stories

B) Bullet checklist only

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Story file**

A) **Recommended** — New `aidlc-docs/inception/user-stories/agent-tabs-doubleclick-config-stories.md`; additive update to `personas.md`

B) Append to existing `stories.md` only

X) Other (please describe after [Answer]: tag below)

[Answer]: A
