# Build Instructions — U-PAL-02 Catalog wiring + docs

## Prerequisites
- **Build Tool**: npm + Angular 20
- **Dependencies**: `npm install` at repo root
- **Environment Variables**: none for local build (Enso auth is optional at runtime)
- **System Requirements**: Node.js for Angular 20

Repo root: `/Users/sreeram/ofcwork/workflow-builder`

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
No extra env vars. Runtime chrome + palette JSON: `src/assets/wb-ui-config.json` (committed `{}`).  
Catalog adapters are provider-only (`provideWorkflowBuilderUi({ catalog })`), not JSON.

### 3. Build
```bash
npm run build
```

Single SPA bundle (U-PAL-01 helpers + U-PAL-02 catalog/sidebar).

### 4. Verify
- **Expected Output**: `dist/workflow-builder`
- **Build Artifacts**: hashed `main` / `polyfills` / `styles` + `/assets` (including `examples/wb-ui-config.palette-host.json`)
- **Common Warnings** (non-blocking): initial bundle ~580 kB vs 500 kB; left-sidebar CSS ~6 kB vs 4 kB

## Troubleshooting

### Build Fails with Dependency Errors
- **Cause**: incomplete `node_modules`
- **Solution**: `npm install` at repo root

### Build Fails with Compilation Errors
- **Cause**: TypeScript errors in catalog, ui-config, or left-sidebar
- **Solution**: `npm test` then fix the reported file
