# Host logic extras + agent metadata — Story Generation Plan

**Role**: Product Owner  
**Status**: APPROVED — GENERATION COMPLETE  
**Locked**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  
**Requirements**: `aidlc-docs/inception/requirements/logic-icons-metadata-requirements.md` (FR-LIM-01..10)  
**Assessment**: `logic-icons-metadata-user-stories-assessment.md` — Execute = Yes

Fill every `[Answer]:`, then reply in chat (for example `answered`). Stories will not be generated until this plan is approved.

---

## Proposed story set (after answers; Q2=A default)

| Story | FR | Persona |
|---|---|---|
| Extra logic cards; featured strip replaces built-ins when `[palettes]` present | FR-LIM-01, FR-LIM-02 | P-HOST, P-AUTHOR |
| Library icons (`iconUrl` / `iconPath`), allowlist, fallback; canvas unchanged | FR-LIM-03, FR-LIM-04, FR-LIM-05, FR-LIM-06 | P-HOST, P-AUTHOR |
| Metadata + `taskMeta` on cards; persist on drop | FR-LIM-07, FR-LIM-08, FR-LIM-09 | P-HOST, P-AUTHOR |
| Embed docs + try-harness samples | FR-LIM-10 | P-HOST |

Omit `[palettes]` keeping the static three is AC on the first story. JSON `defaultAgents` icons/metadata is AC on stories 2 and 3.

---

## Execution checklist (Part 2 — after plan approval)

- [x] Update `personas.md` additively (P-HOST: extra logic cards, icons, metadata)
- [x] Generate `aidlc-docs/inception/user-stories/logic-icons-metadata-stories.md` with AC
- [x] Traceability table FR-LIM ↔ US
- [x] INVEST + persona map
- [x] Confirm FR-LIM-01..10 covered

---

## Breakdown options (for Q3)

- **User journey**: Host binds palettes → Author opens library → drop node → inspect `data`
- **Feature-based**: strip replace, icons, metadata/drop, docs
- **Persona-based**: All P-HOST then all P-AUTHOR
- **Hybrid**: Feature rows with host + author AC (recommended default)

---

## Question 1

**Personas**

A) **Recommended** — Reuse P-HOST + P-AUTHOR; extend P-HOST in `personas.md` for extra logic cards, icons, and metadata

B) Add a new P-CATALOG persona separate from P-HOST

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Granularity**

A) **Recommended** — Standard — about one story per row in the proposed table (~4)

B) Compact — 2 stories (library strip+icons, metadata+docs)

C) Thin slices — one story per FR (10 stories)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Breakdown**

A) **Recommended** — Hybrid — feature stories with both host and author acceptance criteria

B) User-journey only (one narrative from bind → drop)

C) Persona-based (host stories then author stories)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Acceptance criteria format**

A) **Recommended** — Gherkin (`Given` / `When` / `Then`) like host-ui and host-palette stories

B) Bullet checklist only

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Story file**

A) **Recommended** — New `aidlc-docs/inception/user-stories/logic-icons-metadata-stories.md`; additive update to `personas.md`

B) Append to existing `stories.md` only

X) Other (please describe after [Answer]: tag below)

[Answer]: A
