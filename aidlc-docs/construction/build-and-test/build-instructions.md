# Build Instructions

**Scope**: Units U1–U9 (including Logic Node Properties increment)  
**Workspace**: `/Users/sreeram/ofcwork/workflow-builder`

## Prerequisites
- **Build Tool**: Angular CLI via npm (`@angular/cli` ^20.3)
- **Runtime**: Node.js **22.21.1** (or compatible Node 22.x); npm **11.x**
- **Dependencies**: Root `package.json` (Angular 20, `@angular/cdk` ^20.2, `@angular/forms`, Vitest, fast-check)
- **Environment Variables**: Optional `environment.ensoAccessToken` for live enso palette; U6 `routingGridSize` / `routingObstaclePadding`; U8 `runStepDelayMs` (default 400)
- **System Requirements**: Desktop evergreen browser for `ng serve` (`structuredClone` required for history; `matchMedia` for reduced-motion)

## Build Steps

### 1. Install Dependencies
```bash
cd /Users/sreeram/ofcwork/workflow-builder
npm install
```

### 2. Configure Environment
- No `.env` required for mock graph / in-memory history / Run simulation / Repeater mock catalog
- Optional: enso token + `proxy.conf.json` for live palette
- Workflows are **not** persisted to localStorage (refresh clears)
- Optional: tune `runStepDelayMs` (reduced-motion still caps ≤50 ms)

### 3. Build All Units
```bash
npm run build
```

### 4. Verify Build Success
- **Expected**: `Application bundle generation complete` → `dist/workflow-builder/`
- **Last verified** (2026-08-14T04:04:02Z): ~504.34 kB raw main / ~540.48 kB initial total / ~134.68 kB estimated transfer
- **Common warnings** (acceptable for this prototype):
  - initial bundle budget 500 kB exceeded by ~40.48 kB
  - `left-sidebar.component.ts` styles budget 4 kB exceeded (~6.44 kB)

### 5. Dev Serve
```bash
npm start
```

## Troubleshooting

### Build Fails with Dependency Errors
- **Cause**: Wrong Node, incomplete `node_modules`
- **Solution**: Confirm Node 22.x; delete `node_modules` and reinstall

### Build Fails with Compilation Errors
- **Cause**: Type errors in `src/`
- **Solution**: Fix reported paths; re-run `npm run build`
- Enso palette auth/network: static fallback + banner
- Angular 22 needs newer Node — stay on Angular 20 for this machine
