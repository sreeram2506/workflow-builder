# U-LIM-01 Functional Design Plan — Host logic extras + agent metadata

**Unit**: `u-lim-01-logic-icons-metadata`  
**Status**: GENERATION COMPLETE — AWAITING STAGE APPROVAL  
**Locked FD**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A  
**Stories**: US-LIM-01..04  
**App Design locks**: `icon-url.ts`; `featuredLogicItems`; sidebar icons; factory `data.metadata`; no new injectable  
**UoW locks**: Q1=A · Q2=A · Q3=A · Q4=A  
**Next after FD approval**: Code Generation (NFR/Infra SKIP)

Output dir: `aidlc-docs/construction/u-lim-01-logic-icons-metadata/functional-design/`

Fill every `[Answer]:`, then reply in chat (for example `answered`).

---

## Execution checklist (after plan approval)

- [x] Generate `business-logic-model.md`
- [x] Generate `business-rules.md`
- [x] Generate `domain-entities.md`
- [x] Generate `frontend-components.md`
- [x] Include Testable Properties (PBT Partial)
- [x] Validate vs US-LIM-01..04

---

## Question 1

**Business rule — relative icon URLs**

A) **Recommended** — Allow paths starting with `/` or `./` with no scheme and no `//`. Reject `../` traversal, `http:`, protocol-relative `//host`

B) Allow any string without `:` (including `../`)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Business logic — when is host palettes “present” for featured replace?**

A) **Recommended** — After sanitize, `hostPalettes` is a defined array with **length &gt; 0**. Omit = static first-of-type three. `[]` = existing empty-remote (strip hidden). Non-empty = compose omits static featured types; helper lists all remaining Condition/Decision/Repeater

B) Any defined `[palettes]` including `[]` counts as present (would conflict with empty-remote)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Domain — metadata copy**

A) **Recommended** — Shallow copy `{ ...obj }` for `metadata` and `taskMeta` at sanitize and at drop. Nested objects are shared references (host must not mutate after bind). Drop arrays/null/non-objects

B) `structuredClone` / JSON round-trip (lossy for `undefined` / functions)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Error handling — `iconPath`**

A) **Recommended** — Keep a non-empty string as SVG `d`. Do not interpret as HTML. Empty / non-string → absent. No extra XSS parser beyond not using innerHTML

B) Reject any `iconPath` containing `<` or `javascript`

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Frontend — broken image**

A) **Recommended** — Per-item failed-url set in the sidebar. `(error)` on `<img>` adds the item key; that row shows the type glyph until a new `iconUrl` is bound

B) Hide the entire icon well on any image error

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6

**PBT (Partial — PBT-02/03/07/08/09)**

A) **Recommended** — Properties: (1) Invariant — invalid URLs never returned by `sanitizeIconUrl`. (2) Invariant — valid `https:` / allowed relative / allowed raster data URLs round-trip as the same string. (3) Invariant — `featuredLogicItems` with `hostPalettesPresent=true` never includes built-in keys `Condition`/`Decision`/`Repeater` if those were excluded from input; with false, at most one of each type. (4) Invariant — non-object metadata omitted. Document sanitize as **lossy** (no inverse) so PBT-02 round-trip applies only to the *accepted* URL subset

B) Example tests only (no new PBT)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7

**Edge case — duplicate keys**

A) **Recommended** — Keep existing last-key-wins on JSON defaultAgents. Host palettes: keep current sanitize order (no new dedupe unless already present)

B) Dedupe palettes by `key` (last wins) in this increment

X) Other (please describe after [Answer]: tag below)

[Answer]: A
