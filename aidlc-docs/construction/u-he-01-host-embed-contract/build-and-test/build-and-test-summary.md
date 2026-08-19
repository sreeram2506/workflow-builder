# Build and Test Summary

SPA increment **Host embed contract** (U-HE-01).

**Date**: 2026-08-19  
**Status**: APPROVED

## Build Status
- **Build Tool**: Angular 20 / `npm run build`
- **Build Status**: Success
- **Build Artifacts**: `dist/workflow-builder`
- **Build Time**: verified during Code Generation (`npm test` + `ng build`)
- **Warnings**: initial bundle ~604 kB (warn 500 kB); left-sidebar CSS budget; accepted

## Test Execution Summary

### Unit Tests
- **Total Tests**: 298
- **Passed**: 298
- **Failed**: 0
- **Coverage**: not enforced
- **Status**: Pass

### Integration Tests
- **Test Scenarios**: load/fail-safe; getDocument + dirty + documentChange; Save/Run first-win vs defaults; fill-host height (automated). Manual embed/try documented.
- **Passed**: included in the 298
- **Failed**: 0
- **Status**: Pass (automated)

### Performance Tests
- **Status**: N/A (no NFR targets; NFR Design skipped)

### Additional Tests
- **Contract Tests**: N/A (client SPA; persist is in-process callbacks, not a service contract suite)
- **Security Tests**: Pass via allowlist parse, invalid-load fail-safe, no secrets in docs; `security-test-instructions.md`; no separate scanner job in this stage
- **E2E Tests**: N/A (no Playwright/Cypress suite in `package.json`)
- **PBT (Partial)**: Pass — serialize/parse and `parseWorkflowUnknown` object round-trip (`workflow.serialize.spec.ts`)

## Overall Status
- **Build**: Success
- **All Tests**: Pass
- **Ready for Operations**: Yes (placeholder stage)

## Next Steps
Build and Test approved. Operations placeholder: `aidlc-docs/operations/host-embed-contract-operations-placeholder.md`.

## Extension compliance (this stage)

| Extension / rule | Status | Rationale |
|---|---|---|
| Security Baseline (new-code) | Compliant | Allowlist parse; non-secret errors; no tokens in docs/emits |
| SECURITY-01..04, 06..10, 12..14 | N/A | No new stores, intermediaries, headers, IAM, or auth surfaces |
| SECURITY-05 / 11 / 15 | Compliant | Invalid load keeps last good; never throw to host |
| Resiliency Baseline | Directional / N/A | Fail-safe invalid load; DR N/A (SPA increment) |
| PBT Partial | Compliant | serialize / `parseWorkflowUnknown` round-trip |
