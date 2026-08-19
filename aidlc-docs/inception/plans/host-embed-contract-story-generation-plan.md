# Host embed contract — Story Generation Plan

**Role**: Product Owner  
**Status**: GENERATED — awaiting story approval  
**Requirements**: `aidlc-docs/inception/requirements/host-embed-contract-requirements.md` (FR-HE-01..09)  
**Assessment**: `host-embed-contract-user-stories-assessment.md` — Execute = Yes

Fill every `[Answer]:`, then reply in chat (for example `answered`). Stories will not be generated until this plan is approved.

---

## Proposed story set (after answers; Q2=A default)

| Story | FR | Persona |
|---|---|---|
| Host loads `[document]`; invalid payload keeps last good graph + status | FR-HE-01, FR-HE-02 | P-HOST, P-AUTHOR |
| `getDocument` / dirty / `(documentChange)` after load and committed edits | FR-HE-03, FR-HE-04 | P-HOST |
| Save/Run host handlers when set; else blob Save + simulated Run; Export/Import stay | FR-HE-05, FR-HE-06, FR-HE-07 | P-HOST, P-AUTHOR |
| Shells fill host box (`100%`); embed docs; no ng-packagr | FR-HE-08, FR-HE-09 | P-HOST |

---

## Execution checklist (Part 2 — after plan approval)

- [x] Update `personas.md` additively (P-HOST: document/save/run/height; P-AUTHOR: defaults still work)
- [x] Generate `aidlc-docs/inception/user-stories/host-embed-contract-stories.md` with AC
- [x] Traceability table FR-HE ↔ US
- [x] INVEST + persona map
- [x] Confirm FR-HE-01..09 covered

---

## Breakdown options (for Q3)

- **User journey**: Host binds document → author edits → Save handler / download
- **Feature-based**: load fail-safe; change events; Save/Run hooks; height + docs
- **Persona-based**: All P-HOST then P-AUTHOR
- **Hybrid**: Feature rows with host + author AC (recommended default)

---

## Question 1

**Personas**

A) **Recommended** — Reuse P-HOST, P-AUTHOR, P-REVIEWER; extend them in `personas.md` for `[document]`, Save/Run handlers vs defaults, fill-host height

B) Add a new P-PERSIST persona for document I/O only

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Granularity**

A) **Recommended** — Standard — about one story per row in the proposed table (~4)

B) Compact — 2 stories (load+change, Save/Run+height+docs)

C) Thin slices — one story per FR (9 stories)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Breakdown**

A) **Recommended** — Hybrid — feature stories with both host and author acceptance criteria

B) User-journey only (one narrative from bind → edit → Save)

C) Persona-based (host stories then author stories)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Acceptance criteria format**

A) **Recommended** — Gherkin (`Given` / `When` / `Then`) like prior increment stories

B) Bullet checklist only

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Story file**

A) **Recommended** — New `aidlc-docs/inception/user-stories/host-embed-contract-stories.md`; additive update to `personas.md`

B) Append to existing `stories.md` only

X) Other (please describe after [Answer]: tag below)

[Answer]: A
