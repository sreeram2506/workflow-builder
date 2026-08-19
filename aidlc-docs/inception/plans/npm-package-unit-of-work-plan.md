# Unit of Work Plan — npm package publish

**Role**: Units Planner  
**Status**: STAGE GENERATED — awaiting approval  
**Locked**: Q1=A · Q2=A · Q3=A · Q4=A  
**Application Design**: SKIP (execution plan Q1=A)  
**Execution plan**: Q1=A — **1 unit U-NP-01**; skip FD/NFR/Infra; then CG → Build/Test  
**Stories**: US-NP-01..04  

Plan locked. Unit artifacts generated. Awaiting approval to enter CONSTRUCTION.

**Category notes**
- Story grouping / business domain: Q1  
- Dependencies: single unit (Q1=A) — no inter-unit protocol; Q2 covers construction sequence  
- Team: Q4  
- Technical / deploy: library + SPA in same repo (Q3)  
- Code organization: brownfield library extract (Q3)  

Additive files after approval: `npm-package-unit-of-work*.md`

---

## Proposed unit

| Unit | Stories | Owns |
|---|---|---|
| **U-NP-01** | US-NP-01..04 | ng-packagr library `enso-workflow-builder` @ 0.1.0; public barrel; peerDeps; styles/tokens; `npm pack`; embed docs; SPA still green; no try/secrets in tarball |

Construction (recommended, matches execution plan): skip Functional Design and NFR/Infra; Code Generation → Build and Test.

**Internal order (recommended)**  
1. Library project + package.json name/version + peerDeps (FR-NP-01, FR-NP-02, FR-NP-05)  
2. Public API barrel (FR-NP-03)  
3. Styles/tokens (FR-NP-04)  
4. `npm pack`; docs; SPA test/build; tarball excludes try/ (FR-NP-06..09)  

---

## Execution checklist (Part 2 — after plan approval)

- [x] Generate `npm-package-unit-of-work.md`
- [x] Generate `npm-package-unit-of-work-dependency.md`
- [x] Generate `npm-package-unit-of-work-story-map.md`
- [x] Document brownfield code organization
- [x] Validate all US-NP-01..04 assigned

---

## Question 1

**Story grouping / domain boundary**

A) **Recommended** — All US-NP-01..04 in **U-NP-01** (one construction module: npm library)

B) Split into 2 units (library+API vs pack+docs+SPA)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 2

**Construction stages / dependencies**

A) **Recommended** — Per execution plan: skip Functional Design and NFR/Infra; Code Generation → Build/Test. Single-unit sequence; no inter-unit API.

B) Add Functional Design before Code Generation (same 1 unit)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 3

**Code organization (brownfield)**

A) **Recommended** — Add Angular library `projects/enso-workflow-builder` (ng-packagr). npm name `enso-workflow-builder` @ `0.1.0`. Public `public-api.ts` exports shells, `provideWorkflowBuilderUi`, `WorkflowFacade`, needed types. Peer Angular 20 + CDK + rxjs + zone.js. Ship or document styles/tokens. SPA project stays. Do not commit `src/app/try/`. Do not `npm publish` this increment.

B) Convert the repo to library-only this increment (remove or stop maintaining the SPA app)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4

**Team / ownership**

A) **Recommended** — Same stream owns U-NP-01 end-to-end (no split ownership)

B) Split ownership (describe after [Answer]:)

X) Other (please describe after [Answer]: tag below)

[Answer]: A
