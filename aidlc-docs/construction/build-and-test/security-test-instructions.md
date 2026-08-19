# Security Test Instructions

## Purpose
Security Baseline is enabled (new-code scoped). The published package and embed docs must not contain secrets, `.env`, or `src/app/try/`.

## Automated
```bash
npm test
npm run pack:lib
tar -tzf dist/enso-workflow-builder/enso-workflow-builder-0.1.0.tgz
```

Covered in this increment:
- Public barrel does not export SPA `App` or try/
- Tarball listing has no `try/` or `.env`
- Embed docs (`docs/workflow-builder-ui-embed.md`) use package imports and do not add secrets
- U-HE-01 allowlist parse / invalid-load fail-safe unchanged

## Checks (manual / review)
1. Confirm `projects/enso-workflow-builder/src/public-api.ts` does not export try/ or `App`
2. Confirm tarball has `styles/tokens.css` and compiled JS only (no credentials)
3. Confirm `src/app/try/` is still gitignored and not committed
4. Confirm this increment did **not** run `npm publish`

## Not in this increment
- Dependency CVE scanners / pentest jobs (repo CI, not this unit)
- Registry auth / npmjs publish
- New authn/authz or HTTP surfaces
