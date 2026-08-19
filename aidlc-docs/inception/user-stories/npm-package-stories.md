# User Stories — npm package publish

**Breakdown**: Hybrid — feature stories with host and author AC  
**Granularity**: Standard (4 stories)  
**AC style**: Gherkin  
**Personas**: P-HOST, P-AUTHOR, P-REVIEWER (`personas.md`)  
**Requirements**: `npm-package-requirements.md` FR-NP-01..09  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  

**Locked policies**
- Package name `enso-workflow-builder` @ `0.1.0`
- ng-packagr library + SPA demo remains
- Public API: shells, `provideWorkflowBuilderUi`, `WorkflowFacade` document I/O
- Angular 20 as peerDeps
- `npm pack` this increment; no `npm publish` unless asked later
- Do not publish `src/app/try/` or secrets

---

## Persona ↔ Story Mapping

| Story | P-HOST | P-AUTHOR | P-REVIEWER |
|---|---|---|---|
| US-NP-01 Install and import public API | ● | ○ | ○ |
| US-NP-02 Styles / tokens | ● | ○ | ○ |
| US-NP-03 npm pack; publish documented not run | ● | ○ | ○ |
| US-NP-04 SPA + docs; no try/secrets in tarball | ● | ● | ○ |

● = primary · ○ = secondary / sees result

---

## Traceability FR ↔ US

| FR | Stories |
|---|---|
| FR-NP-01 Angular library project | US-NP-01 |
| FR-NP-02 Package identity | US-NP-01 |
| FR-NP-03 Public barrel | US-NP-01 |
| FR-NP-04 Styles and assets | US-NP-02 |
| FR-NP-05 Peer dependencies | US-NP-01 |
| FR-NP-06 Pack, not publish | US-NP-03 |
| FR-NP-07 SPA still builds and tests | US-NP-04 |
| FR-NP-08 Embed docs | US-NP-04 |
| FR-NP-09 Do not publish secrets or try | US-NP-04 |

---

## INVEST check

| Story | I | N | V | E | S | T |
|---|---|---|---|---|---|---|
| US-NP-01 | ● | ● | ● | ● | ● | ● |
| US-NP-02 | ● | ● | ● | ● | ● | ● |
| US-NP-03 | ● | ● | ● | ● | ● | ● |
| US-NP-04 | ● | ● | ● | ● | ● | ● |

---

## US-NP-01 — Host installs `enso-workflow-builder` and imports the embed API

**As a** Host Integrator  
**I want** an npm package that exports the shells, provider, and facade  
**So that** I do not copy `src/app` from this repo  

**FR**: FR-NP-01, FR-NP-02, FR-NP-03, FR-NP-05 · **Persona**: P-HOST  

**Acceptance criteria**
```text
Given the library project is in this repo
Then it is an Angular ng-packagr library (SPA app still exists)
And its package.json name is enso-workflow-builder and version is 0.1.0
```
```text
Given a host Angular 20 app that lists enso-workflow-builder and Angular peers
When the host imports from 'enso-workflow-builder'
Then they can use wb-shell-layout, wb-agent-skills-shell, provideWorkflowBuilderUi, and WorkflowFacade (loadDocument / getDocument / dirty)
And Angular is not bundled inside the library (peerDependencies)
And src/app/try and the SPA App are not the package entry
```

---

## US-NP-02 — Host can include required styles without copying undocumented CSS

**As a** Host Integrator  
**I want** theme tokens / global styles shipped or clearly documented  
**So that** the embedded shells look correct  

**FR**: FR-NP-04 · **Persona**: P-HOST  

**Acceptance criteria**
```text
Given the host installs enso-workflow-builder
When they follow embed docs for styles
Then they can include the package tokens/styles (or a documented path) without guessing src/styles.css from this repo
And fill-host height remains the host wrapper's job
```

---

## US-NP-03 — Library packs locally; publish is documented, not run

**As a** Host Integrator  
**I want** a tarball I can install before a registry publish  
**So that** I can try the package without npmjs this increment  

**FR**: FR-NP-06 · **Persona**: P-HOST  

**Acceptance criteria**
```text
Given the library build succeeds
When npm pack is run for the library
Then a tarball named like enso-workflow-builder-0.1.0.tgz is produced
```
```text
Given embed docs
Then npm publish is described
And this increment does not require running npm publish
```

---

## US-NP-04 — SPA still works; docs use package imports; tarball is clean

**As a** Host Integrator  
**I want** docs that import from `enso-workflow-builder` and a pack that has no secrets  
**So that** authors keep the demo SPA and I do not leak try/ or tokens  

**FR**: FR-NP-07, FR-NP-08, FR-NP-09 · **Persona**: P-HOST, P-AUTHOR  

**Acceptance criteria**
```text
Given the library exists
When npm test and SPA npm run build run
Then they stay green
And chrome flags, palettes, Properties, nested agent, and host embed contract still work in the SPA
```
```text
Given docs/workflow-builder-ui-embed.md
When a host reads install instructions
Then they see npm install enso-workflow-builder (and local npm pack)
And import examples use the package name, not this repo's relative src paths as the only option
And examples contain no secrets
```
```text
Given the packed tarball
Then it does not include src/app/try or secrets
```
