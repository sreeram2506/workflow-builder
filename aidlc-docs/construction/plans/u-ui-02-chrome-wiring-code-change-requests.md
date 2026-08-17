# U-UI-02 Code Generation — Change Requests (round 1)

**Status**: RESOLVED — round 1 + clarifications implemented; awaiting Code Generation re-approval

**Locked (after r2)**: **C** — `canvas.layoutControls` + JSON re-fetch on window/tab focus. Q4=A (code only; example JSON + embed/try flag rows updated so the new key is usable).

## Fixes applied

1. New flag `canvas.layoutControls` (default true). `false` hides only the Vertical / Horizontal / Layered dropdown; zoom +/− stay if `canvas.zoomControls` is true.
2. Re-fetch `/assets/wb-ui-config.json` on window `focus` and tab `visibilitychange` (cache-bust query). Refetch failure keeps previous features.
3. Example all-on / all-off JSON include `layoutControls`. Tests: 155 passed.

---

Chrome gates are already wired. JSON is loaded once at boot; omitted keys default **on**. `agentTabs.enabled` is independent of `topBar.enabled`.

---

## Question 1

**What needs to change?**

A) Bug — I set a flag in `src/assets/wb-ui-config.json`, hard-refreshed, and the matching chrome did not hide

B) JSON edits should apply without a hard refresh (watch / reload config)

C) Docs / try path — make hide-top-bar steps clearer (including `agentTabs` default-on)

D) Change gating rules (example: `topBar.enabled: false` should also hide agent tabs or floating Save/Export)

X) Other (please describe after [Answer]: tag below)

[Answer]:X ( in canvas i dont see option to hide dropdown of verticla horizontal and layered)

---

## Question 2

**Which chrome is wrong or should change?** (if Q1 is C or not UI-related, pick E)

A) Top bar (logo, title, status, theme, edit/view)

B) Agent tabs strip

C) Libraries / properties / canvas overlays (zoom, minimap, floating actions)

D) Multiple of A–C (list which after [Answer]:)

E) Not a chrome-visibility issue (docs, reload, tests only)

X) Other (please describe after [Answer]: tag below)

[Answer]:X ( canvas)

---

## Question 3

**Concrete outcome you want**

A) `topBar.enabled: false` removes the entire top bar (logo/theme/view/more); agent tabs stay unless `agentTabs.enabled` is also false

B) Same as A, plus reload JSON automatically when `wb-ui-config.json` changes (no full page refresh)

C) Keep current gates; only improve docs / examples for trying flags

D) Multiple of the above (list letters after [Answer]:)

X) Other (please describe after [Answer]: tag below)

[Answer]:B

---

## Question 4

**After changes**

A) Fix only the requested pieces, then re-present Code Generation Complete for approval

B) Also update related docs / aidlc-docs summaries to match

X) Other (please describe after [Answer]: tag below)

[Answer]:A
