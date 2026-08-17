# U-UI-02 Code Generation — Change Requests (round 3)

**Status**: RESOLVED — awaiting Code Generation re-approval

**Locked**

| Q | Answer |
|---|---|
| Q1 | **X** — canvas false must not hide graph; zoom false must not hide entire canvas; remove Back button |
| Q2 | **X** (same as Q1) |
| Q3 | **B** — also update docs / example JSON |

## Fixes applied

1. `canvas.enabled: false` hides canvas chrome (zoom bar, minimap, floating actions) only. Grid, nodes, and edges stay.
2. `canvas.zoomControls: false` hides zoom +/− / 100% only. Save cluster and layout stay if their flags are true.
3. Removed the top-bar Back button and `topBar.back` from the feature map / examples.

---

Fill `[Answer]:` for each question, then reply in chat. No code will be edited until then.

Note: `canvas.enabled: false` unmounts the whole canvas host, so zoom / minimap / floating actions / layout also disappear even if those child flags are `true`.

---

## Question 1

**What needs to change?**

A) When `canvas.enabled` is false I still see canvas chrome (or the opposite: I want overlays even with canvas off)

B) Another JSON grouping mismatch (a flag lives under the wrong parent — describe in Q2)

C) A flag does not hide the matching control after clicking back to the browser

D) Docs / examples still show old `topBar.save` keys as the primary shape

X) Other (please describe after [Answer]: tag below)

[Answer]:X ( when canvas is false its hiding the background also nodes connecting area 2.when canvas zoom set to false its hiding entire canvas 3. remove back button on topbar not needed)

---

## Question 2

**Specific change**

A) Keep current rule: `canvas.enabled: false` hides canvas + all canvas overlays

B) Allow overlay flags (zoom, minimap, floating actions, layout) even when `canvas.enabled` is false

C) Move or add a specific flag (name it after [Answer]:)

D) Fix hide-not-working for a specific path (name it after [Answer]:)

X) Other (please describe after [Answer]: tag below)

[Answer]:X ( mentioned in Q1)

---

## Question 3

**After changes**

A) Fix only the requested pieces, then re-present Code Generation Complete for approval

B) Also update related docs / example JSON to match

X) Other (please describe after [Answer]: tag below)

[Answer]:B
