# U-HP-01 Functional Design Plan — Generic host-driven Properties

**Unit**: `u-hp-01-host-properties`  
**Status**: STAGE APPROVED — CG PLAN OPEN  
**Locked FD**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A  
**Stories**: US-HP-01..04  
**App Design locks**: New `host-properties.schema.ts`; pure resolve; sync `schemaFor`; delete flatten; unknown widget = disabled text  
**UoW locks**: Q1=A · Q2=A · Q3=A · Q4=A  
**Next after FD approval**: Code Generation (NFR/Infra SKIP)

Output dir: `aidlc-docs/construction/u-hp-01-host-properties/functional-design/`

Fill every `[Answer]:`, then reply in chat (for example `answered`). Functional design artifacts will not be generated until this plan is approved.

---

## Execution checklist (after plan approval)

- [x] Generate `business-logic-model.md`
- [x] Generate `business-rules.md`
- [x] Generate `domain-entities.md`
- [x] Generate `frontend-components.md`
- [x] Include Testable Properties (PBT Partial)
- [x] Validate vs US-HP-01..04

---

## Question 1

**When does `node.data.propertiesSchema` win?**

A) **Recommended** — A non-null plain object (not an array) wins, including `{}`. Sanitize skips bad fields; empty Configuration is OK; do **not** fall through to adapter or logic built-ins.

B) Win only when `sections` is a non-empty array before sanitize

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Adapter `schemaFor` throws or returns a non-object**

A) **Recommended** — Treat as no adapter schema; continue to logic built-ins or General only. Do not crash Properties.

B) Show General only and skip built-ins as well (hard fail)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Save coerce (paths on `node.data`)**

A) **Recommended** — `boolean` → true/false; `number` → `Number` (required empty still blocks Save); `text`/`textarea`/`select` → string; `multiselect` → `string[]`. Hidden fields are not written from the form.

B) Store every non-boolean as a string (including numbers and multiselect)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Host palettes overlay — copy `propertiesSchema`?**

A) **Recommended** — `sanitizeHostPaletteItems` copies a plain-object `propertiesSchema` onto the palette item (same as `metadata` / `taskMeta`) so drop still works for `[palettes]`

B) Only copy in `createWorkflowNodeFromPaletteItem`; overlay sanitize ignores `propertiesSchema`

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**PBT (Partial — PBT-02/03/07/08/09)**

A) **Recommended** — Invariants: (1) sanitize never keeps a field whose path contains `..` or is empty. (2) first-win: if node schema is a plain object, result is never the logic built-in schema for that type. (3) `taskMeta` keys are not turned into fields (no-walk). Document sanitize as **lossy** (no inverse / no PBT-02). Example tests for Save-to-path and unknown widget.

B) Example tests only (no new PBT)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6

**Logic built-in Repeater options (when no host schema)**

A) **Recommended** — Keep empty workflow/version option lists (U-RAD-03). Do not clear existing `repeater.workflowId` / `versionId`. Host schema on a Repeater **replaces** those fields (connectors unchanged).

B) When a host schema is on a Repeater, also hide connector UI (would break US-HP-02)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7

**Frontend — host sections**

A) **Recommended** — Render each schema `section` as a heading plus fields using the existing Properties field controls. General stays first. Unknown `ui_component` → disabled text input. No new chrome region.

B) Flatten all fields with no section headings

X) Other (please describe after [Answer]: tag below)

[Answer]: A
