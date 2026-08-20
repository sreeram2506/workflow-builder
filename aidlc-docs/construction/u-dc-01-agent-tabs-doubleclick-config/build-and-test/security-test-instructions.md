# Security Test Instructions

## Purpose
Security Baseline is enabled (new-code scoped). This increment must not put secrets in UI config JSON, `[ui]`, merge tests, or embed docs.

## Automated
```bash
npm test
```

Covered in this increment:
- Boolean normalize via `pickBooleanLeaves` (non-boolean `doubleClick` dropped)
- Invalid JSON still keeps defaults (`UiConfigService`)
- Embed docs (`docs/workflow-builder-ui-embed.md`) do not add secrets

## Checks (manual / review)
1. Confirm example JSON has no tokens (`all-on` / `all-off` / `minimal-canvas`)
2. Confirm `docs/workflow-builder-ui-embed.md` parent example has no access tokens
3. Confirm `src/app/try/` is not committed

## Not in this increment
- Dependency CVE scanners / pentest jobs (repo CI, not this unit)
- HTML security headers (host page owns headers for the embed)
- New authn/authz or HTTP surfaces
