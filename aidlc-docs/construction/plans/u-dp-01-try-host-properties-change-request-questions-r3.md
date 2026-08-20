# U-DP-01 — Change Request Questions (Round 3)

You selected **Request Changes** after the fix that shows host **Action** cards (e.g. Timeout Action) in the solution Agents Library. Answer below so we can update before re-approval.

**Recent fixes**
- Live `[palettes]` schema + seed `properties` on drop
- Instance `[properties]` (map by `paletteKey` or `schemaFor`)
- Solution library lists host non-featured cards (Action), not only AIAgent

**Live**: `/try-ui` → Catalog **Host properties**

---

## Question 1
What still needs to change?

A) Timeout Action / other Action cards still not visible (or wrong place in the UI)

B) Properties panel fields / values wrong after drop or select

C) Instance `[properties]` API or docs unclear / incomplete

D) Try-host sample data only (add/remove/rename cards or fields)

E) Solution library should group or label host Actions differently (not mixed with agents)

X) Other (please describe after [Answer]: tag below)

[Answer]: properties config will be given to nodes and agents only, so think and make changes accordingly, do we need separate it from pallettes and agents or those will be with them only

## Question 2
Where are you checking?

A) `/try-ui` with Catalog **Host properties**

B) `/try-ui` with a different Catalog preset

C) Full SPA `/`

D) Embedded host outside this repo

X) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 3
Severity / scope?

A) Small fix (copy, layout, one sample, or one bug)

B) Behavior bug in library / Properties / schema binding

C) Broader redesign (how host catalogs or Properties are supplied)

X) Other (please describe after [Answer]: tag below)

[Answer]:B

---

## Resolution (2026-08-20 Round 3)

**Decision:** Properties stay **with** palettes and agents — not a third catalog.

| Supply | Role |
|---|---|
| `[palettes]` rows | Nodes — put `propertiesSchema` / seed `properties` on the card |
| `[defaultAgents]` cards | Agents — same fields supported |
| `[properties]` | Optional keyed override by `paletteKey` only (same keys as above) |

**UI:** Solution library splits **Agents** vs **Nodes** (Timeout Action under Nodes).  
**Try-host:** Sreeram default agent includes sample agent properties.  
**320** tests passing.
