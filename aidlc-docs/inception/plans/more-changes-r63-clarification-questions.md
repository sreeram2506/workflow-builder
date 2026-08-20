# Hide nested Solution Back — Clarification Questions

**Increment**: More Changes R63  
**Context**: R62 shipped `agentTabs.doubleClick`. After enter with the tab strip off, the nested shell still shows a **Solution** pill (U-AE-01 nested Back). You want that gone because the parent already has a breadcrumb.

Fill each `[Answer]:`, then reply in chat (e.g. `answered`).

**Live UI**: nested `/agent/:id` with `agentTabs.enabled: false` — the **Solution** chip on the canvas overlay (screenshot).

---

## Question 1 — What should we hide?

A) **Recommended** — The nested **Solution** Back pill (`nested-back-to-solution`) only. Tab-strip Solution chip when the strip is on stays.

B) Hide the whole nested header overlay (including leftover empty bar)

C) Also hide the Solution chip on the tab strip when tabs are on

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2 — When should it stay hidden?

A) **Recommended** — When `agentTabs.enabled` is false **and** `agentTabs.doubleClick` is true (your enter-via-dblclick embed combo). Parent breadcrumb owns back. If the strip is on, chips stay.

B) Whenever `agentTabs.enabled` is false (even if `doubleClick` is false)

C) New chrome leaf so the parent can choose, e.g. `agentTabs.nestedBack` (default `true` keeps today’s pill)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3 — How should we proceed?

A) **Recommended** — Direct implement after these answers (hide the pill, tests, embed docs)

B) Lightweight plan + your approval, then implement

C) Full AI-DLC stages

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4 — Extensions for this increment

A) **Recommended** — Carry forward R62 (Security Yes new-code; Resiliency directional DR N/A; PBT Partial)

B) Re-open Security / Resiliency / PBT opt-in

X) Other (please describe after [Answer]: tag below)

[Answer]: A
