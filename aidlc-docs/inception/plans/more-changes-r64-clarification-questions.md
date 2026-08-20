# Remove connector double-click waypoints — Clarification Questions

**Increment**: More Changes R64  
**Context**: Single-click on a connector already opens the properties panel. Double-click currently **adds a waypoint** (the extra dots on the edge in your screenshot: `onEdgeDblClick` → `addWaypoint`).

Fill each `[Answer]:`, then reply in chat (e.g. `answered`).

---

## Question 1 — What should we remove?

A) **Recommended** — Remove **double-click to add a waypoint**. Single-click still selects the connector and opens properties. Auto-layout edge curves stay.

B) A, and also hide waypoint handles so those dots cannot be added, dragged, or shown

C) Remove the waypoint model entirely (including layout routing that stores midpoints)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2 — How should we proceed?

A) **Recommended** — Direct implement after these answers

B) Lightweight plan + your approval, then implement

C) Full AI-DLC stages

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3 — Extensions for this increment

A) **Recommended** — Carry forward R63 (Security Yes new-code; Resiliency directional DR N/A; PBT Partial)

B) Re-open Security / Resiliency / PBT opt-in

X) Other (please describe after [Answer]: tag below)

[Answer]: A
