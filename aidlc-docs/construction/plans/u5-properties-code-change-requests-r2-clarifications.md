# U5 Code Change Requests R2 — Clarifications

**Recorded answers**

| Q | Answer | Notes |
|---|---|---|
| Q1 | B | Properties panel |
| Q2 | Show **entire configuration** in Properties; keep **static logical blocks** (condition, router, …); on **connection click** show **some config** |
| Q3 | C | Labeled bug fix — **conflicts** with Q2 (new scope vs locked U5 one-boolean + no edge props) |
| Q4 | B | Refresh docs if locks change |

**Blocking gaps**

1. “Entire configuration” source is unclear (enso task details vs list payload vs invent fields).
2. Static logical blocks list is incomplete (“condition router” …).
3. Edge/connection Properties were **explicitly out of scope** in U5 FD (Q7=A); need override confirmation + field list.
4. Q3=C does not match this expansion.

Fill each `[Answer]:`, then reply in chat when done.

---

## Question C1 — “Entire configuration” means what?

A) Render **all fields** from the selected node’s `data.ensoTask` (and nested config objects if present) as a dynamic form

B) Call enso **task details** API for the selected skill and render that full config schema (provide endpoint + sample if known)

C) Keep General fields + expand Configuration beyond the one boolean mock using a **fixed larger field list** you paste after `[Answer]:`

X) Other (please describe after `[Answer]:` tag below)

[Answer]:

---

## Question C2 — Static logical blocks in Nodes Library

A) Restore/keep **static** Flow/Logic items (**Condition**, **Decision/Router**, **Trigger**, **Action**, **Delay**, **End**, …) **in addition to** enso task categories

B) Static **only**: Condition + Router/Decision (plus list any others after `[Answer]:`); enso tasks remain separate categories

C) No static blocks — enso tasks only (reject that part of Q2)

X) Other (please describe after `[Answer]:` tag below)

[Answer]:

---

## Question C3 — Connection / edge Properties (override U5 non-goal?)

A) **Yes override** — selecting an edge shows a Properties form (fields in C4)

B) **No** — edges stay without Properties; only nodes

X) Other (please describe after `[Answer]:` tag below)

[Answer]:

---

## Question C4 — If C3=A, which edge fields (v1)?

A) Minimal: `label` (text) + `notes` (textarea) stored on edge (extend model)

B) Minimal: read-only `id` / `source` / `target` + editable `label`

C) You will paste the exact edge field list after `[Answer]:`

X) Other (please describe after `[Answer]:` tag below)

[Answer]:

---

## Question C5 — Reconcile severity (Q3=C)

A) Treat this round as a **design lock change** (override Q3 → B) and update FD/docs

B) Keep calling it a bug fix but only implement the **smallest** slice you confirm in C1–C4

X) Other (please describe after `[Answer]:` tag below)

[Answer]:

---

## After answers
Implementation starts only when C1–C5 are unambiguous.
