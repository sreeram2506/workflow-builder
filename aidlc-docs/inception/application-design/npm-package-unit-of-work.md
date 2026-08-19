# Unit of Work — npm package publish

**Parent label**: npm package publish  
**Deployment model**: Angular library (`enso-workflow-builder`) + existing SPA demo in the same repo  
**Unit meaning**: One logical construction module  
**Sequencing**: Single unit — Code Generation → Build and Test (plan Q2=A; Functional Design skipped)  
**Ownership**: Same stream (plan Q4=A)  
**Construction**: Code Generation; skip Functional Design, NFR Requirements/Design, and Infrastructure Design (plan Q2=A)  
**Product boundary**: ng-packagr library hosts can `npm pack` / later publish  
**Application Design**: SKIP  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A  
**Depends on**: U-HE-01 host embed contract (shells, provider, facade) — COMPLETE

---

## Code organization (brownfield) — Q3=A

```text
projects/enso-workflow-builder/     # ADD: ng-packagr library
  ng-package.json
  package.json                      # name enso-workflow-builder, version 0.1.0, peerDeps
  src/public-api.ts                 # shells, provideWorkflowBuilderUi, WorkflowFacade, types
  src/styles/                       # tokens / global styles to ship or re-export

src/app/                            # KEEP: SPA demo (may import from library or stay on src until wired)
  (existing builder — do not delete)

docs/
  workflow-builder-ui-embed.md      # CHANGE: npm install enso-workflow-builder; pack path; peers

angular.json                        # CHANGE: library project
```

SPA stays. Do not commit `src/app/try/`. Do not `npm publish` this increment.

**Construction notes**
- Public barrel must not export try/ or SPA `App`.
- Angular 20 + CDK + rxjs + zone.js are **peerDependencies**.
- Prove `ng build` library + `npm pack`; document `npm publish` only.

---

## Unit Catalog

### U-NP-01 — npm package publish

**Stories**: US-NP-01, US-NP-02, US-NP-03, US-NP-04  
**FR**: FR-NP-01..09  
**NFR**: Security (no secrets in tarball/docs); Resiliency (DR N/A; U-HE-01 fail-safe unchanged); PBT Partial (existing serialize PBT; no new transform expected)  

**Owns**
- ng-packagr library project (FR-NP-01)
- Package identity `enso-workflow-builder` @ 0.1.0 (FR-NP-02)
- Public barrel (FR-NP-03)
- Styles/tokens ship or document (FR-NP-04)
- Peer dependencies (FR-NP-05)
- `npm pack` proof; publish documented not run (FR-NP-06)
- SPA `npm test` / `npm run build` green (FR-NP-07)
- Embed docs package imports (FR-NP-08)
- Tarball excludes try/ and secrets (FR-NP-09)

**Does not own**
- Running `npm publish` to npmjs
- Deleting the SPA
- Widget registry, validation, Repeater lists, run engine
- Committing `src/app/try/`

**Done when**
- Library builds; tarball `enso-workflow-builder-0.1.0.tgz` (or equivalent)
- Host can import shells / provider / facade from the package
- Docs show package install; SPA still green
