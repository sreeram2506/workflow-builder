# U-DP-01 — Change Request Questions (Round 10)

You selected **Request Changes** after Round 9 (single **General** section with Name + Description; host fields merge on top; try-host mostly General-only). Answer below so we can update before re-approval.

**Current expected behavior**
- Every node/agent: Properties show **General → Name + Description** by default
- Name seeded from palette/agent label; Save syncs Name ↔ canvas label, Description ↔ subtitle
- Consumer-added fields via `propertiesSchema` / `properties` / `[properties]` merge on top of General
- Condition / Repeater still show **logic built-ins** (expression, workflow id, …) above General
- Try `/try-ui` → Catalog **Host properties**; optional demo card **Host Extra Props**

---

## Question 1
What still needs to change?

A) Logic built-ins (Condition expression / Repeater fields / etc.) should be hidden until host configures them — describe after [Answer]:

B) General Name / Description wrong (binding, labels, seeds, or section title) — describe after [Answer]:

C) Host-added properties merge / display wrong — name card or config after [Answer]:

D) Try-host samples / docs only

E) Agents vs nodes still differ somehow — describe after [Answer]:

X) Other (please describe after [Answer]: tag below)

[Answer]: General section should be at the top and do we need both properties and propetyschema , can we set it into one ?

## Question 2
Where are you checking?

A) `/try-ui` with Catalog **Host properties**

B) `/try-ui` with a different Catalog preset

C) Full SPA `/`

D) Embedded host outside this repo

E) Code / docs review only

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3
Severity / scope?

A) Small fix (copy, one sample, docs)

B) Behavior bug in Properties / library / merge

C) Broader redesign

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Partial resolution (2026-08-20)

1. **General at top** — host/General sections render above logic built-ins in the Properties panel.
2. **properties vs propertiesSchema** — see `u-dp-01-try-host-properties-change-request-questions-r10-clarification.md`.
