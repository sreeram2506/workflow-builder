# Build Instructions — Solution Workflow (U-SW-01a + U-SW-01b)

## Prerequisites

- **Build Tool**: Angular CLI 20 / `ng build` via npm scripts
- **Runtime**: Node.js 20+ recommended; npm
- **Dependencies**: See root `package.json` (Angular 20, CDK, RxJS, Zone.js)
- **Environment**: Optional Enso proxy — `proxy.conf.json` maps `/enso-api` → enso-suite-be
- **System**: macOS / Linux / Windows with sufficient disk for `node_modules` + `dist/`

## Build Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (optional for local Enso)

- Dev: `src/environments/environment.ts` (`ensoTaskListUrl`, `ensoPipelineListUrl`, token / workflow ids)
- Prod: `src/environments/environment.prod.ts`
- Serve with proxy when calling live Enso APIs:

```bash
ng serve --proxy-config proxy.conf.json
# or: npm start (if project already wires proxy)
```

### 3. Build All Units

```bash
npm run build
```

Produces SPA bundle under `dist/workflow-builder/`.

### 4. Verify Build Success

- **Expected**: `Application bundle generation complete` and `Output location: .../dist/workflow-builder`
- **Artifacts**: `dist/workflow-builder/main-*.js`, `polyfills-*.js`, `styles-*.css`
- **Acceptable warnings** (non-blocking as of 2026-08-15):
  - Initial bundle budget exceeded (~564 kB vs 500 kB)
  - Component style budgets for `top-bar` / `left-sidebar`

## Troubleshooting

### Dependency install fails

- Clear lock/cache issues: remove `node_modules`, re-run `npm install`
- Confirm Node/npm versions

### Compilation / type errors

- Run `npm test` to surface failing specs
- Ensure `environment.ts` / `environment.prod.ts` share the same keys (pipeline URL, workflow ids)
