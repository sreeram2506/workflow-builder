# Build Instructions — U-UI-02 Chrome Wiring

## Prerequisites
- **Build Tool**: npm + Angular CLI 20 (`ng build` via `package.json`)
- **Dependencies**: `npm install` at repo root (Angular 20, CDK, Vitest)
- **Environment Variables**: none required for local build
- **System Requirements**: Node.js capable of Angular 20; macOS/Linux/Windows

Repo root: `/Users/sreeram/ofcwork/workflow-builder`

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
No extra env vars. Runtime UI flags load from `src/assets/wb-ui-config.json` (copied to `/assets/wb-ui-config.json`).

### 3. Build All Units
```bash
npm run build
```

This is a single SPA build (U-UI-01 config core + U-UI-02 chrome gates in one bundle).

### 4. Verify Build Success
- **Expected Output**: `Application bundle generation complete` and `Output location: .../dist/workflow-builder`
- **Build Artifacts**: `dist/workflow-builder/` (`main-*.js`, `polyfills-*.js`, `styles-*.css`, hashed assets including `/assets/wb-ui-config.json`)
- **Common Warnings** (non-blocking):
  - Initial bundle budget 500 kB warning (latest: 576.48 kB; error cap 1 MB)
  - `left-sidebar.component.ts` component CSS budget 4 kB warning (latest: 6.00 kB; error cap 8 kB)

## Troubleshooting

### Build Fails with Dependency Errors
- **Cause**: Missing `node_modules` or lockfile drift
- **Solution**: Delete `node_modules`, run `npm install` from repo root, retry `npm run build`

### Build Fails with Compilation Errors
- **Cause**: TypeScript errors in shell/canvas/ui-config sources
- **Solution**: Run `npm test` to isolate; fix the reported file; do not raise budget **error** thresholds without an explicit change request
