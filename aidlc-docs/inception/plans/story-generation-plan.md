# Story Generation Plan — Angular Workflow Builder

**Role**: Product Owner planning  
**Status**: GENERATION COMPLETE — AWAITING STORY APPROVAL  
**Requirements source**: `aidlc-docs/inception/requirements/requirements.md`

### Locked planning decisions
| # | Decision |
|---|---|
| Q1 | Two personas: Workflow Author + Workflow Reviewer |
| Q2 | Feature-based breakdown (mapped to phases) |
| Q3 | Medium granularity (one story per distinct capability) |
| Q4 | Mix: Gherkin for core flows; bullets for UI polish |
| Q5 | Order stories by build Phases 1–10 |
| Q6 | Phase 7–8: epics only (no detailed stories until gate answers) |
| Q7 | Dedicated view-mode / locked-controls stories |

Generation will not start until you explicitly approve this plan.

---

## Part A — Clarifying Questions

### Question 1
**Primary personas for v1** — Who are we writing stories for?

A) Single persona: Workflow Author (creates/edits workflows; can also switch to view mode)

B) Two personas: Workflow Author (edit) + Workflow Reviewer (read-only / view mode)

C) Three personas: Author, Reviewer, and Demo Presenter (uses Run / theme for demos)

D) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 2
**Story breakdown approach**

A) **Feature-based** — Stories grouped by product capability (Canvas, Palette, Connections, Properties, History, Run, Theme), mapped to build phases

B) **User journey-based** — Stories follow end-to-end flows (create workflow → configure → connect → run → export)

C) **Epic-based hybrid** — Epics align to Phases 1–10; stories under each epic are feature-sized with acceptance criteria

D) **Persona-based** — Separate story sets per persona

E) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 3
**Story granularity**

A) Coarse — One story per major feature area (fewer stories, broader AC)

B) Medium — One story per distinct user capability (e.g., “pan/zoom”, “lasso select”, “drag from palette”) — recommended for phase gates

C) Fine — Separate stories for each interaction detail and edge case

D) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 4
**Acceptance criteria style**

A) Checklist Given/When/Then bullets (testable, concise)

B) Bullet “must / must not” criteria only (no Gherkin)

C) Mix: Gherkin for core flows; bullets for UI polish criteria

D) Other (please describe after [Answer]: tag below)

[Answer]: C

### Question 5
**Priority / ordering in stories.md**

A) Order stories to match build Phases 1–10 (Phase 1 stories first)

B) Order by user value (authoring happy path first), with phase tags on each story

C) No priority ordering — group by epic/feature only; phases noted as tags

D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 6
**Scope of stories relative to deferred phase questions**

A) Include placeholder stories for Phase 7 routing and Phase 8 layout with AC = “as confirmed in phase gate questions”

B) Omit Phase 7–8 detail stories until those gate questions are answered; only mention epics

C) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 7
**View / read-only mode coverage**

A) Dedicated stories for entering view mode and verifying locked controls

B) Cover view mode only as acceptance criteria on editing stories (no separate stories)

C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Part B — Approach Options (reference)

| Approach | Benefit | Trade-off |
|---|---|---|
| Feature-based | Maps cleanly to FRs and UI regions | Weaker end-to-end narrative |
| Journey-based | Strong happy-path clarity | Harder to slice by Phase 1-only gate |
| Epic-based hybrid | Best for phased delivery + INVEST stories | Slightly more structure overhead |
| Persona-based | Clear edit vs view needs | Duplicate stories across personas |

**Recommendation (non-binding):** Epic-based hybrid + medium granularity + phase-ordered stories, given your Phase 1-only construction gate.

---

## Part C — Generation Checklist (execute only after plan approval)

### Planning complete
- [x] All Part A questions answered
- [x] Ambiguities resolved (follow-ups if needed)
- [x] Plan explicitly approved by user

### Mandatory artifacts
- [x] Generate `aidlc-docs/inception/user-stories/personas.md`
- [x] Generate `aidlc-docs/inception/user-stories/stories.md` (INVEST + acceptance criteria)
- [x] Map personas to stories
- [x] Trace stories to FR-* / build phases where applicable
- [x] Verify Independent, Negotiable, Valuable, Estimable, Small, Testable

### Generation steps (in order)
- [x] Step 1: Create personas per approved Question 1
- [x] Step 2: Create epic structure per approved Questions 2, 5, 6
- [x] Step 3: Write medium/approved-granularity stories with AC per Questions 3–4, 7
- [x] Step 4: Add persona ↔ story mapping table
- [x] Step 5: Cross-check against `requirements.md` for gaps (no scope creep)
- [x] Step 6: Final INVEST pass and mark plan complete
