# U-DP-01 — Change Request Questions (Round 5)

You selected **Request Changes** after Round 4 (host **Nodes** strip above search; static seeds via card `properties`). Answer below so we can update before re-approval.

**Live**: `/try-ui` → Catalog **Host properties**  
**Layout**: Featured shapes → Default agents → **Nodes** strip → Search → Agents list  
**Static values**: `properties: { … }` on the palette / default-agent card

---

## Question 1
What still needs to change?

A) Nodes strip still wrong (position, look, or mixed with agents) — describe after [Answer]:

B) Properties panel wrong after drop/select — name which card after [Answer]:

C) Static `properties` seeds not applying / unclear where to set them

D) Try-host sample data only

E) Docs only

X) Other (please describe after [Answer]: tag below)

[Answer]: Nodes have a separate heading as node and they are displaying under them it should not look like them , they should be like condition, extraif. SAMPLE_HOST_PROPERTIES_PALETTES this shouldn't be separate, it should be part of SAMPLE_SOLUTION_PALETTES and I want to define some predefined properties in the library , so that if user doesn't add any properties in his config, we can display them from library

## Question 2
Where are you checking?

A) `/try-ui` with Catalog **Host properties**

B) `/try-ui` with a different Catalog preset

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

## Resolution (2026-08-20 Round 5)

1. **UI**: Host Actions appear in the **same shapes row** as Condition / Extra If (no separate Nodes heading).
2. **Samples**: Merged into `SAMPLE_SOLUTION_PALETTES` only (removed separate `SAMPLE_HOST_PROPERTIES_PALETTES`).
3. **Library fallback**: `host-properties.library.ts` — Action / AIAgent defaults when host omits `propertiesSchema` / `properties` (try **Library Default Action**).
