# Host palette inputs — Story Generation Plan

**Role**: Product Owner  
**Status**: EXECUTED — awaiting User Stories approval  
**Locked**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A  
**Requirements**: `aidlc-docs/inception/requirements/host-palette-inputs-requirements.md`  
**Assessment**: `host-palette-inputs-user-stories-assessment.md` — Execute = Yes

Fill `[Answer]:` for each question, then reply in chat. Stories will not be generated until this plan is approved.

---

## Proposed story set (after answers)

| Story | FR | Persona |
|---|---|---|
| Solution `[palettes]` omit / `[]` / items | FR-HPI-01, FR-HPI-03 | P-HOST, P-AUTHOR |
| `[defaultAgents]` input wins over JSON | FR-HPI-01, FR-HPI-04 | P-HOST, P-AUTHOR |
| Skills shell `[palettes]` | FR-HPI-01, FR-HPI-03, FR-HPI-05 | P-HOST, P-AUTHOR |
| Component input wins over catalog provider | FR-HPI-02 | P-HOST |
| Drop unknown item types | FR-HPI-05 | P-HOST |
| Embed docs + parent template example | FR-HPI-06 | P-HOST |

Featured strip + default agents still showing when parent passes items is AC on the solution palettes story (Q2=A).

---

## Execution checklist (Part 2 — after plan approval)

- [x] Update `personas.md` additively (P-HOST template inputs)
- [x] Generate `aidlc-docs/inception/user-stories/host-palette-inputs-stories.md` with AC
- [x] Traceability table FR-HPI ↔ US
- [x] INVEST + persona map

---

## Breakdown options (for Q3)

- **User journey**: Parent binds inputs → Author opens canvas → library matches
- **Feature-based**: palettes, defaultAgents, skills, precedence, unknown types, docs
- **Persona-based**: All P-HOST then all P-AUTHOR
- **Hybrid**: Feature rows with host + author AC (recommended default)

---

## Question 1

**Personas**

A) **Recommended** — Reuse P-HOST + P-AUTHOR; extend P-HOST in `personas.md` for template `[palettes]` / `[defaultAgents]`

B) Add a new P-EMBED persona separate from P-HOST

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Granularity**

A) **Recommended** — Standard — about one story per row in the proposed table (~6)

B) Compact — 3 stories (solution inputs, skills inputs, docs)

C) Thin slices — more than 6 (e.g. split omit vs `[]` vs items into three stories)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Breakdown**

A) **Recommended** — Hybrid — feature stories with both host and author acceptance criteria

B) User-journey only (one flow from parent template to visible palette)

C) Feature-based with host-only stories (author UX as AC bullets, not separate stories)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Acceptance criteria format**

A) **Recommended** — Gherkin (`Given` / `When` / `Then`) — same as palette-host stories

B) Numbered bullet criteria

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Where to write stories**

A) **Recommended** — New file `aidlc-docs/inception/user-stories/host-palette-inputs-stories.md`; additive edits to `personas.md`

B) Append to `palette-host-config-stories.md`

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6

**After this plan is approved**

A) Generate the stories and personas updates from the locked answers

X) Other (please describe after [Answer]: tag below)

[Answer]: A
