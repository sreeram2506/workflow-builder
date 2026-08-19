# npm package publish — Story Generation Plan

**Role**: Product Owner  
**Status**: STAGE GENERATED — awaiting approval  
**Locked**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  
**Requirements**: `aidlc-docs/inception/requirements/npm-package-requirements.md` (FR-NP-01..09)  
**Assessment**: `npm-package-user-stories-assessment.md` — Execute = Yes

Plan locked. Story artifacts generated. Awaiting approval to continue.

---

## Proposed story set (after answers; Q2=A default)

| Story | FR | Persona |
|---|---|---|
| Host installs `enso-workflow-builder` and imports shells + provider + facade | FR-NP-01, FR-NP-02, FR-NP-03, FR-NP-05 | P-HOST |
| Package ships or documents styles/tokens | FR-NP-04 | P-HOST |
| `npm pack` works; `npm publish` documented, not run | FR-NP-06 | P-HOST |
| SPA still works; embed docs use package imports; tarball has no try/secrets | FR-NP-07, FR-NP-08, FR-NP-09 | P-HOST, P-AUTHOR |

---

## Execution checklist (Part 2 — after plan approval)

- [x] Update `personas.md` additively (P-HOST: npm install `enso-workflow-builder`)
- [x] Generate `aidlc-docs/inception/user-stories/npm-package-stories.md` with AC
- [x] Traceability table FR-NP ↔ US
- [x] INVEST + persona map
- [x] Confirm FR-NP-01..09 covered

---

## Breakdown options (for Q3)

- **User journey**: Host packs → installs → imports shells in their app
- **Feature-based**: library identity; public API; pack; SPA + docs + secrets
- **Persona-based**: All P-HOST then P-AUTHOR
- **Hybrid**: Feature rows with host + author AC (recommended default)

---

## Question 1

**Personas**

A) **Recommended** — Reuse P-HOST, P-AUTHOR, P-REVIEWER; extend P-HOST in `personas.md` for `npm install enso-workflow-builder` (not copy `src`)

B) Add a new P-PACKAGER persona for ng-packagr only

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Granularity**

A) **Recommended** — Standard — about one story per row in the proposed table (~4)

B) Compact — 2 stories (install+API+styles, pack+SPA+docs)

C) Thin slices — one story per FR (9 stories)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Breakdown**

A) **Recommended** — Hybrid — feature stories with host (and author where SPA) acceptance criteria

B) User-journey only (one narrative from pack → install → embed)

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

A) **Recommended** — New `aidlc-docs/inception/user-stories/npm-package-stories.md`; additive update to `personas.md`

B) Append to existing `stories.md` only

X) Other (please describe after [Answer]: tag below)

[Answer]: A
