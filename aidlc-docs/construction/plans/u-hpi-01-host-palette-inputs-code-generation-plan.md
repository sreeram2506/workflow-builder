# U-HPI-01 Code Generation Plan — Host palette inputs

**Status**: GENERATED — awaiting approval  
**Unit**: `u-hpi-01-host-palette-inputs`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-HPI-01, US-HPI-02, US-HPI-03, US-HPI-04, US-HPI-05, US-HPI-06  
**Design**: `aidlc-docs/construction/u-hpi-01-host-palette-inputs/functional-design/`  
**FD locks**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A · Q9=A  

This plan is the single source of truth for Code Generation. Do not generate code until approved.

**N/A**: API / repository / DB / deployment artifacts (client SPA). NFR Requirements/Design and Infrastructure Design skipped.

---

## Unit context

| Item | Value |
|---|---|
| Depends on | U-PAL-02 catalog/sidebar; U-PAL-01 helpers |
| Out of scope | Stream `NodeType`; skills `[defaultAgents]`; catalog `providedIn` change; ng library |
| Code | `palette-host.helpers.ts`, `catalog.types.ts`, `enso-task-catalog.service.ts`, `left-sidebar.component.ts`, `shell-layout.component.ts`, `agent-skills-shell.component.ts`, `docs/workflow-builder-ui-embed.md` |

---

## Story coverage

| Story | Steps |
|---|---|
| US-HPI-01 Solution `[palettes]` omit / `[]` / items | 1–6 |
| US-HPI-02 `[defaultAgents]` | 2–6 |
| US-HPI-03 Skills `[palettes]` | 5–6 |
| US-HPI-04 Input wins over catalog provider | 2–3 |
| US-HPI-05 Drop unknown types | 1, 3 |
| US-HPI-06 Embed docs | 7 |

---

## Generation Steps

### Step 1 — Sanitize helpers + PBT (US-HPI-05, NFR-HPI-04)

- [x] Modify `src/app/core/domain/palette-host.helpers.ts` — add `sanitizeHostPaletteItems(raw: readonly unknown[]): PaletteItem[]` (BR-HPI-07: skip non-object, missing/blank `key`/`type`/`label`, type not in `ALLOWED_NODE_TYPES`; default `categoryId` if missing). Add `sanitizeHostDefaultAgents(raw: readonly unknown[]): DefaultAgentCard[]` (skip missing `key`/`label`)
- [x] Extend `src/app/core/domain/palette-host.helpers.spec.ts` — table: Stream dropped; sibling AIAgent kept; missing fields skipped
- [x] Extend `src/app/core/domain/palette-host.helpers.pbt.spec.ts` — invariant: every output item `type` ∈ `ALLOWED_NODE_TYPES` and has non-empty `key`/`type`/`label` (Q9=A)

### Step 2 — Catalog overlay (US-HPI-01, US-HPI-02, US-HPI-04)

- [x] Modify `src/app/core/data/catalog.types.ts` — `hostPalettes?: PaletteItem[]`; `hostDefaultAgents?: DefaultAgentCard[]`; extend `source` with `'host'`
- [x] Modify `src/app/core/data/enso-task-catalog.service.ts`:
  - If `'hostPalettes' in options` (or `hostPalettes !== undefined`): **do not** call Enso or provider adapter
  - `[]` → EMPTY (`emptyRemote: true`, `items: []`, `error: null`, `source: 'host'`) — ignore host defaultAgents (BR-HPI-05)
  - non-empty → `sanitizeHostPaletteItems`; compose OK path even if sanitized length is 0 (BR-HPI-06); `source: 'host'`
  - If `hostDefaultAgents !== undefined` and not EMPTY: `resolveDefaultAgents({ mode: 'present', cards: sanitizeHostDefaultAgents(...) })` instead of JSON (BR-HPI-08)
  - Omit palettes → existing U-PAL-02; host defaultAgents may still overlay
- [x] Never set overlay keys to `undefined` (that would look present)

### Step 3 — Catalog tests (US-HPI-01, US-HPI-04, US-HPI-05)

- [x] Extend `src/app/core/data/enso-task-catalog.service.spec.ts`:
  - omit overlay → Enso or adapter still used
  - `hostPalettes: []` → emptyRemote, source host, HttpTestingController unused
  - present items → no Enso; featured + defaults + host rows
  - present palettes + catalog token → host items, adapter not called
  - `{ type: 'Stream' }` dropped; valid sibling remains
  - non-empty all-unknown → not emptyRemote; featured/defaults remain
  - `hostDefaultAgents` present wins over JSON; omitted uses JSON
  - `hostPalettes: []` + `hostDefaultAgents` → emptyRemote, no default cards

### Step 4 — Left sidebar overlay (US-HPI-01, Q4=A, Q8=A)

- [x] Modify `src/app/features/shell/left-sidebar.component.ts`:
  - `palettes = input<PaletteItem[] | undefined>()` no default
  - `defaultAgents = input<DefaultAgentCard[] | undefined>()` no default
  - Build `CatalogLoadOptions`: set `hostPalettes` only if `palettes() !== undefined`; set `hostDefaultAgents` only if solution scope and `defaultAgents() !== undefined`
  - Reload effect also reads overlay inputs (plus existing `features().palette`)
- [x] Do not re-validate types in the sidebar

### Step 5 — Shells (US-HPI-01, US-HPI-02, US-HPI-03)

- [x] Modify `src/app/features/shell/shell-layout.component.ts` — `palettes` + `defaultAgents` inputs; bind both on `wb-left-sidebar`
- [x] Modify `src/app/features/agent/agent-skills-shell.component.ts` — `palettes` input only; bind on `wb-left-sidebar`
- [x] Export `DefaultAgentCard` / `PaletteItem` already available to hosts via existing barrels if needed; do not add a wrapper component

### Step 6 — Frontend tests

- [x] Extend `src/app/features/shell/left-sidebar.palette.spec.ts` (or add sibling spec): omit vs `[]` vs items forwarded to `loadCatalog`; reload when `palettes` input changes; empty-remote testid for `[]`
- [x] Add or extend a shell spec so `wb-shell-layout` `[palettes]` / `[defaultAgents]` reach the sidebar (component fixture or spy on catalog)
- [x] Skills: `paletteScope="agent"` + palettes overlay (sidebar spec is enough if shell binding is a one-line pass-through)

### Step 7 — Docs (US-HPI-06)

- [x] Update `docs/workflow-builder-ui-embed.md` — parent template example for `wb-shell-layout` with `[palettes]` and `[defaultAgents]`; omit vs `[]` vs items; component input wins over `provideWorkflowBuilderUi({ catalog })`; examples use known `NodeType` only (AIAgent labeled Stream is OK); **no** access tokens

### Step 8 — Regression

- [x] `npm test` — all green
- [x] `npm run build` — success (budget warnings OK)

### Step 9 — Construction code summaries

- [x] `aidlc-docs/construction/u-hpi-01-host-palette-inputs/code/business-logic-summary.md`
- [x] `frontend-components-summary.md`
- [x] `code-generation-summary.md`
- [x] SKIP stubs: `api-layer-summary.md`, `repository-layer-summary.md`, `deployment-artifacts-summary.md`

---

## Explicitly not in this unit

- New `Stream` canvas node / factory
- `wb-workflow-builder` host wrapper
- Changing `EnsoTaskCatalogService` off `providedIn: 'root'`
- Skills `[defaultAgents]` input
- Putting samples in active `wb-ui-config.json`
