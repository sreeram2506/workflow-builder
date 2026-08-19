# U-NP-01 Code Generation Plan — npm package publish

**Status**: GENERATION COMPLETE — awaiting code review  
**Unit**: `u-np-01-npm-package`  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`  
**Stories**: US-NP-01, US-NP-02, US-NP-03, US-NP-04  
**Design**: Functional Design SKIP; NFR Requirements/Design SKIP; Infrastructure Design SKIP  
**UOW**: `aidlc-docs/inception/application-design/npm-package-unit-of-work.md`  
**Requirements**: FR-NP-01..09  

This plan is the single source of truth for Code Generation. Do not run Part 2 until approved.

**N/A**: API / repository / DB / cloud deployables. No new business rules.

**Locked**
- npm name **`enso-workflow-builder`** @ **`0.1.0`**
- ng-packagr library + SPA demo stays
- Public API: shells, `provideWorkflowBuilderUi`, `WorkflowFacade` (load/get/dirty + save/run as shipped)
- Angular 20 + CDK + rxjs + zone.js as **peerDependencies** (do not bundle Angular)
- Prove `ng build` library + `npm pack`; **do not** run `npm publish`
- Do not commit `src/app/try/`
- Do not put secrets in docs, barrel, or tarball
- Keep builder sources under `src/app` this increment (SPA imports stay relative). Library `public-api.ts` re-exports that graph. If ng-packagr refuses files outside `projects/`, **same step fallback**: point `tsconfig.lib` / `ng-package` so the import graph compiles (do not duplicate the product into a second copy of 110 files unless that is the only way the library build succeeds).

---

## Unit context

| Item | Value |
|---|---|
| Depends on | U-HE-01 embed contract COMPLETE (shells, persist, `[document]`, height 100%) |
| Pattern | Secondary Angular library project; pack dist; SPA remains demo |
| Out of scope | `npm publish`; delete SPA; name `workflow-builder-ui`; wide barrel of all `src/app`; widgets / validation / Repeater lists / run engine; commit try/ |

---

## Story coverage

| Story | Steps |
|---|---|
| US-NP-01 Install and import public API | 1–2, 4–5 |
| US-NP-02 Styles / tokens | 3, 6 |
| US-NP-03 npm pack; publish documented not run | 6–7 |
| US-NP-04 SPA + docs; no try/secrets | 6–8 |

---

## Generation Steps

### Step 1 — Library project + identity + peers (FR-NP-01, FR-NP-02, FR-NP-05, US-NP-01)

- [x] Add Angular **library** project `enso-workflow-builder` (`projects/enso-workflow-builder/`). Prefer `ng generate library enso-workflow-builder --prefix=wb` (non-interactive) then replace the scaffold; or hand-author the same CLI shape.
- [x] Add `ng-packagr` (and any Angular 20 library builder already expected by the CLI) as a **devDependency** of the workspace. Do not add a second Angular runtime in `dependencies`.
- [x] Register the library in `angular.json` (`projectType: library`, builder `@angular/build:ng-packagr` or the CLI-generated equivalent). SPA project **stays**.
- [x] Library `package.json`:
  - `"name": "enso-workflow-builder"`
  - `"version": "0.1.0"`
  - `"private"` omitted or `false`
  - **peerDependencies** (caret/range on major 20 / existing rxjs / zone):
    - `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/platform-browser`, `@angular/router`, `@angular/cdk`
    - `rxjs`, `zone.js`
  - `tslib` as a library **dependency** (ng-packagr default)
  - Do **not** list a nested Angular copy in `dependencies`
- [x] Root SPA `package.json` may stay `"name": "workflow-builder"` and `"private": true`.
- [x] Add npm scripts (names may match repo style): `build:lib` → `ng build enso-workflow-builder`; `pack:lib` → build then `npm pack` **from the library dist folder**.
- [x] Delete the generated hello-world component / spec if the schematic created them.
- [x] Do not export or include `src/app/try/` or SPA `App` as the package entry.

### Step 2 — Public API barrel (FR-NP-03, US-NP-01)

- [x] `projects/enso-workflow-builder/src/public-api.ts` SHALL export at least:
  - `ShellLayoutComponent` (`wb-shell-layout`)
  - `AgentSkillsShellComponent` (`wb-agent-skills-shell`)
  - `provideWorkflowBuilderUi` and `ProvideWorkflowBuilderUiOptions`
  - Related types already used by hosts: `UiFeaturesPartial`, catalog adapter types, properties adapter types, `WorkflowBuilderPersistAdapter` / persist token as needed for typing
  - `WorkflowFacade`
  - `WorkflowDocument`
  - Palette types used on shell inputs (`PaletteItem`, `DefaultAgentCard`)
  - `uiConfigAppInitializer` (embed docs already require it)
- [x] SHALL NOT export SPA `App`, `appConfig`, routes as the entry, or anything under `src/app/try/`.
- [x] Barrel re-exports existing `src/app/...` modules (no product rewrite). Transitive compile may pull `src/environments/environment.ts` (routing/run timing constants only — no secrets).
- [x] `ng-package.json`: `dest` `../../dist/enso-workflow-builder`, `lib.entryFile` `src/public-api.ts`.

### Step 3 — Styles / tokens (FR-NP-04, US-NP-02)

- [x] Ship theme tokens with the package so hosts are not told to copy this repo’s `src/styles.css` with no path.
- [x] Preferred: ng-packagr `assets` copy `src/styles/tokens.css` into the package as `styles/tokens.css` (single source of truth). If parent-path assets are rejected, copy `tokens.css` into `projects/enso-workflow-builder/src/styles/` and ship that file — do not invent a second token set.
- [x] Do **not** ship host `html`/`body` height as a required package default. Fill-host height stays the host wrapper’s job (U-HE-01). Document optional SPA `styles.css` box-sizing/font notes if needed.
- [x] SPA `angular.json` styles array may keep `src/styles/tokens.css` + `src/styles.css` (no required SPA restyle this increment).

### Step 4 — Workspace path mapping (US-NP-01)

- [x] Add TypeScript `paths` so `import { ... } from 'enso-workflow-builder'` resolves to `projects/enso-workflow-builder/src/public-api.ts` for app/spec compiles (does not require dist for tests).
- [x] SPA application code **may** keep existing relative `src/app` imports this increment (FR-NP-07). Do not rewrite the whole SPA onto the package name unless a single import is needed for the Step 5 spec.

### Step 5 — Public API test (FR-NP-03, US-NP-01)

- [x] Add a spec that imports from `'enso-workflow-builder'` (path mapping) and asserts the public surface exists:
  - `ShellLayoutComponent`, `AgentSkillsShellComponent`
  - `provideWorkflowBuilderUi`
  - `WorkflowFacade`
- [x] Assert `selector` on shells is `wb-shell-layout` / `wb-agent-skills-shell` (or equivalent compile-time checks).
- [x] No secrets in the spec. Do not import `src/app/try/`.
- [x] No new PBT (no new pure transform). Existing serialize PBT stays as-is.

### Step 6 — Embed docs (FR-NP-08, US-NP-02, US-NP-03, US-NP-04)

- [x] Modify `docs/workflow-builder-ui-embed.md`:
  - Hosts **`npm install enso-workflow-builder`** (registry, later) **and** local tarball: `npm pack` after `ng build enso-workflow-builder`, then `npm install ./enso-workflow-builder-0.1.0.tgz` (or the path under `dist/`)
  - Import examples use `'enso-workflow-builder'`, not `./core/ui-config` as the only host path
  - Peer Angular 20 + CDK + rxjs + zone.js; host supplies them; library does not bundle Angular
  - Styles: include `node_modules/enso-workflow-builder/styles/tokens.css` (adjust if pack layout differs); `html`/`body`/wrapper height still host-owned
  - ng-packagr **is** required for hosts now (replace the U-HE-01 sentence that said it is not)
  - `npm publish` described as a **later** step; this increment does not run it
  - try/ remains gitignored and is not published
  - No secrets in examples
- [x] Do **not** commit `src/app/try/`.

### Step 7 — `npm pack` + tarball hygiene (FR-NP-06, FR-NP-09, US-NP-03, US-NP-04)

- [x] `ng build enso-workflow-builder` succeeds.
- [x] `npm pack` from the library dist produces `enso-workflow-builder-0.1.0.tgz` (or equivalent).
- [x] Inspect tarball contents (`npm pack --dry-run` and/or `tar -tzf`):
  - MUST include package name/version and compiled FESM/typings
  - MUST include shipped tokens CSS (or documented styles path that is actually in the tarball)
  - MUST NOT include `src/app/try/`, `.env`, credentials, or tokens
- [x] Add `*.tgz` to `.gitignore` if missing. Do not commit the tarball or `dist/`.
- [x] **Do not run `npm publish`.**

### Step 8 — SPA regression (FR-NP-07, US-NP-04)

- [x] `npm test` — all green
- [x] SPA `npm run build` — success (existing budget warnings OK)
- [x] Chrome flags, palettes, Properties, nested agent, Condition/Router, host embed contract still covered by existing tests

### Step 9 — (reserved) N/A API / repository / DB / deploy

- [x] N/A — skip API/repository/DB/cloud deployables

### Step 10 — Construction code summaries

- [x] `aidlc-docs/construction/u-np-01-npm-package/code/business-logic-summary.md`
- [x] `frontend-components-summary.md` (library packaging / barrel / styles)
- [x] `code-generation-summary.md`
- [x] SKIP stubs: `api-layer-summary.md`, `repository-layer-summary.md`, `deployment-artifacts-summary.md` (document skip; no cloud deploy)

---

## Extension compliance (this unit)

| Extension | Status | Notes |
|---|---|---|
| Security Baseline | Enforce in Steps 2, 6, 7 | No secrets in barrel/docs/tarball; try/ excluded |
| Other SECURITY | N/A | No new HTTP/auth/stores |
| Resiliency Baseline | Directional / N/A | DR N/A; U-HE-01 invalid-load fail-safe unchanged |
| PBT Partial | Existing only | No new transform; do not drop serialize PBT |

---

## Explicitly not in this unit

- Running `npm publish` to npmjs
- Converting the repo to library-only / deleting the SPA
- Renaming the package to `workflow-builder-ui`
- Exporting the entire `src/app` tree (including try/ and `App`)
- Bundling Angular into the library
- Properties widget registry, graph validation, Repeater option lists, real run engine
- Committing `src/app/try/`

---

## Approval

Approve this plan to run Part 2 in order.
