# Remove APIs and dummy data — Story Generation Plan

**Role**: Product Owner  
**Status**: GENERATED — awaiting story approval  
**Locked**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  
**Requirements**: `aidlc-docs/inception/requirements/remove-apis-dummy-data-requirements.md` (FR-RAD-01..06)  
**Assessment**: `remove-apis-dummy-data-user-stories-assessment.md` — Execute = Yes

Fill every `[Answer]:`, then reply in chat (for example `answered`). Stories will not be generated until this plan is approved.

---

## Proposed story set (after answers; Q2=A default)

| Story | FR | Persona |
|---|---|---|
| No Enso catalog HTTP; omit `[palettes]` is empty-remote | FR-RAD-01, FR-RAD-02 | P-HOST, P-AUTHOR |
| Nested Skills Library uses agent-shell `[palettes]`; no `MOCK_SKILLS` | FR-RAD-03, FR-RAD-04 | P-HOST, P-AUTHOR |
| Repeater Properties has no mock workflow/version catalog | FR-RAD-05 | P-AUTHOR |
| Embed / README: no Enso proxy or credentials; document empty-when-omit | FR-RAD-06 | P-HOST |

Adapter-when-omit (U-PAL-02) is AC on the first story.

---

## Execution checklist (Part 2 — after plan approval)

- [x] Update `personas.md` additively (P-HOST: no Enso; palettes or adapter; nested palettes)
- [x] Generate `aidlc-docs/inception/user-stories/remove-apis-dummy-data-stories.md` with AC
- [x] Traceability table FR-RAD ↔ US
- [x] INVEST + persona map
- [x] Confirm FR-RAD-01..06 covered

---

## Breakdown options (for Q3)

- **User journey**: Open SPA → empty library; bind palettes → cards; open agent → nested list matches
- **Feature-based**: Enso gone + empty omit; nested palettes; Repeater mocks; docs
- **Persona-based**: All P-HOST then all P-AUTHOR
- **Hybrid**: Feature rows with host + author AC (recommended default)

---

## Question 1

**Personas**

A) **Recommended** — Reuse P-HOST + P-AUTHOR; extend P-HOST (no Enso; `[palettes]` or adapter) and P-AUTHOR (empty library, nested palettes, empty Repeater pickers)

B) Add a new P-CATALOG persona separate from P-HOST

C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Granularity**

A) **Recommended** — Standard — about one story per row in the proposed table (~4)

B) Compact — 2 stories (catalog empty/Enso, nested+repeater+docs)

C) Thin slices — one story per FR (6 stories)

D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Breakdown**

A) **Recommended** — Hybrid — feature stories with both host and author acceptance criteria

B) User-journey only (one narrative from boot → bind palettes → nested)

C) Persona-based (host stories then author stories)

D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Acceptance criteria format**

A) **Recommended** — Gherkin (`Given` / `When` / `Then`) like host-palette and logic-icons stories

B) Bullet checklist only

C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Story file**

A) **Recommended** — New `aidlc-docs/inception/user-stories/remove-apis-dummy-data-stories.md`; additive update to `personas.md`

B) Append to existing `stories.md` only

C) Other (please describe after [Answer]: tag below)

[Answer]: A
