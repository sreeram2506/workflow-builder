# U-DP-01 — Change Request Questions (Round 6)

You selected **Request Changes** after Round 5 (Actions in shapes row; samples in `SAMPLE_SOLUTION_PALETTES`; library fallback for Action / AIAgent). Answer below so we can update before re-approval.

**Current expected behavior**
- `/try-ui` → Catalog **Host properties** uses `SAMPLE_SOLUTION_PALETTES` (Timeout Action, Custom Widget, Library Default Action, …)
- Host Actions appear in the **same shapes row** as Condition / Extra If (no Nodes heading)
- If a card omits `propertiesSchema` / `properties`, library defaults from `host-properties.library.ts` apply

---

## Question 1
What still needs to change?

A) Shapes row UI still wrong (too many items, styling, icons, or Actions should not be there) — describe after [Answer]:

B) Properties panel wrong after drop/select — name which card / field after [Answer]:

C) Library fallback wrong (wrong defaults, wrong types, or should not apply in some cases) — describe after [Answer]:

D) Try-host sample data / Catalog presets only

E) Docs only

X) Other (please describe after [Answer]: tag below)

[Answer]: i want to set some default Properties for agents and other nodes but they can be configurable by setting true or false if user wants or if he wants he can add and remove but by default they should be set to true

## Question 2
Where are you checking?

A) `/try-ui` with Catalog **Host properties**

B) `/try-ui` with Catalog **Palettes** / **Palettes + defaults** / other preset

C) Full SPA `/`

D) Embedded host outside this repo

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3
Severity / scope?

A) Small fix (copy, layout, one sample)

B) Behavior bug in library / Properties / schema binding

C) Broader redesign

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Clarification needed (2026-08-20)

Q1 is ambiguous (true/false vs add/remove vs which defaults).  
See: `u-dp-01-try-host-properties-change-request-questions-r6-clarification.md`
