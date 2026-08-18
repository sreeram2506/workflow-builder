# Enter agent without tab bar — Story Generation Plan

**Role**: Product Owner  
**Status**: GENERATED — awaiting story approval  
**Requirements**: `aidlc-docs/inception/requirements/agent-enter-without-tabs-requirements.md` (FR-AE-01..08)  
**Assessment**: `agent-enter-without-tabs-user-stories-assessment.md` — Execute = Yes

Fill every `[Answer]:`, then reply in chat (for example `answered`). Stories will not be generated until this plan is approved.

---

## Proposed story set (after answers; Q2=A default)

| Story | FR | Persona |
|---|---|---|
| Double-click AIAgent on solution canvas enters nested canvas even when `agentTabs.enabled` is false; no chips from select/drop while the bar is off | FR-AE-01, FR-AE-05, FR-AE-07 | P-AUTHOR, P-HOST |
| When the tab bar is on, agent chips still enter; Solution chip still returns | FR-AE-02 | P-AUTHOR, P-HOST |
| Nested Back/Solution when the strip is not mounted; no re-enter on nested dblclick; View still enters | FR-AE-03, FR-AE-04, FR-AE-06 | P-AUTHOR, P-REVIEWER, P-HOST |
| Embed/try notes: bar is chrome; dblclick + Back still work | FR-AE-08 | P-HOST |

---

## Execution checklist (Part 2 — after plan approval)

- [x] Update `personas.md` additively (P-AUTHOR: dblclick enter; P-HOST: `agentTabs.enabled` vs routing; P-REVIEWER: view enter)
- [x] Generate `aidlc-docs/inception/user-stories/agent-enter-without-tabs-stories.md` with AC
- [x] Traceability table FR-AE ↔ US
- [x] INVEST + persona map
- [x] Confirm FR-AE-01..08 covered

---

## Breakdown options (for Q3)

- **User journey**: Click agent → (optional chip) → dblclick → nested → Back
- **Feature-based**: enter dblclick; enter chips; exit + guards
- **Persona-based**: All P-AUTHOR then P-HOST
- **Hybrid**: Feature rows with author + host AC (recommended default)

---

## Question 1

**Personas**

A) **Recommended** — Reuse P-HOST, P-AUTHOR, P-REVIEWER; extend them in `personas.md` for dblclick enter, tab chrome vs routing, nested Back, view enter

B) Add a new P-NAV persona for nested-agent navigation only

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Granularity**

A) **Recommended** — Standard — about one story per row in the proposed table (~4)

B) Compact — 2 stories (enter paths, exit + guards + docs)

C) Thin slices — one story per FR (8 stories)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Breakdown**

A) **Recommended** — Hybrid — feature stories with both host and author acceptance criteria

B) User-journey only (one narrative from canvas → nested → Back)

C) Persona-based (author stories then host stories)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Acceptance criteria format**

A) **Recommended** — Gherkin (`Given` / `When` / `Then`) like host-properties stories

B) Bullet checklist only

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Story file**

A) **Recommended** — New `aidlc-docs/inception/user-stories/agent-enter-without-tabs-stories.md`; additive update to `personas.md`

B) Append to existing `stories.md` only

X) Other (please describe after [Answer]: tag below)

[Answer]: A
