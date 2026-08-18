# Build Instructions

SPA increment **Remove APIs and dummy data** (U-RAD-01).

## Prerequisites
- **Build Tool**: npm + Angular 20
- **Dependencies**: `npm install`
- **Environment Variables**: none for local build. Catalog credentials are not used and must not be added back to `src/environments/`.
- **System Requirements**: Node.js for Angular 20

Repo root: `/Users/sreeram/ofcwork/workflow-builder`

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
No extra env vars. `environment.ts` / `environment.prod.ts` keep `production`, `routingGridSize`, `routingObstaclePadding`, and `runStepDelayMs` only.

Dev serve does not use `proxy.conf.json` (removed). Host catalog data is `[palettes]` / adapters only.

### 3. Build All Units
```bash
npm run build
```

### 4. Verify Build Success
- **Expected Output**: `dist/workflow-builder`
- **Build Artifacts**: hashed `main` / `polyfills` / `styles`
- **Common Warnings**: initial bundle ~583 kB vs 500 kB warn (accepted); other existing CSS budget warnings if present

Verified 2026-08-17: `ng build` success, `dist/workflow-builder`.

## Troubleshooting

### Build Fails with Dependency Errors
- **Cause**: incomplete install
- **Solution**: `npm install` at repo root

### Build Fails with Compilation Errors
- **Cause**: leftover imports of deleted Enso mappers, `MOCK_SKILLS`, Repeater mock catalog, or `environment.enso*`
- **Solution**: `npm test` then remove the reported symbol; do not restore HTTP or dummy catalogs
