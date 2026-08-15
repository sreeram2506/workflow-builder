# Story Generation Plan — Solution Workflow Increment

**Role**: Product Owner planning  
**Status**: APPROVED — STORIES GENERATED  
**Requirements source**: `aidlc-docs/inception/requirements/solution-workflow-requirements.md`  
**Existing personas**: `aidlc-docs/inception/user-stories/personas.md` (P-AUTHOR, P-REVIEWER)  
**Stories artifact**: `aidlc-docs/inception/user-stories/solution-workflow-stories.md`

This increment does not replace prior stories. New stories are additive (`solution-workflow-stories.md`).

---

## Locked planning decisions

| # | Decision |
|---|---|
| Q1 | Reuse **P-AUTHOR** and **P-REVIEWER** only |
| Q2 | **User journey-based** primary narrative |
| Q3 | **Medium** granularity (distinct capability stories along the journey) |
| Q4 | Mix: Gherkin for core flows; bullets for catalogs / polish |
| Q5 | Nested canvas **respects global edit/view mode** |

### Hybrid rule (Q2 + Q3)

Organize stories as steps of the author journey (add Blank Agent → open nested → add skills → Back → continue solution), but keep **one story per distinct capability** so construction can map to FR-SW-* cleanly. Do not collapse P0+P1 into a single coarse story.

---

## Execution checklist (after plan approval)

- [x] Generate `aidlc-docs/inception/user-stories/solution-workflow-stories.md` (INVEST + AC)
- [x] Reuse existing `personas.md` (no new persona)
- [x] Map personas to stories
- [x] Trace each story to FR-SW-* / NFR-SW-*
- [x] Cover first construction unit: **P0 + P1**

### Generated stories

1. US-SW-01 — Add Blank Agent from solution palette (with Condition/Router/Repeater strip)
2. US-SW-02 — Double-click Blank Agent opens nested skills canvas
3. US-SW-03 — Add mock skills onto nested canvas
4. US-SW-04 — Back returns to solution; nested graph persists in-session
5. US-SW-05 — Properties on nested skills / agent follow existing patterns; view mode respected

---

## Part A — Clarifying Questions (answered)

### Question 1 — Personas?
[Answer]: A

### Question 2 — Story breakdown approach?
[Answer]: B

### Question 3 — Story granularity?
[Answer]: B

### Question 4 — Acceptance criteria style?
[Answer]: A

### Question 5 — View mode on nested skills canvas?
[Answer]: A
