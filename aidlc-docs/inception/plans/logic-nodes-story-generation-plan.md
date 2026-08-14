# Story Generation Plan — Logic Node Properties Increment

**Role**: Product Owner planning  
**Status**: GENERATION COMPLETE — AWAITING STORY APPROVAL  
**Requirements source**: `aidlc-docs/inception/requirements/logic-nodes-requirements.md`  
**Existing personas**: `aidlc-docs/inception/user-stories/personas.md` (P-AUTHOR, P-REVIEWER)

Fill each `[Answer]:`, then reply in chat (e.g. `answered`). Generation does not start until this plan is approved.

This increment does not replace original Phase 1–10 stories. New stories will be additive.

### Locked planning decisions (agent-filled; user authorized)

| # | Decision |
|---|---|
| Q1 | Reuse P-AUTHOR and P-REVIEWER only |
| Q2 | Feature-based breakdown mapped to FR-LN-* |
| Q3 | Medium granularity (one story per distinct capability) |
| Q4 | Mix: Gherkin for core flows; bullets for field lists |
| Q5 | New `logic-nodes-stories.md`; do not duplicate personas (reuse existing `personas.md`) |

---

## Part A — Clarifying Questions

### Question 1

Personas for this increment?

A) Reuse existing P-AUTHOR and P-REVIEWER only

B) Reuse those two and add a Platform Integrator (cares about Enso API / live skills) — not recommended; live API is out of scope

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 2

Story breakdown approach?

A) **Feature-based** — Stories grouped by Condition properties, Router properties, Repeater properties, Condition edges, Router edges (maps 1:1 to FR-LN-*)

B) **User journey-based** — One flow: drop logic node -> configure -> connect -> save -> inspect in view mode

C) **Epic-based** — One epic "Logic nodes" with sub-stories per type

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 3

Story granularity?

A) Coarse — One story covering all three types

B) Medium — One story per distinct capability (Condition props, Router props, Repeater props, Condition edges, Router connectors, uniqueness, view-mode inspect)

C) Fine — Separate stories for every validation message and mock dropdown option

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

### Question 4

Acceptance criteria style? (Original product used mix.)

A) Mix: Gherkin for core flows; bullets for field lists and polish

B) Gherkin only

C) Bullet must / must not only

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 5

Where should generated stories live?

A) New files `aidlc-docs/inception/user-stories/logic-nodes-stories.md` and `logic-nodes-personas.md` (personas file only if Q1 adds someone; otherwise map to existing personas)

B) Append a new section to existing `stories.md` / `personas.md`

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Part B — Breakdown options (trade-offs)

| Approach | Benefit | Cost |
|---|---|---|
| Feature-based (A) | Matches FR-LN-01..05; easy construction units | Weaker end-to-end narrative |
| Journey-based (B) | Author happy path is clear | Mixes three node types in one story; harder to test in isolation |
| Epic-based (C) | Single umbrella for the increment | Extra nesting without much gain at this size |

Recommended if you want a default: **Q1=A, Q2=A, Q3=B, Q4=A, Q5=A**.

---

## Part C — Generation checklist (do not execute until plan approved)

- [x] Generate `aidlc-docs/inception/user-stories/logic-nodes-stories.md` using the approved breakdown, granularity, and AC style
- [x] Include INVEST stories with acceptance criteria mapped to FR-LN-01..08
- [x] Map each story to P-AUTHOR and/or P-REVIEWER (and any persona from Q1)
- [x] Map each story to P-AUTHOR and/or P-REVIEWER in the stories file (no new personas file; Q1=A)
- [x] Cover: Condition properties, Router properties, Repeater mock config, Condition max-2 true/false edges, Router connector Name+Condition, uniqueness, Ignore Keys hidden, view-mode read-only
- [x] Explicitly exclude: live Enso API, `routeEdges` algorithm, shape SVG changes, Enso toasts
- [x] Verify stories are Independent, Negotiable, Valuable, Estimable, Small, Testable
