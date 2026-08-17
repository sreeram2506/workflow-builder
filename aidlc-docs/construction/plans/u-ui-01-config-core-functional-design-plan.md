# U-UI-01 Functional Design Plan — Config Core

**Unit**: `u-ui-01-config-core`  
**Status**: APPROVED — ARTIFACTS GENERATED  
**Stories**: US-UI-01, US-UI-07  
**Next after FD approval**: Code Generation (NFR/Infra SKIP)

**Locked FD**: Q1=C · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A · Q9=A

Output dir: `aidlc-docs/construction/u-ui-01-config-core/functional-design/`

---

## Execution checklist

- [x] Generate `business-logic-model.md`
- [x] Generate `business-rules.md`
- [x] Generate `domain-entities.md`
- [x] Generate `frontend-components.md` (minimal — status exposure only; no chrome gates)
- [x] Validate vs US-UI-01 / US-UI-07

---

## Question 1 — Domain model: feature tree shape

A) **Lock App Design inventory** as nested interfaces (`topBar`, `agentTabs`, `agentsLibrary`, `skillsLibrary`, `propertiesPanel`, `canvas`, optional `themeToggle` alias field)

B) Flat dotted record only (`Record<UiFeaturePath, boolean>`) with no nested object runtime shape

C) Nested runtime object + derived path index for `is()`

X) Other (describe after [Answer]:)

[Answer]: C

---

## Question 2 — Business rule: unknown / non-boolean JSON keys

A) **Ignore unknown keys**; coerce only known boolean leaves; non-booleans on known keys → treat as omitted (keep lower-layer value)

B) Unknown keys fail the whole JSON file → soft-fail to defaults + `invalid` status

C) Unknown keys ignored; non-boolean on known key → `invalid` for whole file

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 3 — Data flow: JSON asset URL

A) **`assets/wb-ui-config.json`** (Angular `src/assets` → `/assets/...`)

B) **`public/wb-ui-config.json`** (served at `/wb-ui-config.json`)

C) No file fetch in U-UI-01 — only provider + in-memory defaults; HTTP load deferred to U-UI-02

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 4 — Error handling: where does load status surface?

A) **`UiConfigService.loadStatus()` only** in U-UI-01; shell banner wiring in U-UI-02

B) Also set a non-blocking message on existing **`UiStore.bootstrapError`** / facade (risk: conflates workflow bootstrap failures)

C) New dedicated **`uiConfigWarning`** signal on UiStore for non-blocking config messages

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 5 — Business rule: `is(path)` when path is mistyped / not in union

A) **Compile-time only** — `UiFeaturePath` union; at runtime unknown string → **default true** (fail-open) + optional dev warning

B) Runtime unknown → **false** (fail-closed)

C) Runtime unknown → **throw** in dev; true in prod

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 6 — `themeToggle` vs `topBar.theme`

A) **Alias** — `themeToggle` in JSON/provider maps to same leaf as `topBar.theme`; reading either reflects merged value (last writer wins if both set in same layer)

B) Independent flags (both must be true for theme control — unlikely)

C) Only `topBar.theme`; drop `themeToggle` key in v1

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 7 — Merge layer order confirmation

A) Confirm: **defaults → JSON → provider token** (provider wins); partial deep-merge at each step

B) defaults → provider → JSON (JSON wins) — override App Design

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 8 — PBT / scenarios for merge

A) **Recommended** — fast-check: random partial trees; assert omitted keys retain base; provider overlay wins; defaults all true; deep nest independently

B) Unit tests only (table-driven); skip fast-check this unit

X) Other (describe after [Answer]:)

[Answer]: A

---

## Question 9 — HTTP failure modes (initializer)

A) **404 / network / parse error** all → defaults + status `missing` or `invalid` (distinguish when possible); never block app bootstrap beyond the attempt

B) Retry once then soft-fail

C) Only treat parse errors as invalid; 404 → silent defaults with status `ok` (no warning)

X) Other (describe after [Answer]:)

[Answer]: A
