# npm package publish — Requirement Verification Questions

**Increment**: Publish workflow-builder as an npm package  
**Status**: ANSWERS LOCKED — Q1=A · Q2=A · Q3=X (`enso-workflow-builder`) · Q4=A · Q5=A · Q6=A · Q7=A · Q8=B  
Fill each `[Answer]:`, then reply in chat (e.g. `answered`).

No application code until answers are locked.

Today: Angular **application** (`package.json` `private: true`, no ng-packagr). Hosts import from source. U-HE-01 embed contract stays; this increment packages it.

---

## Question 1

**What should “publish as npm package” mean this increment?**

A) **Recommended** — Extract an Angular **library** (ng-packagr). Keep the SPA as a demo/consumer. Prove `ng build` library + `npm pack` (local tarball). Document `npm publish`; run publish only if you have registry auth and ask after pack is green.

B) A, and **run `npm publish`** to the public npm registry in this increment (needs you logged in)

C) Do not extract a library — publish the whole SPA app as an npm package

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Repo layout**

A) **Recommended** — Secondary library project (e.g. `projects/workflow-builder-ui`) + existing SPA stays and uses the library (or source until wired)

B) Convert this repo to **library-only** (no standalone SPA app)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**npm package name** (you can still change it later before first publish)

A) **Recommended** — `workflow-builder-ui`, version `0.1.0` (`private: false` on the library)

B) Keep root name `workflow-builder`

C) Scoped package (write the scope/name after [Answer]: e.g. `@your-org/workflow-builder`)

X) Other (please describe after [Answer]: tag below)

[Answer]: X (enso-workflow-builder)

---

## Question 4

**Public API the host should import**

A) **Recommended** — `wb-shell-layout`, `wb-agent-skills-shell`, `provideWorkflowBuilderUi` (features / catalog / properties / persist), document I/O types + `WorkflowFacade` (`loadDocument` / `getDocument` / `dirty`), tokens/styles the host must include. Do **not** export `src/app/try/` or treat the SPA `App` as the package.

B) Components only (no facade in the public barrel)

C) Export all of `src/app` (wide barrel)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5

**How should Angular be consumed?**

A) **Recommended** — Peer dependencies: Angular 20 (`@angular/core`, common, compiler, forms, platform-browser, router, cdk), `rxjs`, `zone.js`. Host supplies them. Do not bundle Angular inside the library.

B) Bundle Angular into the package

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6

Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)

B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 7

Should the resiliency baseline be applied to this project?

A) Yes — apply the resiliency baseline as directional best practices and design-time guidance (recommended for business-critical workloads, as an informed starting point that you can validate and harden before go-live)

B) No — skip the resiliency baseline (suitable for PoCs, prototypes, and packaging work where DR/HA are N/A)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 8

Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints (recommended for projects with business logic, data transformations, serialization, or stateful components)

B) Partial — enforce PBT rules only for pure functions and serialization round-trips (suitable for projects with limited algorithmic complexity)

C) No — skip all PBT rules (suitable for simple CRUD applications, UI-only projects, packaging/layout with no new transforms)

X) Other (please describe after [Answer]: tag below)

[Answer]: B
