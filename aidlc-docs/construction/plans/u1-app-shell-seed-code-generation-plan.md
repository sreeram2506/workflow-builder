# U1 Code Generation Plan — App Shell, Tokens, Theme, Seed Store

**Status**: GENERATION COMPLETE — ROUND 3 APPLIED — AWAITING CODE APPROVAL  
**Unit**: `u1-app-shell-seed`  
**Workspace root**: `/Users/sreeram/ofcwork/workflow-builder`

### Story coverage
- [x] US-1.1 — Open application shell  
- [x] US-1.2 — See seeded mock workflow data (in store; canvas does not render nodes)  
- [x] US-1.3 — Toggle light and dark theme  

## Generation Steps

### Step 1 — Project structure setup (Angular CLI)
- [x] Backup/replace stub root `package.json` as needed for Angular app named `workflow-builder`
- [x] Scaffold with Angular CLI (Angular 20 — Node-compatible latest); standalone, CSS, npm
- [x] Feature-folder layout: `core/`, `features/shell|theme|canvas`
- [x] Vitest via `@angular/build:unit-test`
- [x] `fast-check` dependency
- [x] Build/serve scripts present

### Step 2 — Domain model + seed data
- [x] Domain types
- [x] Mock repository + branch seed

### Step 3 — Stores + facade + theme applicator
- [x] GraphStore, UiStore, WorkflowFacade, ThemeApplicator, providers

### Step 4 — Business logic unit testing (+ PBT smoke)
- [x] Facade tests + fast-check properties

### Step 5 — Business logic summary (docs)
- [x] `business-logic-summary.md`

### Step 6 — Frontend components generation
- [x] App, Shell, TopBar, ThemeToggle, Sidebars, CanvasHost, tokens

### Step 7 — Frontend component unit testing
- [x] `app.spec.ts`

### Step 8 — Frontend components summary (docs)
- [x] `frontend-components-summary.md`

### Step 9 — API layer
- [x] SKIP documented

### Step 10 — Repository layer
- [x] Mock repo + `repository-summary.md`

### Step 11 — Documentation
- [x] README + `code-generation-summary.md`

### Step 12 — Deployment artifacts
- [x] SKIP documented

### Step 13 — Verify Phase 1 gate
- [x] Build + tests pass; no Phase 2+ features
