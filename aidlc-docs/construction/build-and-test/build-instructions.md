# Build Instructions

SPA increment **Palette / catalog host config** (U-PAL-01 + U-PAL-02). Per-unit notes: `u-pal-01-palette-config-core/build-and-test/`, `u-pal-02-catalog-wiring/build-and-test/`.

## Prerequisites
- **Build Tool**: npm + Angular 20
- **Dependencies**: `npm install`
- **Environment Variables**: none for local build
- **System Requirements**: Node.js for Angular 20

Repo root: `/Users/sreeram/ofcwork/workflow-builder`

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
No extra env vars. Runtime file: `src/assets/wb-ui-config.json` (committed `{}`).  
Palette allow-lists / `defaultAgents` may live in that JSON. Catalog adapters are **provider-only**.

### 3. Build All Units
```bash
npm run build
```

### 4. Verify Build Success
- **Expected Output**: `dist/workflow-builder`
- **Build Artifacts**: hashed `main` / `polyfills` / `styles` + `/assets` (including `examples/wb-ui-config.palette-host.json`)
- **Common Warnings**: initial bundle ~580 kB vs 500 kB warn; left-sidebar CSS ~6 kB vs 4 kB warn

## Troubleshooting

### Build Fails with Dependency Errors
- **Cause**: incomplete install
- **Solution**: `npm install` at repo root

### Build Fails with Compilation Errors
- **Cause**: TypeScript errors in `src/`
- **Solution**: `npm test` then fix the reported file
