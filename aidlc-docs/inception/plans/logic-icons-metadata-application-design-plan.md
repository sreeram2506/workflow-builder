# Application Design Plan — Host logic extras + agent metadata

**Role**: Application Architect  
**Status**: APPROVED — ARTIFACTS GENERATED  
**Locked answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  
**Execution plan**: Approved Q1=A (1 unit U-LIM-01)  
**Requirements**: FR-LIM-01..10 · **Stories**: US-LIM-01..04

Fill every `[Answer]:`, then reply in chat (for example `answered`). Design artifacts will not be generated until this plan is approved.

This increment extends existing palette/host types. No new Angular injectable is required unless you choose Q5=B.

---

## Proposed components (after answers)

| Component | Kind | Responsibility |
|---|---|---|
| `PaletteItem` / `DefaultAgentCard` | Types | Optional `iconUrl`, `iconPath`, `metadata`; palettes keep `taskMeta` |
| Icon URL sanitizer | Pure domain | Allowlist `https:` / relative / raster `data:image/*`; reject unsafe schemes |
| Host sanitizers | Pure domain | Keep valid icon + metadata (+ `taskMeta` on palettes) |
| Featured-strip selector | Pure domain | When host palettes present: all host logic types; else first static three |
| `left-sidebar` | UI | Render extra featured cards; img / path / glyph; img error → glyph |
| `createWorkflowNodeFromPaletteItem` | Domain | Copy `metadata` → `data.metadata`; keep `ensoTask` from `taskMeta` |
| JSON `normalizeDefaultAgentCards` | Merge | Same optional fields as instance `[defaultAgents]` |
| Embed docs / try host | Docs | Examples; no secrets |

---

## Execution checklist (Part 2 — after plan approval)

- [x] Generate `logic-icons-metadata-components.md`
- [x] Generate `logic-icons-metadata-component-methods.md`
- [x] Generate `logic-icons-metadata-services.md`
- [x] Generate `logic-icons-metadata-component-dependency.md`
- [x] Generate `logic-icons-metadata-application-design.md` (summary)
- [x] Validate design completeness (FR/US coverage)

---

## Question 1

**Where should icon URL sanitization live?**

A) **Recommended** — Dedicated pure module `icon-url.ts` (or equivalent) next to `palette-host.helpers.ts`; helpers and sidebar import it

B) Inline inside `palette-host.helpers.ts` only (sidebar uses already-sanitized fields)

C) Sidebar-only (do not sanitize in helpers)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Featured-strip replace (host `[palettes]` present)**

A) **Recommended** — Pure helper (e.g. `featuredLogicItems(allItems, hostPalettesPresent)`); `logicShapeItems()` calls it. When present: every Condition / Decision / Repeater from the catalog list (host items; static three excluded by compose or by the helper). When omitted: today’s first-of-each-type built-ins

B) Change only `logicShapeItems()` in `left-sidebar` (no shared helper)

C) Catalog `composeSolution` drops static logic types whenever host palettes is present; sidebar still uses first-of-type (would hide extras — not recommended)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Library icon rendering**

A) **Recommended** — Methods on `left-sidebar` (sanitized `iconUrl` → `<img>`; else `iconPath`; else type glyph). `(error)` on img falls back to glyph. No new child component

B) New standalone `wb-palette-icon` component used in featured, default-agent, and list rows

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Drop mapping for metadata**

A) **Recommended** — Extend `createWorkflowNodeFromPaletteItem` only (`data.metadata` shallow copy when present; existing `ensoTask`)

B) New `copyPaletteExtrasToNodeData` helper called from the factory

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**Service layer**

A) **Recommended** — No new injectable. Catalog service still composes lists; sanitizers stay pure; sidebar remains the UI orchestrator

B) New `PaletteHostExtrasService` for sanitize + featured selection

X) Other (please describe after [Answer]: tag below)

[Answer]: A
