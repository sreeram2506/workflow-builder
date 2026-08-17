# U-UI-02 Code Generation — Change Requests (round 2)

**Status**: RESOLVED — awaiting Code Generation re-approval

**Locked**

| Q | Answer |
|---|---|
| Q1 | **X** — save/export/import/run/reset belong on canvas, not topBar |
| Q2 | **X** (same as Q1) |
| Q3 | **X** — update example JSON to match |

## Fixes applied

1. Canonical flags are now `canvas.save`, `canvas.export`, `canvas.import`, `canvas.run`, `canvas.reset`.
2. Legacy `topBar.save` (etc.) still work as aliases; same-layer `canvas.save` wins.
3. Example JSON + active `wb-ui-config.json` moved those keys under `canvas`.
4. Zoom controls and Save shortcut read `canvas.*`.

---

Fill `[Answer]:` for each question, then reply in chat. No code will be edited until then.

To hide the Layout dropdown now: set `"layoutControls": false` under `canvas` in `src/assets/wb-ui-config.json`, then click back into the browser.

---

## Question 1

**What needs to change?**

A) `canvas.layoutControls: false` still does not hide the Vertical / Horizontal / Layered dropdown after clicking back to the browser

B) Add more canvas flags (e.g. undo/redo, or something else still always visible)

C) JSON re-fetch on focus is unreliable — I still need a full refresh

D) Round 1 is fine; different chrome/docs issue (describe in Q2)

X) Other (please describe after [Answer]: tag below)

[Answer]:X ( whi in json   "save": true,
      "export": true,
      "import": true,
      "run": true,
      "reset": true, these are part of canvas right ?)

---

## Question 2

**Specific change** — closest match, plus extra notes after [Answer]: if needed

A) Fix layout-dropdown hide (bug)

B) New flag for undo/redo (keep layout and zoom independent)

C) Improve focus reload (also poll, or reload as soon as the JSON file changes)

D) Multiple of A–C (list letters after [Answer]:)

X) Other (please describe after [Answer]: tag below)

[Answer]:X 

---

## Question 3

**After changes**

A) Fix only the requested pieces, then re-present Code Generation Complete for approval

B) Also update related docs / aidlc-docs summaries to match

X) Other (please describe after [Answer]: tag below)

[Answer]:X ( after fixing above issue update examples json as well to uptodate )
