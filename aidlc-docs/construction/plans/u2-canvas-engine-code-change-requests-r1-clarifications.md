# U2 Code Change Requests — Clarifications (Round 1)

**Locked so far:** Q1 = A (pan / zoom / grid); Q4 = B (update docs).

**Blocked:** Q2 (“match exact workflowbuilder.io”) is not actionable without specifics. Q3 has no answer.

Fill each `[Answer]:`, then reply in chat when done. Screenshots of the reference vs our app help a lot.

---

## Question C1
**What specifically does not match** for pan / zoom / grid? (Pick one primary, or E and list bullets)

A) **Pan gesture** — wrong buttons/modifiers vs reference (describe expected gesture after [Answer]:)

B) **Zoom** — wrong origin, speed, bounds, or control behavior

C) **Grid** — wrong size, style (dots vs lines), or how it moves with the viewport

D) **Default viewport** — starting zoom/position wrong vs reference seed view

E) **Multiple** — list concrete bullets after [Answer]: (e.g. “grid dots too large”, “wheel zooms too fast”, “Space+drag missing”)

X) Other (please describe after [Answer]: tag below)

[Answer]: E ( 1. pan 2.gestures look and feel )

---

## Question C2
**Reference fidelity bar for U2 canvas navigation**

A) Match **behavior** (gestures + bounds) as closely as practical; visuals can stay on our tokens

B) Match **behavior and grid look** to the public product as closely as practical without new libraries

C) I will attach/describe exact differences in C1 / chat — implement only those listed items

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question C3
**Scope check** (was Q3 — required)

A) Visual/behavior polish within U2 only (no palette DnD, no connection drawing, no properties editing)

B) Allow small U2+ behavior if needed (describe in C1) — I will confirm before building anything outside U2

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---
