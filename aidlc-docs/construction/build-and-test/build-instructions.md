# Build Instructions

SPA increment **Enter agent without tab bar** (U-AE-01). Prior increment U-HP-01 remains in this SPA.

## Prerequisites
- **Build Tool**: npm + Angular 20 (`@angular/cli` ^20.3)
- **Dependencies**: `npm install`
- **Environment Variables**: none for local build. Do not add host secrets to `src/environments/` or embed examples.
- **System Requirements**: Node.js for Angular 20

Repo root: `/Users/sreeram/ofcwork/workflow-builder`

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
No extra env vars. Chrome still comes from `provideWorkflowBuilderUi` / JSON / instance `[ui]`. `agentTabs.enabled` hides the tab strip only; it does not block `/agent/:id`.

### 3. Build All Units
```bash
npm run build
```

### 4. Verify Build Success
- **Expected Output**: `dist/workflow-builder`
- **Build Artifacts**: hashed `main` / `polyfills` / `styles`
- **Common Warnings**: initial bundle ~600 kB vs 500 kB warn (accepted); left-sidebar CSS budget warning if present

Verified 2026-08-18: `ng build` success, `dist/workflow-builder` (main ~564 kB raw / ~600 kB initial total).

## Troubleshooting

### Build Fails with Dependency Errors
- **Cause**: incomplete install
- **Solution**: `npm install` at repo root

### Build Fails with Compilation Errors
- **Cause**: missing `agentTabsChromeEnabled` / `setAgentTabsChromeEnabled` / `headerOverlayShown` / `onNestedBack`
- **Solution**: `npm test` then restore the reported symbol from U-AE-01 Code Generation
