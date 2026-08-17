# U-PAL-01 Functional Design Plan — Palette config core

**Unit**: `u-pal-01-palette-config-core`  
**Status**: APPROVED  
**Stories**: US-PAL-01, US-PAL-02, US-PAL-03, US-PAL-04  
**Next after FD approval**: Code Generation (NFR/Infra SKIP)  
**Locked FD**: Q1=B · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A · Q9=A · Q10=A · Q11=A

Functional design artifacts generated; awaiting FD approval.

Output dir (after approval): `aidlc-docs/construction/u-pal-01-palette-config-core/functional-design/`

---

## Execution checklist (after plan approval)

- [x] Generate `business-logic-model.md`
- [x] Generate `business-rules.md`
- [x] Generate `domain-entities.md`
- [x] Generate `frontend-components.md` (minimal — no sidebar; helpers only)
- [x] Validate vs US-PAL-01..04

---

## Question 1

**Domain model — how is an allow-list represented after merge?**

A) Optional array on resolved `UiFeatures`: `palette.solution.types?: string[]` (`undefined` = show all, `[]` = none)

B) **Recommended** — always-present discriminated state: `{ mode: 'all' } | { mode: 'only', types: string[] }` (`[]` = `only` + empty). JSON/provider still use optional arrays.

C) Always a string array on resolved features; omitted JSON becomes a magic `*` entry

X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2

**Business rule — unknown type keys in an allow-list** (e.g. `"Foo"` or `"router"`)

A) **Recommended** — keep only known `NodeType` keys (`Condition`, `Decision`, `Repeater`, `AIAgent`, `Trigger`, `Action`, `Delay`, `End`, `Notification`); drop unknown strings; do not invalidate the file

B) Keep unknown strings (they match no catalog rows)

C) Any unknown type invalidates the whole JSON (`loadStatus.invalid`)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Business rule — invalid `defaultAgents` cards** (missing `key`, non-string `label`, etc.)

A) **Recommended** — require non-empty `key` and `label`; `description` defaults to `''`; extra fields ignored; skip invalid cards; remaining valid cards still apply (including `[]` if all skipped)

B) Any invalid card → treat `defaultAgents` as **omitted** (Blank Agent)

C) Any invalid card → whole JSON `invalid`

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Business scenario — duplicate `defaultAgents` keys**

A) **Recommended** — last card with that `key` wins (stable unique list)

B) First card wins

C) Keep duplicates as separate palette rows

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Data flow — merging `types` / `defaultAgents` across layers**

A) **Recommended** — if the key is **present** on a layer, the **whole array replaces** the lower layer (not concat, not element-wise union). Omitted key leaves the lower layer unchanged.

B) Concatenate / union arrays across JSON and provider

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6

**Integration — helper purity**

A) **Recommended** — `filterPaletteItemsByAllowList` and `resolveDefaultAgents` are **pure** (explicit args, no `UiConfigService` inject). Catalog (U-PAL-02) will pass `features().palette`.

B) Helpers read `UiConfigService` internally

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7

**Error handling — `palette` / `palette.solution` / `palette.agent` not a plain object** (or `types` not an array)

A) **Recommended** — ignore that group/key (treat as omitted), consistent with U-UI-01 unknown/non-boolean policy; do not invalidate the whole file

B) Mark whole JSON `invalid` and fall back to chrome defaults only

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 8

**Frontend components in this unit**

A) **Recommended** — **no UI** in U-PAL-01. `frontend-components.md` records “helpers + config only”; sidebar stays U-PAL-02

B) Add a temporary debug readout of `palette` in the shell

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 9

**Business scenario — `defaultAgents` present, `types` omitted**

A) **Recommended** — show **all current solution types**, but Blank Agent is **replaced** by the default-agent cards (FR-PAL-03)

B) Present `defaultAgents` implies only `AIAgent` types (hide Condition/Router/Repeater unless listed)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 10

**PBT for this unit**

A) **Recommended** — fast-check on allow-list filter (every output `type` is in the list when `mode: 'only'`) and on defaultAgents omit/`[]`/present + AIAgent gate

B) Table-driven unit tests only; skip fast-check this unit

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 11

**Domain — JSON type key `"Router"`**

A) **Recommended** — only `Decision` is valid (UI label remains Router). `"Router"` is unknown and dropped (Q2)

B) Alias: `"Router"` normalizes to `Decision`

X) Other (please describe after [Answer]: tag below)

[Answer]: A
