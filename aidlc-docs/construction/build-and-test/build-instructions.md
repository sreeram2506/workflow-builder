# Build Instructions

SPA increment **Host logic extras + agent metadata** (U-LIM-01).

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
No extra env vars. Host `[palettes]` / `[defaultAgents]` extras (`iconUrl`, `iconPath`, `metadata`) are instance inputs. Do not put tokens in those fields or in embed examples.

### 3. Build All Units
```bash
npm run build
```

### 4. Verify Build Success
- **Expected Output**: `dist/workflow-builder`
- **Build Artifacts**: hashed `main` / `polyfills` / `styles`
- **Common Warnings**: initial bundle ~590 kB vs 500 kB warn; left-sidebar CSS ~6.14 kB vs 4 kB warn (accepted)

Verified 2026-08-17: `ng build` success, `dist/workflow-builder`.

## Troubleshooting

### Build Fails with Dependency Errors
- **Cause**: incomplete install
- **Solution**: `npm install` at repo root

### Build Fails with Compilation Errors
- **Cause**: TypeScript errors in `src/`
- **Solution**: `npm test` then fix the reported file
