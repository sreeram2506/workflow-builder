# Unit of Work Plan — Logic Node Properties Increment

**Status**: GENERATION COMPLETE — AWAITING UNITS APPROVAL  
**Requirements**: `logic-nodes-requirements.md`  
**Stories**: US-LN-01..07  
**Application Design**: SKIPPED (approved execution plan). Units use existing U2/U5 components.  
**Original U1–U8**: unchanged. This increment adds a new unit after U8.

Fill each `[Answer]:`, then reply in chat (e.g. `answered`). Generation does not start until this plan is approved.

**Recommended defaults**: Q1=A, Q2=A, Q3=A, Q4=A, Q5=A, Q6=A (one unit `u9-logic-nodes`, all seven stories, extend existing folders).

### Locked planning decisions (agent-filled; user authorized)

| # | Decision |
|---|---|
| Q1 | One unit `u9-logic-nodes` for US-LN-01..07 |
| Q2 | Single unit; internal order models/schema -> rules -> UI -> connect -> tests |
| Q3 | Single owner, sequential |
| Q4 | Same Angular SPA; no new package |
| Q5 | One Logic nodes bounded context |
| Q6 | Extend existing `core/domain` + Properties/canvas folders |

---

## Part A — Clarifying Questions

### Question 1 — Story grouping

How should US-LN-01..07 be grouped into units?

A) One unit `u9-logic-nodes` containing all seven stories (properties + edges + uniqueness + view mode)

B) Two units: U9 Properties (US-LN-01, 02, 03, 06, 07) then U10 Edges (US-LN-04, 05)

C) Three units: Condition (01+04), Router (02+05+06), Repeater (03+06+07)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 2 — Dependencies / integration

If more than one unit is chosen, how should they integrate?

A) Not applicable — single unit (use this if Q1=A). Internal build order: models/schema -> pure rules -> Properties UI -> connect gesture -> tests

B) Sequential units: finish Properties unit (including uniqueness) before Edges unit

C) Parallel units sharing `WorkflowEdge.condition` from a thin shared helper done first

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 3 — Team alignment

Who owns this increment?

A) Single owner, sequential construction (matches how U1–U8 were built)

B) Split Properties vs Edges across two owners (only makes sense if Q1=B)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 4 — Technical / deployment

Does this increment change how the app is built or deployed?

A) No — same Angular SPA, same `npm test` / `npm start` / `npm run build`

B) Yes — add a new Angular library/package for logic-node rules

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 5 — Business domain

How should domain boundaries be treated?

A) One bounded context: Logic nodes (Condition, Router, Repeater, connectors)

B) Three bounded contexts (Condition vs Router vs Repeater) even if implemented in one SPA

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

### Question 6 — Code organization

This is a brownfield increment, not greenfield multi-unit. Where should new code live?

A) Extend existing folders: `core/domain` (schema, models, pure rules), `features/shell` (Properties), canvas connect in existing canvas feature. No new top-level feature app.

B) Add `src/app/features/logic-nodes/` as a new feature folder owning UI + rules

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Part B — Proposed catalog if defaults are accepted

| Unit | Stories | Responsibility |
|---|---|---|
| U9 Logic Nodes | US-LN-01..07 | Type-specific Properties; Condition true/false max-2; Router connector Name+Condition; uniqueness; view-mode inspect |

Depends on: U5 Properties, U4 Connections, U2 Canvas, U1 stores/facade.

---

## Part C — Generation checklist (do not execute until plan approved)

- [x] Generate `aidlc-docs/inception/application-design/logic-nodes-unit-of-work.md` (definitions; brownfield: note extend-existing org, do not rewrite U1–U8 catalog)
- [x] Generate `aidlc-docs/inception/application-design/logic-nodes-unit-of-work-dependency.md`
- [x] Generate `aidlc-docs/inception/application-design/logic-nodes-unit-of-work-story-map.md` (all US-LN-* assigned)
- [x] Skip greenfield code-organization rewrite (Q6 brownfield)
- [x] Validate unit boundaries and dependencies
- [x] Ensure all US-LN-01..07 are assigned
