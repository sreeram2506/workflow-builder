# UX Tweaks — Follow-up Change Requests

**Status**: ANSWERED — bugfix applied

### Locked
| # | Answer |
|---|---|
| Q1 | X — position OK; Undo/Redo not working |
| Q2 | X — keep position |
| Q3 | X — Undo/Redo broken |

## Fix
Canvas `pointerdown` still ignored only `.chrome` after rename to `.chrome-bar` / `.chrome-minimap`, so clicks on Undo/Redo started pan. Ignore list updated to chrome-bar, chrome-minimap, `wb-zoom-controls`, `wb-minimap`.


---

## Question 1 — What should change?

A) **Bar position** — not bottom-center (pick placement in Q2)

B) **Undo/Redo** — different home (e.g. back to top bar, or elsewhere)

C) **Bar contents** — add/remove other controls (describe under Other)

D) **Minimap** — adjust position relative to the bar

E) **Multiple of the above** (list letters + details under Other)

X) Other (please describe after [Answer]: tag below)

[Answer]:X ( position is good but functionality is not working)

---

## Question 2 — Preferred canvas bar placement (if Q1 involves position)

A) Bottom **center** (current)

B) Bottom **left**

C) Bottom **right** (with minimap stacked or above)

D) Top of canvas (below top bar), centered

X) Other (please describe after [Answer]: tag below)

[Answer]:X ( position is good check Q1)

---

## Question 3 — Undo / Redo placement (if Q1 involves history)

A) Keep on canvas bar (current)

B) Restore to **top bar** only

C) Show on **both** top bar and canvas bar

X) Other (please describe after [Answer]: tag below)

[Answer]:X ( undo redo functionality not working )

---

## Optional freeform
Describe exactly what you want (bullets OK):

```text

```
