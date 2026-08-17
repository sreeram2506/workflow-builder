# U-UI-02 Code Generation Plan — Chrome Wiring + Docs

**Status**: APPROVED — PART 2 EXECUTED  
**Unit**: `u-ui-02-chrome-wiring`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-UI-02..06, US-UI-08 · FR-UI-09/10  
**Design**: `aidlc-docs/construction/u-ui-02-chrome-wiring/functional-design/`  
**FD locks**: Q1=A · Q2=B · Q3=A · Q4=A · Q5=A · Q6=A · Q7=C · Q8=A  

**N/A**: API / repository / DB / deployment artifacts.

---

## Unit context

| Item | Value |
|---|---|
| Depends on | U-UI-01 `UiConfigService` |
| Pattern | Parent shell `@if` gates; TopBar action `@if`s; extract AgentTabs |
| Note | Save/Export/Import/Run/Reset live in `zoom-controls` today — gate with `topBar.*` flags (and cluster with `canvas.floatingActions`) |

---

## Story coverage

| Stories | Steps |
|---|---|
| US-UI-02 Top bar / actions / shortcuts | 2, 3, 5 |
| US-UI-03 Agents Library | 4 |
| US-UI-04 Skills Library | 4 |
| US-UI-05 Properties | 4 |
| US-UI-06 Canvas / overlays / tabs / theme | 2, 4, 5 |
| US-UI-08 View mode + flags | 4, 7 |
| FR-UI-09 / 10 demos + embed | 6 |

---

## Generation Steps

### Step 1 — Extract AgentTabsComponent
- [x] Create `src/app/features/shell/agent-tabs.component.ts` — move tab strip markup/styles/handlers from TopBar (`agent-tabs-strip`, solution tab, close)
- [x] Remove tabs block from `top-bar.component.ts` (keep Back / logo / title / status / theme / editView)

### Step 2 — TopBar action + Save shortcut gates
- [x] Inject `UiConfigService` into TopBar
- [x] `@if` for logo, title/status/folder, back, theme (`topBar.theme`), editView
- [x] Gate ⌘/Ctrl+S with `ui.is('topBar.save')` before `saveDownload` (via `ChromeShortcutsDirective`)

### Step 3 — Shell layouts: region gates + config banner
- [x] Modify `shell-layout.component.ts` — inject UiConfig; `@if` canvas / left (`agentsLibrary`) / right (`propertiesPanel`) / topBar / agentTabs; banner for loadStatus missing|invalid
- [x] Modify `agent-skills-shell.component.ts` — same with `skillsLibrary` for left sidebar
- [x] Header overlay hosts top-bar and/or agent-tabs independently

### Step 4 — Chrome inset when panels hidden
- [x] Extend `chrome-inset.directive.ts` and/or sidebar top/width consumers so disabled libraries/properties behave as collapsed (full-width canvas) — Q4=A
- [x] Ensure left/right sidebars not mounted ⇒ no reserved gutter

### Step 5 — Canvas overlays + floating actions
- [x] Gate `wb-zoom-controls` / `wb-minimap` with `canvas.zoomControls` / `canvas.minimap`
- [x] Inside zoom-controls: gate Save/Export/Import/Run/Reset with `topBar.save|export|import|run|reset`; hide action cluster when `canvas.floatingActions` is false (zoom scale buttons follow zoomControls only)

### Step 6 — Docs
- [x] Create `docs/workflow-builder-ui-embed.md` (provider, flag table, examples, precedence)
- [x] Update `docs/workflow-builder-ui-config-try.md` — note chrome gates live; link embed doc
- [x] Add short pointer in `README.md`
- [x] Keep `src/assets/examples/*`; active `wb-ui-config.json` stays `{}`

### Step 7 — Tests + regression
- [x] Shell/component tests: flag off ⇒ testid absent (or provideWorkflowBuilderUi / mock UiConfigService)
- [x] TopBar Save shortcut no-op when save false
- [x] Defaults `{}` ⇒ full chrome still present (`app.spec` expectations)
- [x] `npm test` + `npm run build` green

### Step 8 — Code summaries
- [x] `aidlc-docs/construction/u-ui-02-chrome-wiring/code/frontend-components-summary.md`
- [x] `aidlc-docs/construction/u-ui-02-chrome-wiring/code/business-logic-summary.md`
- [x] `aidlc-docs/construction/u-ui-02-chrome-wiring/code/code-generation-summary.md`
- [x] SKIP stubs: api / repository / deployment

### Change round 4 (Q1=X, Q2=X, Q3=B)
- [x] Palette AIAgent click/drag reuses existing `paletteKey` node and focuses its tab
- [x] `openAgentTab` / `setAgentTabs` collapse duplicate `nodeId`s
- [x] Remove 72px `chromeInsetTop` clamp; empty header overlay unmounted so libraries use top of stage
- [x] Tests + embed/try docs updated (no new JSON keys)

### Change round 5 (Q1=X, Q2=X, Q3=B)
- [x] Remove root `themeToggle` from active JSON + example files
- [x] Docs: theme is only `topBar.theme` (legacy alias still parsed if present)

---

## Approval

Approve this plan to run Part 2 in order.
