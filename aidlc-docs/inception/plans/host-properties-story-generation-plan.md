# Generic host-driven Properties — Story Generation Plan

**Role**: Product Owner  
**Status**: GENERATED — awaiting story approval  
**Locked**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  
**Requirements**: `aidlc-docs/inception/requirements/host-properties-requirements.md` (FR-HP-01..10)  
**Assessment**: `host-properties-user-stories-assessment.md` — Execute = Yes

Fill every `[Answer]:`, then reply in chat (for example `answered`). Stories will not be generated until this plan is approved.

---

## Proposed story set (after answers; Q2=A default)

| Story | FR | Persona |
|---|---|---|
| Host `propertiesSchema` on palette copies to the node; Properties renders sections/fields; Save writes `path` on `node.data` | FR-HP-01, FR-HP-03, FR-HP-04, FR-HP-09 | P-HOST, P-AUTHOR, P-REVIEWER |
| Supply order: adapter when no node schema; logic built-ins; General only; no Ignore Keys | FR-HP-02, FR-HP-05, FR-HP-06 | P-HOST, P-AUTHOR |
| Opaque `taskMeta` / leftover `ensoTask` not flattened; unknown `ui_component` is disabled text | FR-HP-07, FR-HP-08 | P-HOST, P-AUTHOR |
| Embed docs: schema + `provideWorkflowBuilderUi({ properties })`; no Enso field names | FR-HP-10 | P-HOST |

View mode still disables is AC on the first story. Invalid-field skip is AC on the first story.

---

## Execution checklist (Part 2 — after plan approval)

- [x] Update `personas.md` additively (P-HOST: properties schema + adapter; P-AUTHOR: schema form / General only; P-REVIEWER: view disables)
- [x] Generate `aidlc-docs/inception/user-stories/host-properties-stories.md` with AC
- [x] Traceability table FR-HP ↔ US
- [x] INVEST + persona map
- [x] Confirm FR-HP-01..10 covered

---

## Breakdown options (for Q3)

- **User journey**: Drop node → open Properties → Save → inspect `node.data`
- **Feature-based**: schema render/save; supply order; no flatten / unknown widget; docs
- **Persona-based**: All P-HOST then all P-AUTHOR
- **Hybrid**: Feature rows with host + author AC (recommended default)

---

## Question 1

**Personas**

A) **Recommended** — Reuse P-HOST, P-AUTHOR, P-REVIEWER; extend them in `personas.md` for schema, adapter, General-only, view-disabled

B) Add a new P-FORM persona separate from P-AUTHOR for Properties editing

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Granularity**

A) **Recommended** — Standard — about one story per row in the proposed table (~4)

B) Compact — 2 stories (render+save+supply order, no-flatten+docs)

C) Thin slices — one story per FR (10 stories)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Breakdown**

A) **Recommended** — Hybrid — feature stories with both host and author acceptance criteria

B) User-journey only (one narrative from drop → Properties → Save)

C) Persona-based (host stories then author stories)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Acceptance criteria format**

A) **Recommended** — Gherkin (`Given` / `When` / `Then`) like host-palette and remove-APIs stories

B) Bullet checklist only

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Story file**

A) **Recommended** — New `aidlc-docs/inception/user-stories/host-properties-stories.md`; additive update to `personas.md`

B) Append to existing `stories.md` only

X) Other (please describe after [Answer]: tag below)

[Answer]: A
