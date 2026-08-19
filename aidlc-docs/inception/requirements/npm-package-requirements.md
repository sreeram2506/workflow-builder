# Requirements — npm package publish

## Intent Analysis Summary

| Field | Value |
|---|---|
| **User request** | Publish this as an npm package |
| **Request type** | Enhancement (brownfield packaging) |
| **Scope** | ng-packagr library + public API + `npm pack`; SPA remains demo |
| **Complexity** | Moderate |
| **Requirements depth** | Standard |
| **Increment name** | npm package publish |
| **Answers** | Q1=A · Q2=A · Q3=X (`enso-workflow-builder`) · Q4=A · Q5=A · Q6=A · Q7=A · Q8=B |

See `npm-package-intent-analysis.md`.

---

## 1. Goals

1. Hosts can **`npm install enso-workflow-builder`** (or install a local tarball from `npm pack`) and embed the builder without copying `src/app`.
2. The existing **SPA stays** as a demo/consumer in this repo.
3. Prove **library build + `npm pack`**. Document `npm publish`; **do not** run publish in this increment unless the user later asks with registry auth.
4. U-HE-01 embed contract (`[document]`, persist, fill-host height) remains the host API.

---

## 2. Locked decisions

| Topic | Choice |
|---|---|
| Slice | ng-packagr library + `npm pack`; no `npm publish` this increment (Q1=A) |
| Layout | Secondary library project (e.g. `projects/enso-workflow-builder` or `projects/workflow-builder-ui`) + existing SPA (Q2=A) |
| Package name | **`enso-workflow-builder`** @ **`0.1.0`** (Q3=X). Root SPA `package.json` name may stay `workflow-builder` |
| Public API | Shells + `provideWorkflowBuilderUi` + facade document I/O + styles/tokens (Q4=A) |
| Angular | Peer dependencies; do not bundle Angular (Q5=A) |
| Extensions | Security Yes (new-code); Resiliency Yes (directional, DR N/A); PBT Partial |

---

## 3. Functional requirements

### FR-NP-01 — Angular library project

The repo SHALL contain an Angular **library** built with **ng-packagr** (CLI library project). The existing application project SHALL remain (standalone SPA / demo).

Suggested path: `projects/enso-workflow-builder/` (folder may differ; **npm name is locked** to `enso-workflow-builder`).

### FR-NP-02 — Package identity

The library `package.json` SHALL have:

- `"name": "enso-workflow-builder"`
- `"version": "0.1.0"`
- `"private": false` (or omit private)
- peerDependencies per FR-NP-05

Root workspace `package.json` MAY stay `"private": true` for the SPA.

### FR-NP-03 — Public barrel

The library public API SHALL export at least:

- Components: `ShellLayoutComponent` (`wb-shell-layout`), `AgentSkillsShellComponent` (`wb-agent-skills-shell`)
- `provideWorkflowBuilderUi` and related types (features, catalog, properties, persist)
- `WorkflowFacade` (`loadDocument`, `getDocument`, `dirty`, `requestSave` / `requestRun` as already implemented)
- Types needed to call that API (`WorkflowDocument`, `UiFeaturesPartial`, persist adapter types, palette types used on shell inputs)

SHALL NOT export `src/app/try/` or the SPA `App` root as the package entry.

### FR-NP-04 — Styles and assets

The package SHALL ship (or document how the host includes) theme tokens / global styles the shells need so a host is not required to copy `src/styles.css` by hand without guidance.

Host `html`/`body` height and wrapper height remain the host’s job (U-HE-01).

### FR-NP-05 — Peer dependencies

Peer dependencies SHALL include Angular 20 packages the library imports (`@angular/core`, `common`, `compiler` if required, `forms`, `platform-browser`, `router`, `cdk`), plus `rxjs` and `zone.js`. The library SHALL NOT bundle a second Angular.

### FR-NP-06 — Pack, not publish

CI/local proof this increment:

- `ng build` of the library succeeds
- `npm pack` produces a tarball
- Embed docs describe install from tarball / later `npm publish`

`npm publish` is **out of this increment** unless the user explicitly asks after pack is green (Q1≠B).

### FR-NP-07 — SPA still builds and tests

`npm test` and SPA `npm run build` SHALL stay green. Chrome flags, palettes, Properties, nested agent, Condition/Router, host embed contract SHALL remain.

### FR-NP-08 — Embed docs

`docs/workflow-builder-ui-embed.md` SHALL document:

- `npm install enso-workflow-builder` (and local `npm pack` path)
- Import paths from the package (not `./core/ui-config` relative to this repo)
- Peer Angular 20
- That ng-packagr **is** required for hosts now; try/ remains gitignored and is not published

### FR-NP-09 — Do not publish secrets or try

Published files SHALL NOT include secrets, `.env`, or `src/app/try/`.

---

## 4. Non-functional

- No new HTTP or auth. Package tarball must not contain tokens.
- Invalid `[document]` fail-safe from U-HE-01 unchanged (Resiliency, directional; DR N/A for a library).
- PBT Partial: existing serialize/parse round-trips stay; no new PBT required unless a new pure transform is added for packaging.
- Security new-code: public API and docs have no secrets; allowlist parse unchanged.

---

## 5. Out of scope

- Running `npm publish` to npmjs (Q1=A, not B)
- Library-only repo / deleting the SPA (Q2 not B)
- Package name `workflow-builder-ui` (Q3 is `enso-workflow-builder`)
- Wide barrel of all `src/app` (Q4 not C)
- Bundling Angular (Q5 not B)
- Widgets, graph validation, Repeater option lists, real run engine, theme token *product* expansion
- Committing `src/app/try/`

---

## 6. Success

- `ng build <library>` succeeds.
- `npm pack` in the library dist produces `enso-workflow-builder-0.1.0.tgz` (or equivalent).
- A host can import `wb-shell-layout` / `provideWorkflowBuilderUi` / `WorkflowFacade` from `enso-workflow-builder`.
- SPA still runs; existing tests pass.
- Docs show package install, not “copy src”.
