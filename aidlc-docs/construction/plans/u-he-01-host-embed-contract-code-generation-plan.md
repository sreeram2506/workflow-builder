# U-HE-01 Code Generation Plan — Host embed contract

**Status**: GENERATION COMPLETE — awaiting code review  
**Unit**: `u-he-01-host-embed-contract`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-HE-01, US-HE-02, US-HE-03, US-HE-04  
**Design**: Functional Design SKIP — follow RA + unit-of-work  
**UOW**: `aidlc-docs/inception/application-design/host-embed-contract-unit-of-work.md`  

This plan is the single source of truth for Code Generation. Do not run Part 2 until approved.

**N/A**: API / repository / DB / deployment artifacts (client SPA). NFR Requirements/Design and Infrastructure Design skipped.

**Brownfield Save note (locked for this plan)**  
`saveDownload()` today **marks the document saved + toast**. It does **not** blob-download. **Export** is the blob file. Q3=A means: keep those defaults when no host handler. Host `persist.save` replaces `saveDownload()`, not Export.

**Host dirty vs AutoSave**  
`AutoSaveService.dirty` auto-clears after 500ms (internal autosave). Host `dirty` is a **separate** signal: false after successful `loadDocument` and after successful Save (host or default); true after committed graph edits. Do not expose autosave dirty as host dirty.

**Persist first-win (locked)**  
1. Bound shell `(save)` / `(run)` (subscriber / `.observed`)  
2. Else `provideWorkflowBuilderUi({ persist: { save, run } })`  
3. Else default `saveDownload()` / `startRun()` (simulated)

---

## Unit context

| Item | Value |
|---|---|
| Depends on | `WorkflowDocument` serialize/parse, shells `[ui]`/`[palettes]`, Save/Run chrome |
| Pattern | Facade load/get/dirty; solution shell `[document]` / `(documentChange)`; persist hooks; `height: 100%` |
| Out of scope | ng-packagr; widgets/validation/option lists/run engine/theme tokens; `core/embed-contract/` folder; commit `src/app/try/` |

---

## Story coverage

| Story | Steps |
|---|---|
| US-HE-01 Load `[document]`; invalid keeps last good | 1–3, 8 |
| US-HE-02 getDocument / dirty / documentChange | 2–3, 8 |
| US-HE-03 Save/Run handlers vs defaults | 4–5, 8 |
| US-HE-04 Fill host height; embed docs | 6–7 |

---

## Generation Steps

### Step 1 — Parse object documents (FR-HE-01, FR-HE-02, PBT Partial)

- [x] Modify `src/app/core/domain/workflow.serialize.ts` — add `parseWorkflowUnknown(raw: unknown): ParseWorkflowResult`:
  - non-object / array / null → `{ ok: false, error }` (no throw)
  - `allowlistSerialized` then validate
  - missing `schemaVersion` → default `WORKFLOW_SCHEMA_VERSION` so in-memory `WorkflowDocument` (from `getDocument()`) round-trips through `[document]`
  - reuse `validateSerialized`
- [x] Keep `parseWorkflowJson` as JSON.parse + `parseWorkflowUnknown`
- [x] Extend `workflow.serialize.spec.ts`:
  - invalid non-object fails
  - document **without** `schemaVersion` still parses when other fields valid
  - PBT Partial: serialize → parse JSON; also object round-trip via `parseWorkflowUnknown` (existing fc helpers if present)
  - unknown keys still stripped (no secrets/extra fields)

### Step 2 — Persist token + provider (FR-HE-05, FR-HE-06)

- [x] Add `src/app/core/ui-config/persist-adapter.ts`:
  - `WorkflowBuilderPersistAdapter`: `{ save?: (doc: WorkflowDocument) => void | Promise<void>; run?: (doc: WorkflowDocument) => void | Promise<void> }`
  - `WORKFLOW_BUILDER_PERSIST` injection token (optional)
- [x] Modify `provide-workflow-builder-ui.ts` — `persist?: WorkflowBuilderPersistAdapter` on options; provide token when `persist` is set
- [x] Export types/token from `src/app/core/ui-config/index.ts`
- [x] No secrets in types or comments

### Step 3 — Facade load / get / dirty (FR-HE-01..03)

- [x] Modify `src/app/core/facade/workflow.facade.ts`:
  - `loadDocument(raw: unknown): boolean` — `parseWorkflowUnknown`; on fail: `setCanvasError` (non-secret), **do not** change graph / nested state / dirty; return `false`; never throw
  - on success: exit nested if open (or reset nested-edit so solution document is shown); `setDocument` from parsed; clear selection; host dirty **false**; `setCanvasError(null)`; bump a `documentRevision` (or equivalent) so shells can emit `(documentChange)`; return `true`
  - `getDocument(): WorkflowDocument | null` — if nested open, `flushAgentCanvasToSolution()` first (keep nested view unless load needs exit); return `structuredClone` of **solution** document (not the nested editable doc)
  - `dirty` / `hostDirty` signal — see header; wire committed graph mutations that already call autosave `notifyMutation` to also set host dirty true (do not use autosave’s auto-clear)
  - successful default `saveDownload()` and successful host save also set host dirty false
- [x] Extend `workflow.facade.spec.ts`:
  - valid load replaces graph; nested edit reset
  - invalid load keeps last good + error; no throw
  - after load, dirty false; after committed edit, dirty true
  - `getDocument` flushes nested onto the agent before clone
  - load fail does not clear error-less graph

