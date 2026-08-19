# Build Instructions

Increment **npm package publish** (U-NP-01). SPA demo remains. Prior units (including U-HE-01 host embed) stay in this repo.

## Prerequisites
- **Build Tool**: npm + Angular 20 (`@angular/cli` ^20.3) + ng-packagr ^20.3
- **Dependencies**: `npm install`
- **Environment Variables**: none for local library/SPA build. Do not put registry tokens or secrets in the library, docs, or tarball.
- **System Requirements**: Node.js for Angular 20; git symlink support (`projects/enso-workflow-builder/src/lib` → `src/app`)

Repo root: `/Users/sreeram/ofcwork/workflow-builder`

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
No extra env vars.

- Library npm name: `enso-workflow-builder` @ `0.1.0`
- Public API: `wb-shell-layout`, `wb-agent-skills-shell`, `provideWorkflowBuilderUi`, `WorkflowFacade`
- Angular 20 + CDK + rxjs + zone.js are **peerDependencies** (not bundled)
- Do **not** run `npm publish` unless asked later with registry auth

Confirm the library symlink exists:

```bash
ls -l projects/enso-workflow-builder/src/lib
```

Expected: `lib -> ../../../src/app`

### 3. Build All Units
```bash
npm run build:lib
npm run pack:lib
npm run build
```

`pack:lib` runs `ng build enso-workflow-builder` then `npm pack` from `dist/enso-workflow-builder`.

### 4. Verify Build Success
- **Expected Output**:
  - `dist/enso-workflow-builder/` (FESM, `index.d.ts`, `styles/tokens.css`, `package.json`)
  - `dist/enso-workflow-builder/enso-workflow-builder-0.1.0.tgz`
  - `dist/workflow-builder/` (SPA)
- **Build Artifacts**: library tarball is gitignored (`*.tgz`, `/dist`)
- **Common Warnings**: SPA initial bundle ~604 kB vs 500 kB warn (accepted); left-sidebar CSS budget warning if present

Verified 2026-08-19: library build success; tarball `enso-workflow-builder-0.1.0.tgz`; SPA `ng build` success (~604 kB initial).

## Troubleshooting

### Build Fails with Dependency Errors
- **Cause**: incomplete install or missing `ng-packagr`
- **Solution**: `npm install` at repo root

### Library build: `referencedFiles[index]` / files outside project
- **Cause**: ng-packagr cannot compile sources outside `projects/enso-workflow-builder` unless they appear in-tree
- **Solution**: restore `projects/enso-workflow-builder/src/lib` as a symlink to `../../../src/app` (do not copy a second app tree)

### SPA build fails after packaging
- **Cause**: broken relative imports in `src/app`
- **Solution**: SPA still imports from `src/app`; only the public-API spec imports `'enso-workflow-builder'` via `tsconfig.spec.json` paths
