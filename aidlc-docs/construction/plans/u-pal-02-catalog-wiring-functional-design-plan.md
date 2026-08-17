# U-PAL-02 Functional Design Plan — Catalog wiring + docs

**Unit**: `u-pal-02-catalog-wiring`  
**Status**: APPROVED  
**Stories**: US-PAL-05, US-PAL-06, US-PAL-07  
**Depends on**: U-PAL-01 Build and Test approved  
**Next after FD approval**: Code Generation (NFR/Infra SKIP)  
**Locked FD**: Q1=A · Q2=A · Q3=X/3b=C · Q4=A · Q5=A · Q6=A · Q7=A · Q8=B · Q9=A · Q10=A · Q11=A

Functional design artifacts generated; awaiting FD approval.

**Q3 refinement**: HTTP 200 with 0 remote rows → library **empty-state only** (no static featured / defaultAgents). Thrown/HTTP adapter errors still Q9=A (static defaults + banner, no mocks).

Output dir (after approval): `aidlc-docs/construction/u-pal-02-catalog-wiring/functional-design/`

---

## Execution checklist (after plan approval)

- [x] Generate `business-logic-model.md`
- [x] Generate `business-rules.md`
- [x] Generate `domain-entities.md`
- [x] Generate `frontend-components.md`
- [x] Validate vs US-PAL-05..07

---

## Question 1

**Domain — what does a host catalog adapter return?**

A) **Recommended** — remote **rows only** (`items` + optional `categories`). `EnsoTaskCatalogService` composes static defaults, applies U-PAL-01 helpers, sets `error` / `source`

B) Full `PaletteCatalogLoad` (host must compose static + filter itself)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 2

**Integration — adapter injection (App Design Q2=C)**

A) **Recommended** — optional tokens `WORKFLOW_BUILDER_CATALOG_SOLUTION` and `WORKFLOW_BUILDER_CATALOG_AGENT`; `provideWorkflowBuilderUi({ catalog: { solution?, agent? } })` provides them. Omit = Enso for that canvas

B) Replace `EnsoTaskCatalogService` entirely with a host class (no Enso fallback in DI)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 3

**Business rule — empty remote list** (0 pipelines/tasks, HTTP 200)

A) **Recommended** — treat like failure: static defaults only, non-blocking `error` message, **no** mocks (FR-PAL-05)

B) Success with no banner; static + zero remote rows

X) Other (please describe after [Answer]: tag below)

[Answer]: X ( show some empty sate inside that)

---

## Question 3b

**Empty remote list — what is on screen?** (HTTP 200, 0 pipelines/tasks; **not** a thrown/HTTP error)

Static featured types + `defaultAgents` still follow the allow-list (no `MOCK_SOLUTION_AGENTS`).

A) **Static defaults + empty-state in the adapter/agents list** — no error banner (empty is not a failure)

B) Static defaults + **error banner** + empty-state in the adapter/agents list

C) **No** static defaults; the library body is only an empty-state message (canvas still works)

X) Other (please describe after [Answer]: tag below)

[Answer]:C

---

## Question 4

**Error handling — banner copy**

A) **Recommended** — keep existing `catalogError` banner; rewrite messages so they never say “mock agents”; never include tokens

B) New separate palette-config banner besides catalog error

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 5

**Frontend — default-agent cards vs adapter agent rows**

A) **Recommended** — tag default-agent `PaletteItem`s (`origin: 'default-agent'` or equivalent). Sidebar **ngFor** those in the current Blank Agent slot (0..N). Adapter `AIAgent` rows stay in the agents list. No `blankAgentPaletteItem()` fallback

B) Sidebar calls `resolveDefaultAgents` itself (catalog still filters types)

C) Put all `AIAgent` without `taskId` in the Blank Agent slot

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 6

**Frontend — featured strip**

A) **Recommended** — Condition / Router / Repeater from **filtered** `allItems()` only (drop “always from full catalog”). One strip, existing order

B) Hide the whole featured strip if any of the three types is disallowed

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 7

**Business — `MOCK_SOLUTION_AGENTS`**

A) **Recommended** — remove from all compose paths; delete `mock-agents.catalog.ts` if nothing else imports it

B) Keep the file unused

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 8

**Data flow — catalog reload when JSON is re-fetched on window focus**

A) Load catalog once in sidebar `ngOnInit` (palette JSON changes need a full refresh / remount)

B) **Recommended** — reload catalog when `features().palette` changes (covers focus JSON reload)

X) Other (please describe after [Answer]: tag below)

[Answer]:B

---

## Question 9

**Adapter errors**

A) **Recommended** — any throw / Observable error / invalid shape → static defaults + banner; do not log Authorization or tokens

B) Surface adapter exceptions in the console as `error` objects (may leak headers)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 10

**Docs / examples (US-PAL-07)**

A) **Recommended** — extend `docs/workflow-builder-ui-embed.md` and `docs/workflow-builder-ui-config-try.md`; add `src/assets/examples/` JSON with allow-list + `defaultAgents`; keep active `wb-ui-config.json` as `{}`; adapters documented as **provider-only**

B) Put palette samples in the active `wb-ui-config.json` (changes default demo SPA)

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Question 11

**Frontend — drag-and-drop for 0..N default agents**

A) **Recommended** — one CDK list for the default-agent strip (same pattern as featured), each card still a drag source

B) Keep a separate CDK list per card (today’s single Blank Agent list multiplied)

X) Other (please describe after [Answer]: tag below)

[Answer]:A
