# U-UI-02 Code Change Requests — Clarifications (round 2)

Round 1 clarifications still conflict. **Pick one option below.** No code until this is answered.

**Locked (round 1 clarifications)**

| Q | Answer |
|---|---|
| C1 | **A** — only add a Layout dropdown flag (no hot-reload) |
| C2 | **D** — no new layout flag this round |
| C3 | **A** — re-fetch JSON on window/tab focus |

**Why this is blocked**

- C1=A and C2=D disagree: add a layout flag vs add no layout flag.
- C1=A and C3=A disagree: skip hot-reload vs implement hot-reload on focus.

Original request still stands: hide the Vertical / Horizontal / Layered dropdown.

---

## Question 1

**Implement this in this change round (choose exactly one):**

A) Add `canvas.layoutControls` (default true). `false` hides only the Layout dropdown. Zoom +/− stay if `canvas.zoomControls` is true. No JSON hot-reload.

B) Re-fetch `/assets/wb-ui-config.json` when the window/tab becomes visible. No new layout flag.

C) Both A and B: layout flag **and** JSON re-fetch on focus.

X) Other (please describe after [Answer]: tag below)

[Answer]:C

---

## Locked

**C** — add `canvas.layoutControls` **and** re-fetch JSON on window/tab focus.

**Status**: RESOLVED — implemented; awaiting Code Generation re-approval

