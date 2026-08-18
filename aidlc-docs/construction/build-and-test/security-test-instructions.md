# Security Test Instructions

## Purpose
Security Baseline is enabled (new-code scoped). This increment strips stored catalog credentials and removes Enso HTTP so tokens are not sent from the SPA.

## Automated
```bash
npm test
```

Covered in this increment:
- `src/environments/environment.ts` and `environment.prod.ts` contain no catalog URLs, solution/user/agent ids, or access tokens (NFR-RAD-01)
- Catalog service has no `HttpClient` and does not read `environment.enso*`
- Embed / README examples do not include Bearer tokens or `/enso-api` proxy setup
- Host `[palettes]` still go through existing sanitize (`sanitizeHostPaletteItems`)

## Checks (manual / review)
1. `rg -n "ensoAccessToken|Bearer |proxy.conf" src docs README.md angular.json` — expect no catalog token or Enso proxy
2. Confirm `proxy.conf.json` is deleted
3. Confirm omit-without-adapter does not fall back to a remote catalog

## Not in this increment
- Dependency CVE scanners / pentest jobs (repo CI, not this unit)
- HTML security headers (host page owns headers for the embed)
- New authn/authz surfaces
