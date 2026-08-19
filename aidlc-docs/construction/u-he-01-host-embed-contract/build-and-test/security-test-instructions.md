# Security Test Instructions

## Purpose
Security Baseline is enabled (new-code scoped). This increment must not put secrets in documents, `(documentChange)` emits, persist examples, or embed docs. Invalid load must not throw to the host page.

## Automated
```bash
npm test
```

Covered in this increment:
- `parseWorkflowUnknown` allowlists top-level keys (unknown keys stripped)
- Invalid `loadDocument` sets a non-secret canvas error and does not throw (`workflow.facade.spec.ts`)
- Embed docs (`docs/workflow-builder-ui-embed.md` Document I/O) do not add secrets

## Checks (manual / review)
1. Confirm a bad `[document]` leaves the previous graph and does not surface tokens
2. Confirm `docs/workflow-builder-ui-embed.md` persist examples have no access tokens
3. Confirm `src/app/try/` is not committed

## Not in this increment
- Dependency CVE scanners / pentest jobs (repo CI, not this unit)
- HTML security headers (host page owns headers for the embed)
- New authn/authz or HTTP surfaces
