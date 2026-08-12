# U5 Code Change Requests — Clarifications (Round 1)

**Recorded answers**

| Q | Answer | Notes |
|---|---|---|
| Q1 | X | Mouse-out Properties panel → collapse |
| Q2 | X | Call enso-suite `task/list` API and render results in **Nodes Library** (left palette) |
| Q3 | C | Labeled “bug fix only” — **conflicts** with Q2 (new backend + palette scope) |
| Q4 | B | Refresh docs if locks change |

**Blocking issues**

1. **Q1 vs Q2** are two different features (Properties collapse vs palette catalog from API).
2. **Q2 is not U5 Properties** — it is U3 Nodes Library + **backend HTTP**, which contradicts project lock: frontend-only / mock-in-memory / no backend.
3. **Q3 = C** does not match Q2’s scope (not a bug fix of locked U5 design).

Fill each `[Answer]:`, then reply in chat when done.

---

## Question C1 — Which changes to do **now**?

A) **Only Q1** — collapse Properties on mouse leave (pointer leave panel); stay within U5

B) **Only Q2** — palette from enso-suite API (requires scope override — see C2/C3)

C) **Both** Q1 and Q2 in this change round

D) **Neither** — describe a different change after `[Answer]:`

X) Other (please describe after `[Answer]:` tag below)

[Answer]:B

---

## Question C2 — Backend / no-backend lock (required if C1 includes Q2)

A) **Keep no-backend** — do **not** call enso-suite; reject Q2 for this project (or park for a future unit with mock data shaped like that API)

B) **Override** — allow HTTP to `http://enso-suite-be.red6.discovery.xpms.ai/api/canvas/task/list` from the Angular app for palette catalog (documents this exception)

C) **Proxy / mock** — add a local mock JSON shaped like the API response; no live network call

X) Other (please describe after `[Answer]:` tag below)

[Answer]:B

---

## Question C3 — If palette API is in scope, where does it land?

A) Implement under **U3 palette** files now (cross-unit), still as this “U5 change request” vehicle

B) **Park** palette API work until a dedicated unit / explicit U3 follow-up; only do Properties mouseout now

X) Other (please describe after `[Answer]:` tag below)

[Answer]:A

---

## Question C4 — Properties mouseout details (if C1 includes Q1)

A) Collapse when pointer **leaves** the Properties panel/chip root (`pointerleave`); ignore brief child transitions

B) Collapse only after a short delay (e.g. 300ms) after leave, cancel if pointer re-enters

C) Collapse on mouseout **and** keep current chip click to re-open

X) Other (please describe after `[Answer]:` tag below)

[Answer]:B

---

## Question C5 — Q3 severity (reconcile)

A) Treat Q1 mouseout as **small polish** (override Q3=C for that part)

B) Keep Q3=C only for true bugs; Q2 is a **scope override** if approved in C2

X) Other (please describe after `[Answer]:` tag below)

[Answer]:A

---

## After answers
Code changes start only when C1–C5 remove the conflicts above.
