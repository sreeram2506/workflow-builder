# Dynamic Properties — Story Generation Plan

**Role**: Product Owner  
**Status**: GENERATED — awaiting story approval  
**Locked**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  
**Requirements**: `aidlc-docs/inception/requirements/dynamic-properties-requirements.md` (FR-DP-01..09)  
**Assessment**: `dynamic-properties-user-stories-assessment.md` — Execute = Yes

Stories generated. Approve stories to continue to Workflow Planning, or request changes.

---

## Proposed story set (after answers; Q2=A default)

| Story | FR | Persona |
|---|---|---|
| Schema + values bind to `node.data.properties`; Save via `patchNode` | FR-DP-01, FR-DP-04, FR-DP-07 | P-HOST, P-AUTHOR, P-REVIEWER |
| Remaining keys use Dynamic Property + inference; no reserved-key filter | FR-DP-02, FR-DP-03, FR-DP-04 | P-AUTHOR, P-HOST |
| Built-ins always for Condition/Router/Repeater; colliding dynamic keys omitted | FR-DP-05 | P-AUTHOR |
| Add property when `propertiesPanel.addProperty` is true (default false) | FR-DP-06 | P-HOST, P-AUTHOR |
| Embed docs + try host demo (vendor-neutral) | FR-DP-08, FR-DP-09 | P-HOST |

General always above is AC on the first story. View-mode disable is AC on the first story. Invalid schema skip remains as today.

---

## Execution checklist (Part 2 — after plan approval)

- [x] Update `personas.md` additively (dynamic map, inference, addProperty)
- [x] Generate `aidlc-docs/inception/user-stories/dynamic-properties-stories.md` with AC
- [x] Traceability table FR-DP ↔ US
- [x] INVEST + persona map
- [x] Confirm FR-DP-01..09 covered

---

## Breakdown options (for Q3)

- **User journey**: Select node → edit schema/dynamic fields → Save → inspect `node.data.properties`
- **Feature-based**: map bind/save; inference; built-in collision; add-property; docs
- **Persona-based**: All P-HOST then all P-AUTHOR
- **Hybrid**: Feature rows with host + author AC (recommended default)

---

## Question 1

**Personas**

A) **Recommended** — Reuse P-HOST, P-AUTHOR, P-REVIEWER; extend them in `personas.md` for `properties` map, inference, and addProperty

B) Add a new persona dedicated to “dynamic form” editing separate from P-AUTHOR

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Granularity**

A) **Recommended** — Standard — about one story per row in the proposed table (~5)

B) Compact — 3 stories (bind+save+inference, built-ins+addProperty, docs)

C) Thin slices — one story per FR (~9)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Breakdown**

A) **Recommended** — Hybrid — feature stories with both host and author acceptance criteria

B) User-journey only (one narrative from select → edit → Save)

C) Persona-based (host stories then author stories)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Acceptance criteria format**

A) **Recommended** — Gherkin (`Given` / `When` / `Then`) like host-properties stories

B) Bullet checklist only

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Prioritization within the set**

A) **Recommended** — Implement in proposed table order (bind/save → inference → built-ins → addProperty → docs)

B) Docs first, then UI

C) Add-property before inference

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Optional freeform

```text

```
