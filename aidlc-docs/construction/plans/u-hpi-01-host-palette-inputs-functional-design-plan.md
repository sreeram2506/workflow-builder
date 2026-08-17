# U-HPI-01 Functional Design Plan — Host palette inputs

**Unit**: `u-hpi-01-host-palette-inputs`  
**Status**: APPROVED — GENERATION COMPLETE  
**Locked**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A · Q9=A  
**Stories**: US-HPI-01..06  
**Depends on**: U-PAL-02 COMPLETE  
**Next after FD approval**: Code Generation (NFR/Infra SKIP)

Fill `[Answer]:` for each question, then reply in chat. Functional design artifacts are not generated until this plan is approved.

Output dir (after approval): `aidlc-docs/construction/u-hpi-01-host-palette-inputs/functional-design/`

U-PAL-02 rules still apply when `[palettes]` is **omitted**. This plan only locks overlay behavior.

---

## Execution checklist (after plan approval)

- [x] Generate `business-logic-model.md`
- [x] Generate `business-rules.md`
- [x] Generate `domain-entities.md`
- [x] Generate `frontend-components.md`
- [x] Validate vs US-HPI-01..06

---

## Question 1

**Business logic — compose when `[palettes]` is present with items**

A) **Recommended** — Treat as a successful remote list (not empty-remote). Skip Enso and the provider adapter. Compose allow-listed featured types + `resolveDefaultAgents` + sanitized host rows. Featured Condition / Router / Repeater and default agents stay (US-HPI-01)

B) Host rows only — hide featured and default agents even when the parent sent items

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Domain — how is overlay presence passed into `loadCatalog`?**

A) **Recommended** — Extend `CatalogLoadOptions` with optional `hostPalettes?: PaletteItem[]` and `hostDefaultAgents?: DefaultAgentCard[]`. The sidebar **sets the key only when the input is not `undefined`**. Catalog uses `'hostPalettes' in options` / `'hostDefaultAgents' in options` (or equivalent) so `[]` is present

B) Always pass both keys; use a sentinel `{ omitted: true }` for omit

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Business rule — parent sent a non-empty `[palettes]` but every row is dropped (unknown `type` or invalid shape)**

A) **Recommended** — Still **not** empty-remote. Show featured + default agents (allow-listed). No parent cards. No error banner

B) Treat as empty-remote (empty-state only), because sanitized remote length is 0

C) Error path: static defaults + `catalogError` banner

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Data flow — when to reload the catalog**

A) **Recommended** — Reload when overlay inputs change **and** when `features().palette` changes (keep U-PAL-02 focus JSON reload)

B) Reload only on sidebar init

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Integration — `PaletteCatalogLoad.source` when overlay is present**

A) **Recommended** — Add `source: 'host'` for present `[palettes]` (including `[]`). Omit keeps `enso` / `adapter` / `static` / `empty`

B) Reuse `source: 'adapter'` for host overlay (no new source value)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6

**Error handling — invalid host rows**

A) **Recommended** — Skip per item (type not in `ALLOWED_NODE_TYPES`, missing `key` / `type` / `label`, or non-object). Remaining valid items still compose. No banner. Do not log tokens

B) Any invalid item fails the whole overlay → error path (static + banner)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7

**Business scenario — `[palettes]="[]"` together with `[defaultAgents]`**

A) **Recommended** — Empty palettes wins: library body is empty-state only (`palette-empty-remote`). Host `defaultAgents` are not shown for that load (same as U-PAL-02 empty-remote)

B) Show host `defaultAgents` even when palettes is `[]`

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 8

**Frontend — omit vs `[]` on the Angular input**

A) **Recommended** — `input<T[] | undefined>()` with **no default**. Unbound → `undefined` → omit (do not set overlay keys). `[palettes]="[]"` → present empty. Pass through `wb-shell-layout` / `wb-agent-skills-shell` → `wb-left-sidebar`. Featured / empty-state UI stays as U-PAL-02

B) Default the input to `[]` (cannot distinguish omit)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 9

**PBT / tests (NFR-HPI-04 Partial)**

A) **Recommended** — PBT on sanitize: unknown types and invalid shapes never appear in catalog `items`. Example-based tests for omit vs `[]` vs items, input-over-provider, skills shell, and `defaultAgents` present vs JSON

B) Example-based tests only (no PBT)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
