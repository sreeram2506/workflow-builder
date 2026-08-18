# Security Test Instructions

## Purpose
Security Baseline is enabled (new-code scoped). This increment must not add secrets, must keep invalid `/agent/:id` fail-safe, and must not put tokens in embed examples.

## Automated
```bash
npm test
```

Covered in this increment:
- `ensureAgentRoute('missing-agent')` redirects home (`workflow.facade.spec.ts`)
- `openAgentTab` still requires a solution AIAgent (non-AIAgent ignored)
- Embed docs (`docs/workflow-builder-ui-embed.md`) do not add secrets

## Checks (manual / review)
1. Confirm invalid nested agent URL still returns to the solution canvas
2. Confirm `docs/workflow-builder-ui-embed.md` nested-agent section has no access tokens
3. Confirm `src/app/try/` is not committed

## Not in this increment
- Dependency CVE scanners / pentest jobs (repo CI, not this unit)
- HTML security headers (host page owns headers for the embed)
- New authn/authz surfaces
