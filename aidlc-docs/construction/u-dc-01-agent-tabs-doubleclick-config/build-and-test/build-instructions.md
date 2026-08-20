# Build Instructions

SPA increment **Agent tabs doubleClick config** (U-DC-01). Prior units remain in this SPA.

## Prerequisites
- **Build Tool**: npm + Angular 20 (`@angular/cli` ^20.3)
- **Dependencies**: `npm install`
- **Environment Variables**: none for local build. Do not add secrets to UI config JSON, `[ui]`, or embed examples.
- **System Requirements**: Node.js for Angular 20

Repo root: `/Users/sreeram/ofcwork/workflow-builder`

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
No extra env vars. Host chrome contract is in-process:

- `provideWorkflowBuilderUi({ features: { agentTabs: { enabled, doubleClick } } })`
- Instance `[ui]` on `wb-shell-layout`
- `/assets/wb-ui-config.json` (omit `doubleClick` → default `true`)

### 3. Build All Units
```bash
npm run build
```

### 4. Verify Build Success
- **Expected Output**: `dist/workflow-builder`
- **Build Artifacts**: hashed `main` / `polyfills` / `styles`
- **Common Warnings**: initial bundle ~605 kB vs 500 kB warn (accepted); left-sidebar CSS budget warning if present

Verified 2026-08-20: `ng build` success, `dist/workflow-builder` (main ~569 kB raw / ~605 kB initial total).

## Troubleshooting

### Build Fails with Dependency Errors
- **Cause**: incomplete install
- **Solution**: `npm install` at repo root

### Build Fails with Compilation Errors
- **Cause**: `AgentTabsFeatures` missing `doubleClick` or `UI_FEATURE_PATHS` missing `agentTabs.doubleClick`
- **Solution**: restore types + `createDefaultUiFeatures` `{ enabled: true, doubleClick: true }` from U-DC-01 Code Generation
