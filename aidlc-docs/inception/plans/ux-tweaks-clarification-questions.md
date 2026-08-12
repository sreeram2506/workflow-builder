# UX Tweaks — Clarification Questions

**Status**: ANSWERED — implemented (direct UX pass)

### Locked
| # | Answer |
|---|---|
| Q1 | B — Canvas (also moved Undo/Redo off top bar per Q3) |
| Q2 | A — visual polish / placement |
| Q3 | A — canvas bar bottom-center; Undo/Redo on canvas bar |
| Q4 | A — direct implement |

## Done
- Canvas chrome bar centered at bottom
- Undo / Redo removed from top bar; added to `wb-zoom-controls`
- Minimap remains bottom-right
- Keyboard ⌘/Ctrl+Z / Y shortcuts unchanged (still on TopBar host listener)


---

## Question 1 — Which surfaces?

Pick all that apply (comma-separated letters OK), or describe under Other.

A) Top bar (Run/Stop/Reset, view toggle, Import/Export, Undo/Redo, View badge)

B) Canvas (nodes, edges, selection, minimap, zoom/layout controls, status/error banners)

C) Nodes Library (palette search, categories, drag/click-to-add)

D) Properties panel (forms, Save, edge vs node)

E) Theme / overall spacing, typography, colors

X) Other (please describe after [Answer]: tag below)

[Answer]:B

---

## Question 2 — Nature of tweaks

A) Visual polish only (spacing, alignment, labels, icons, contrast) — no behavior change

B) Interaction polish (hover/focus, disabled states, keyboard, clearer affordances) — minor behavior OK

C) Both visual + interaction

D) Specific bugs / regressions that feel like UX issues (list under Other if needed)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 3 — Concrete changes

How should we capture the actual tweak list?

A) I’ll list them in chat / under Other below (recommended if you already know)

B) You propose a short prioritized polish pass for the surfaces from Q1, then I approve/edit

C) I’ll attach screenshots / Figma notes next (wait for those before coding)

X) Other (please describe after [Answer]: tag below)

[Answer]:A (refer Q1 that canvas bar should be in bottom middle and remove undo, redo icons from topbar add in canvas bar)

---

## Question 4 — Process depth

A) **Direct implement** — small UX pass; skip full AI-DLC re-inception (recommended for polish)

B) Lightweight plan + your approval, then implement

C) Full AI-DLC stages for this change set

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Optional freeform
If you already know the tweaks, list them here (bullets):

```text
refer Q1 that canvas bar should be in bottom middle and remove undo, redo icons from topbar add in canvas bar
```
