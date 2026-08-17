# U-UI-02 Code Change Requests — Clarifications (round 1)

**Status**: ANSWERED — C1=A · C2=D · C3=A — contradiction; see r2 clarifications

**Locked from round 1**

| Q | Answer |
|---|---|
| Q1 | **X** — in canvas there is no option to hide the Vertical / Horizontal / Layered dropdown |
| Q2 | **X** — canvas |
| Q3 | **B** — `topBar.enabled: false` hides the top bar **and** JSON should apply without a hard refresh |
| Q4 | **A** — fix only requested pieces, then re-present Code Generation Complete |

---

## Contradiction 1: layout dropdown vs top-bar + hot-reload

Q1/Q2 ask for a **new canvas flag** for the Layout dropdown (Vertical / Horizontal / Layered).

Q3=B asks for **top-bar hide** (already wired) **plus JSON hot-reload** (no page refresh). It does not mention the layout dropdown.

Those are different slices of work.

Note: `canvas.zoomControls: false` already hides the **entire** bottom chrome bar (undo/redo, layout dropdown, and zoom +/−). There is no separate flag for the dropdown alone.

---

## Question 1

**What should this change round implement?**

A) Only add a flag to hide the Layout dropdown (Vertical / Horizontal / Layered), independent of zoom +/−

B) Only make JSON apply without a hard refresh (hot-reload `wb-ui-config.json`)

C) Both: layout-dropdown flag **and** JSON hot-reload

D) Layout-dropdown flag only; skip hot-reload (a browser refresh is enough)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 2

**If Q1 includes a layout flag, which key?** (if Q1 is B, pick D)

A) `canvas.layoutControls` — default true; `false` hides only the Layout select; zoom +/− stay if `canvas.zoomControls` is true

B) Hide the Layout dropdown whenever `canvas.zoomControls` is false (no new key; already true today because the whole bar is gated)

C) `canvas.layoutControls` as in A, and also hide undo/redo with that same flag

D) N/A — no new layout flag this round

X) Other (please describe after [Answer]: tag below)

[Answer]:D

---

## Question 3

**If Q1 includes JSON hot-reload, how?** (if Q1 is A or D, pick C)

A) Re-fetch `/assets/wb-ui-config.json` when the window/tab becomes visible (focus)

B) Poll the JSON every ~2s in dev mode only

C) Skip hot-reload this round; document that a full page refresh is required

X) Other (please describe after [Answer]: tag below)

[Answer]:A
