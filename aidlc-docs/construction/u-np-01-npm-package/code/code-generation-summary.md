# Code Generation Summary — U-NP-01 npm package

**Stories**: US-NP-01, US-NP-02, US-NP-03, US-NP-04  
**Status**: Part 2 complete (awaiting approval)

## Created (application)

- `projects/enso-workflow-builder/` (ng-packagr library)
- `projects/enso-workflow-builder/src/public-api.ts`
- `projects/enso-workflow-builder/src/styles/tokens.css`
- `projects/enso-workflow-builder/src/lib` → symlink to `src/app`
- `src/app/core/builder-env.ts`
- `src/public-package-api.spec.ts`

## Modified

- `angular.json`, workspace `package.json`, `package-lock.json`
- `tsconfig.spec.json` (path mapping for `'enso-workflow-builder'`)
- `.gitignore` (`*.tgz`)
- `src/app/core/facade/workflow.facade.ts`, `src/app/core/run/run-simulation.service.ts`
- `src/environments/environment.ts`
- `docs/workflow-builder-ui-embed.md` — `npm install enso-workflow-builder`, package imports, peers, styles, pack path, publish documented not run

## Unchanged (confirmed)

- SPA application project remains
- `src/app/try/` not committed
- `npm publish` not run
- Existing serialize PBT kept

## Verification

- `ng build enso-workflow-builder` — success
- `npm pack ./dist/enso-workflow-builder` — `enso-workflow-builder-0.1.0.tgz` (tokens.css included; no try/ or `.env`)
- `npm test` — 300 passed / 41 files
- SPA `npm run build` — success (existing budget warnings)

## SKIP

- API layer, repository layer, cloud deployment artifacts — N/A (client library)