### Step 4 — Shell `[document]` / `(documentChange)` (FR-HE-04, US-HE-01, US-HE-02)

- [x] Modify `src/app/features/shell/shell-layout.component.ts`:
  - `document` input (`WorkflowDocument | unknown | undefined`)
  - `(documentChange)` output — structured clone of `getDocument()`; **no secrets**
  - effect: when `[document]` is defined and reference (or identity) changes, `loadDocument`; skip undefined (SPA bootstrap keeps initialize())
  - emit `documentChange` after successful load **and** after committed edits (debounce MAY be 500ms, same as autosave; not on pointer-move pan)
- [x] Nested `agent-skills-shell`: **do not** duplicate solution `[document]` / `(documentChange)`
- [x] Add/extend a shell or facade spec: bind document → canvas nodes; invalid payload keeps previous; `documentChange` after successful load

### Step 5 — Save / Run dispatch (FR-HE-05..07, US-HE-03)

- [x] Facade `requestSave()` / `requestRun()` (names may match existing style):
  - View mode: do **not** invent a new Save disable — keep today’s chrome (Save button is **not** disabled in view today). Do **not** use Save to mutate the canvas in view. Host save may still receive `getDocument()` (read). Default `saveDownload()` stays as today.
  - First-win: instance shell `(save)`/`(run)` if observed → emit/call with `getDocument()`; else provider persist; else default
  - Host save: **no** `saveDownload()`; host run: **no** `startRun()` simulate
  - Await Promise handlers; catch errors → `setCanvasError`; do not throw to host page
  - After successful host save: host dirty false + status toast OK
  - Stop/Reset: unchanged; local status clear still allowed when a Run handler is set (no host Stop API)
- [x] Modify `zoom-controls.component.ts` — Save → `requestSave()`; Run → `requestRun()`
- [x] Modify `chrome-shortcuts.directive.ts` — ⌘/Ctrl+S → `requestSave()`
- [x] Export/Import chrome **unchanged** (`exportDownload` / import dialog)
- [x] Extend facade + chrome-gates specs:
  - persist.save set → Save does not call `saveDownload`; handler gets document
  - no save handler → `saveDownload` still runs
  - persist.run set → Run does not `startRun`; handler gets document
  - no run handler → simulate still runs
  - Export/Import still wired
  - Update existing `saveDownload` spies that go through the Save button/shortcut to `requestSave` as needed

### Step 6 — Fill-host height (FR-HE-08, US-HE-04)

- [x] `shell-layout.component.ts`: `:host { display: block; height: 100%; min-height: 0; }` and `.shell { height: 100%; min-height: 0; }` — **not** `100vh`. No `[height]` input
- [x] `agent-skills-shell.component.ts`: same host + `.shell` height 100% / min-height 0 (replace `100vh`)
- [x] Confirm `src/styles.css` `html, body { height: 100%; }` and `app-root` `:host { height: 100%; }` stay (standalone SPA still full-page)
- [x] Spec or comment: no `100vh` on those shell roots (grep in test or assert styles)

### Step 7 — Embed docs (FR-HE-09, US-HE-04)

- [x] Modify `docs/workflow-builder-ui-embed.md`:
  - `[document]` on `wb-shell-layout`; `loadDocument` / `getDocument` / `dirty`
  - `(documentChange)` — when it fires; structured clone; no secrets
  - invalid load fail-safe
  - `persist.save` / `persist.run` vs defaults (Save = mark saved today; Export = blob)
  - first-win: shell output over provider
  - fill-host: `height: 100%`; host wrapper must have definite height; no `[height]`
  - ng-packagr **not** required this increment
- [x] Do **not** commit `src/app/try/`

### Step 8 — (reserved) N/A API / repository / DB

- [x] N/A — skip API/repository/DB (client SPA)

### Step 9 — Regression

- [x] `npm test` — all green
- [x] `npm run build` — success (budget warnings OK)
- [x] Chrome flags, palettes, Properties schema, agent enter-without-tabs, Condition edges, Router connectors intact

### Step 10 — Construction code summaries

- [x] `aidlc-docs/construction/u-he-01-host-embed-contract/code/business-logic-summary.md`
- [x] `frontend-components-summary.md`
- [x] `code-generation-summary.md`
- [x] SKIP stubs: `api-layer-summary.md`, `repository-layer-summary.md`, `deployment-artifacts-summary.md`

---

## Extension compliance (this unit)

| Extension | Status | Notes |
|---|---|---|
| Security Baseline | Enforce in Steps 1, 3, 4, 7 | No secrets in documents/emits/docs; allowlist parse; errors non-secret |
| Other SECURITY | N/A | No new HTTP/auth/stores |
| Resiliency Baseline | Enforce in Steps 1, 3 | Invalid load keeps last good; never throw to host; DR N/A (SPA) |
| PBT Partial | Enforce in Step 1 | serialize/parse and `parseWorkflowUnknown` object round-trip |

---

## Explicitly not in this unit

- ng-packagr / npm publish / peerDeps package
- `core/embed-contract/` folder (plan Q3=A)
- Properties widget registry, graph validation, Repeater option lists, real run engine, theme tokens
- Replacing Export/Import with `[document]`
- Turning Save into a new blob download (today’s Save is mark-saved)
- Committing `src/app/try/` or expanding `try-ui` as a product route

---

## Approval

Approve this plan to run Part 2 in order.
