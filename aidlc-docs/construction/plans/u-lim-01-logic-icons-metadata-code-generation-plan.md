# U-LIM-01 Code Generation Plan — Host logic extras + agent metadata

**Status**: COMPLETE — Part 2 generated; awaiting stage approval  
**Unit**: `u-lim-01-logic-icons-metadata`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-LIM-01, US-LIM-02, US-LIM-03, US-LIM-04  
**Design**: `aidlc-docs/construction/u-lim-01-logic-icons-metadata/functional-design/`  
**FD locks**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A  

This plan is the single source of truth for Code Generation. Do not run Part 2 until approved.

**N/A**: API / repository / DB / deployment artifacts (client SPA). NFR Requirements/Design and Infrastructure Design skipped.

---

## Unit context

| Item | Value |
|---|---|
| Depends on | U-HPI `[palettes]` / `[defaultAgents]` overlay |
| Pattern | `icon-url.ts`; `featuredLogicItems`; sidebar icons; factory `data.metadata` |
| Out of scope | Canvas/Properties icons; metadata Properties editor; new injectable; `http:` URLs |

---

## Story coverage

| Story | Steps |
|---|---|
| US-LIM-01 Extra logic + featured replace | 3, 5, 7, 9 |
| US-LIM-02 Library icons | 1–4, 7, 9 |
| US-LIM-03 Metadata on drop | 2–4, 6, 9 |
| US-LIM-04 Docs | 8 |

---

## Generation Steps

### Step 1 — `sanitizeIconUrl` (US-LIM-02, BR-LIM-03, P-LIM-01/02)

- [x] Create `src/app/core/domain/icon-url.ts` — `sanitizeIconUrl(raw: unknown): string | undefined`
  - Accept `https:` (after `trim`)
  - Accept relative starting with `/` or `./`, no `:`, no `//`, no `../`
  - Accept `data:image/png`, `jpeg`, `jpg`, `gif`, `webp` (optional `;base64,`)
  - Reject `javascript:`, `http:`, `file:`, protocol-relative, `data:image/svg+xml`, other data, empty, non-string
- [x] Create `src/app/core/domain/icon-url.spec.ts` — examples for accept/reject
- [x] PBT: invalid never returned; accepted subset identity (P-LIM-01, P-LIM-02)

### Step 2 — Types (US-LIM-02, US-LIM-03)

- [x] Extend `PaletteItem` in `palette.catalog.ts`: optional `iconUrl`, `iconPath`, `metadata`
- [x] Extend `DefaultAgentCard` in `ui-features.types.ts`: same optional fields

### Step 3 — Host sanitizers + `featuredLogicItems` (US-LIM-01..03, Q3=A, Q7=A)

- [x] Modify `palette-host.helpers.ts`:
  - Copy sanitized `iconUrl`, non-empty `iconPath`, plain-object shallow `metadata`; palettes also `taskMeta`
  - `defaultAgentCardToPaletteItem` copies extras
  - Add `featuredLogicItems(items, hostPalettesPresent): PaletteItem[]`
    - `false`: first of type Condition, Decision, Repeater (today)
    - `true`: all items of those types in input order
- [x] Extend `palette-host.helpers.spec.ts` + PBT (`palette-host.helpers.pbt.spec.ts` or icon-url PBT) for P-LIM-03..05

### Step 4 — JSON defaultAgents (FR-LIM-09)

- [x] Modify `normalizeDefaultAgentCards` in `merge-ui-features.ts` to keep extras (sanitized URL)
- [x] Extend `merge-ui-features.spec.ts`

### Step 5 — Catalog compose omit static featured (US-LIM-01, Q2=A)

- [x] Modify `enso-task-catalog.service.ts` `composeSolution` / `composeSkills`: when host palettes overlay is present and sanitized length &gt; 0, do not include static `FEATURED_PALETTE_TYPES` from `PALETTE_ITEMS`
- [x] Extend `enso-task-catalog.service.spec.ts` (omit vs non-empty host palettes)

### Step 6 — Node factory (US-LIM-03, Q4=A)

- [x] Modify `createWorkflowNodeFromPaletteItem`: `data.metadata = { ...item.metadata }` when present
- [x] Extend `node.factory.spec.ts`

### Step 7 — Left sidebar icons + strip (US-LIM-01, US-LIM-02, Q5=A)

- [x] Modify `left-sidebar.component.ts`:
  - `logicShapeItems()` → `featuredLogicItems(allItems(), hostPalettesPresent)`
  - `hostPalettesPresent`: `palettes()` defined and sanitized length &gt; 0
  - Featured, default-agent, and list rows: img if `iconUrl` and key not in failed set; else `iconPath`; else type glyph
  - `(error)` on img adds key to failed set (`data-testid` keep existing; add `palette-icon-img` where useful)
  - Do not show metadata in UI
- [x] Extend `left-sidebar.palette.spec.ts`

### Step 8 — Docs + try host (US-LIM-04)

- [x] Update `docs/workflow-builder-ui-embed.md` — extra logic cards, replace rule, `iconUrl`/`iconPath` (URL wins), `metadata` on drop; no tokens
- [x] Update `src/app/try/try-ui-host.component.ts` samples if present (gitignored; do not add route to committed `app.routes.ts`)

### Step 9 — Regression

- [x] `npm test` — all green
- [x] `npm run build` — success (budget warnings OK)

### Step 10 — Construction code summaries

- [x] `aidlc-docs/construction/u-lim-01-logic-icons-metadata/code/business-logic-summary.md`
- [x] `frontend-components-summary.md`
- [x] `code-generation-summary.md`
- [x] SKIP stubs: `api-layer-summary.md`, `repository-layer-summary.md`, `deployment-artifacts-summary.md`

---

## Explicitly not in this unit

- Canvas / Properties host icons
- `PaletteHostExtrasService` / `wb-palette-icon`
- Dedupe host palettes by key (Q7=A)
- Committing `try/` or try route

---

## Approval

Approve this plan to run Part 2 in order.
