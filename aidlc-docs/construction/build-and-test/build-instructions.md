# Build Instructions

**Scope**: Units U1–U8  
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
- No `.env` required for mock graph / in-memory history / Run simulation
- Optional: enso token + `proxy.conf.json` for live palette
- Workflows are **not** persisted to localStorage (refresh clears)
- Optional: tune `runStepDelayMs` (reduced-motion still caps ≤50 ms)

### 3. Build
```bash
npm run build
```

### 4. Verify Build Success
- **Expected**: `Application bundle generation complete` → `dist/workflow-builder/`
- **Last verified** (2026-08-12T08:13:51Z): ~468.13 kB raw main / ~504.21 kB initial total / ~128.00 kB estimated transfer
- **Common warning**: initial bundle budget 500 kB exceeded by ~4 kB (acceptable for this prototype)

### 5. Dev Serve
```bash
npm start
```

## Troubleshooting
- Dependency errors: confirm Node 22.x; reinstall `node_modules`
- Compile errors: fix reported `src/` paths; re-run `npm run build`
- Enso palette auth/network: static fallback + banner
- Angular 22 needs newer Node — stay on Angular 20 for this machine
