# Build Instructions

SPA increment **Host embed contract** (U-HE-01). Prior increment U-AE-01 remains in this SPA.

## Prerequisites
- **Build Tool**: npm + Angular 20 (`@angular/cli` ^20.3)
- **Dependencies**: `npm install`
- **Environment Variables**: none for local build. Do not add host secrets to documents, persist handlers, or embed examples.
- **System Requirements**: Node.js for Angular 20

Repo root: `/Users/sreeram/ofcwork/workflow-builder`

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
No extra env vars. Host contract is in-process:

- `[document]` / `(documentChange)` on `wb-shell-layout`
- `provideWorkflowBuilderUi({ persist: { save, run } })` and/or shell `(save)` / `(run)`
- Shells fill the host box (`height: 100%`); host wrapper must have a definite height

### 3. Build All Units
```bash
npm run build
```

### 4. Verify Build Success
- **Expected Output**: `dist/workflow-builder`
- **Build Artifacts**: hashed `main` / `polyfills` / `styles`
- **Common Warnings**: initial bundle ~604 kB vs 500 kB warn (accepted); left-sidebar CSS budget warning if present

Verified 2026-08-19: `ng build` success, `dist/workflow-builder` (main ~568 kB raw / ~604 kB initial total).

## Troubleshooting

### Build Fails with Dependency Errors
- **Cause**: incomplete install
- **Solution**: `npm install` at repo root

### Build Fails with Compilation Errors
- **Cause**: missing `loadDocument` / `getDocument` / `requestSave` / `WORKFLOW_BUILDER_PERSIST` / `parseWorkflowUnknown`
- **Solution**: `npm test` then restore the reported symbol from U-HE-01 Code Generation
