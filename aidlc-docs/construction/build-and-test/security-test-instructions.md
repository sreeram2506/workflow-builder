# Security Test Instructions

## Purpose
Security Baseline is enabled (new-code scoped). This increment must not put host secrets in schema, `taskMeta`, or embed examples; must not HTML-render unknown widgets; must skip unsafe field paths.

## Automated
```bash
npm test
```

Covered in this increment:
- `sanitizeHostPropertiesSchema` drops empty path and paths containing `..` (P-HP-01)
- Unknown `ui_component` is a disabled text control (not a live widget / innerHTML)
- Public adapter / embed docs do not use host-specific secret field names or tokens
- `sanitizeHostPaletteItems` still sanitizes `iconUrl` and copies only a plain-object schema

## Checks (manual / review)
1. Confirm `docs/workflow-builder-ui-embed.md` has no access tokens in `propertiesSchema` / `taskMeta` examples
2. Confirm unknown widgets are not bound as dynamic Angular components
3. Confirm leftover `ensoTask` is not a form source

## Not in this increment
- Dependency CVE scanners / pentest jobs (repo CI, not this unit)
- HTML security headers (host page owns headers for the embed)
- New authn/authz surfaces
