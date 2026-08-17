# Palette / catalog host config — Story Generation Plan

**Role**: Product Owner  
**Status**: EXECUTED — awaiting User Stories approval  
**Locked**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A  
**Requirements**: `aidlc-docs/inception/requirements/palette-host-config-requirements.md`  
**Assessment**: `palette-host-config-user-stories-assessment.md` — Execute = Yes

Fill `[Answer]:` for each question, then reply in chat. Stories will not be generated until this plan is approved.

---

## Proposed story set (after answers)

| Story | FR | Persona |
|---|---|---|
| Merge JSON + provider (palette/catalog keys) | FR-PAL-01 | P-HOST |
| Solution allow-list | FR-PAL-02, FR-PAL-06 | P-HOST, P-AUTHOR |
| Skills allow-list | FR-PAL-02, FR-PAL-06 | P-HOST, P-AUTHOR |
| defaultAgents replace Blank Agent | FR-PAL-03 | P-HOST, P-AUTHOR |
| Catalog adapter replace Enso | FR-PAL-04 | P-HOST |
| Adapter/Enso failure → static defaults, no mocks | FR-PAL-05 | P-AUTHOR, P-HOST |
| Embed docs + example JSON | FR-PAL-07 | P-HOST |

Omitted allow-list / omitted `defaultAgents` = today’s UX (NFR-PAL-01) folded into the merge + allow-list stories.

---

## Execution checklist (Part 2 — after plan approval)

- [x] Update `personas.md` additively (P-HOST palette/catalog; P-AUTHOR filtered library)
- [x] Generate increment stories file with AC
- [x] Traceability table FR-PAL ↔ US
- [x] INVEST + persona map

Mandatory artifacts after generation: increment stories markdown + updated `personas.md`.

---

## Breakdown options (for Q3)

- **User journey**: Host configures → Author opens canvas → library matches
- **Feature-based**: Allow-list, defaultAgents, adapter, failure, docs
- **Persona-based**: All P-HOST stories then all P-AUTHOR
- **Hybrid**: Feature rows, each with host + author AC (recommended default)

---

## Question 1

**Personas**

A) Reuse P-HOST + P-AUTHOR; extend P-HOST in `personas.md` (P-REVIEWER only if view-mode library matters)

B) Add a new P-CATALOG persona for adapter authors (separate from P-HOST)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 2

**Granularity**

A) Standard — about one story per row in the proposed table (~7)

B) Compact — 4 stories (config merge, allow-lists both canvases, defaultAgents, adapter+failure+docs)

C) Thin slices — more than 7 (e.g. split featured-strip vs category list)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 3

**Breakdown**

A) Hybrid — feature stories with both host and author acceptance criteria

B) User-journey only (one flow from config to visible palette)

C) Feature-based with host-only stories (author UX as AC bullets, not separate stories)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 4

**Acceptance criteria format**

A) Gherkin (`Given` / `When` / `Then`) — same as UI Configurability

B) Numbered bullet criteria

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 5

**Where to write stories**

A) New file `aidlc-docs/inception/user-stories/palette-host-config-stories.md`; additive edits to `personas.md`

B) Append to `ui-configurability-stories.md`

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 6

**After this plan is approved**

A) Generate the stories and personas updates from the locked answers

X) Other (please describe after [Answer]: tag below)

[Answer]:A
