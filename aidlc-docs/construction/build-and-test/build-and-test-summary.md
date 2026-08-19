# Build and Test Summary

Increment **npm package publish** (U-NP-01, `enso-workflow-builder` @ `0.1.0`).

**Date**: 2026-08-19  
**Status**: APPROVED

## Build Status
- **Build Tool**: Angular 20 / ng-packagr / `npm run build` + `npm run build:lib`
- **Build Status**: Success
- **Build Artifacts**: `dist/enso-workflow-builder` (library), `enso-workflow-builder-0.1.0.tgz`, `dist/workflow-builder` (SPA)
- **Build Time**: verified during Code Generation
- **Warnings**: SPA initial bundle ~604 kB (warn 500 kB); left-sidebar CSS budget; accepted
- **Not run**: `npm publish`

## Test Execution Summary

### Unit Tests
- **Total Tests**: 300
- **Passed**: 300
- **Failed**: 0
- **Coverage**: not enforced
- **Status**: Pass

### Integration Tests
- **Test Scenarios**: public API import; library build + pack; tarball excludes try/secrets; SPA still green. Manual host tarball install documented.
- **Passed**: public API spec included in the 300; pack verified
- **Failed**: 0
- **Status**: Pass (automated)

### Performance Tests
- **Status**: N/A (no NFR targets; NFR Design skipped)

### Additional Tests
- **Contract Tests**: N/A (client library; no service contract suite)
- **Security Tests**: Pass via tarball hygiene, no secrets in docs/barrel; `security-test-instructions.md`; no separate scanner job in this stage
- **E2E Tests**: N/A (no Playwright/Cypress suite in `package.json`)
- **PBT (Partial)**: Pass — existing serialize / `parseWorkflowUnknown` round-trip unchanged

## Overall Status
- **Build**: Success
- **All Tests**: Pass
- **Ready for Operations**: Yes (placeholder stage)

## Next Steps
Build and Test approved. Operations placeholder: `aidlc-docs/operations/npm-package-operations-placeholder.md`.

## Extension compliance (this stage)

| Extension / rule | Status | Rationale |
|---|---|---|
| Security Baseline (new-code) | Compliant | No secrets in barrel/docs/tarball; try/ excluded |
| Other SECURITY (stores/auth/IAM/headers) | N/A | No new stores, auth, or HTTP surfaces |
| Resiliency Baseline | Directional / N/A | DR N/A; U-HE-01 invalid-load fail-safe unchanged |
| PBT Partial | Compliant | Existing serialize PBT; no new transform |
