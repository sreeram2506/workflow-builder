# U-DP-01 — Change Request Questions (Round 4)

You selected **Request Changes** after Round 3 (properties stay with palettes/agents; library **Agents** vs **Nodes**; default-agent `propertiesSchema`). Answer below so we can update before re-approval.

**Live**: `/try-ui` → Catalog **Host properties**  
**Try**: Timeout Action under **Nodes**; Sreeram under default-agent strip (agent properties sample)

---

## Question 1
What still needs to change?

A) Library layout / labels (Agents vs Nodes, default-agent strip, featured shapes)

B) Properties panel wrong for a node or agent after drop/select — name which card after [Answer]:

C) How schemas are supplied (`propertiesSchema` on cards vs optional `[properties]` map) still wrong or confusing

D) Try-host sample data only (add/remove/rename fields or cards)

E) Docs only

X) Other (please describe after [Answer]: tag below)

[Answer]: nodes should not come under search bar they should be part of pallettes above other than agents, there is not seaparate place for them and also i want to pass some static properties where can i add them 

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

A) Small fix (copy, one sample, layout tweak)

B) Behavior bug in library / Properties / schema binding

C) Broader redesign of host properties supply

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Resolution (2026-08-20 Round 4)

1. **Nodes strip** moved **above** the search bar (with featured shapes / default agents), not under Agents search.
2. **Static properties**: set `properties: { … }` on the palette or default-agent card → copied to `node.data.properties` on drop (see Timeout Action / Sreeram in try-host).
