# Build Instructions

SPA increment **Generic host-driven Properties** (U-HP-01).

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
No extra env vars. Chrome/catalog still come from `provideWorkflowBuilderUi` / JSON / `[palettes]`. Properties schema is palette copy + optional `provideWorkflowBuilderUi({ properties })`.

### 3. Build All Units
```bash
npm run build
```

### 4. Verify Build Success
- **Expected Output**: `dist/workflow-builder`
- **Build Artifacts**: hashed `main` / `polyfills` / `styles`
- **Common Warnings**: initial bundle ~583 kB vs 500 kB warn (accepted); left-sidebar CSS budget warning if present

Verified 2026-08-18: `ng build` success, `dist/workflow-builder`.

## Troubleshooting

### Build Fails with Dependency Errors
- **Cause**: incomplete install
- **Solution**: `npm install` at repo root

### Build Fails with Compilation Errors
- **Cause**: leftover `enso-task-form` / `collectEnsoTaskFields` / `XpmsFieldDescriptor` / `configurationFieldsFor` Ignore Keys imports
- **Solution**: `npm test` then remove the reported symbol; hosts must supply `propertiesSchema` or `schemaFor` for Action/Trigger fields
