# Security Test Instructions

## Purpose
Security Baseline is enabled (new-code scoped). This increment sanitizes host `iconUrl` before `<img src>` and on drop.

## Automated
```bash
npm test
```

Covered in unit specs:
- `sanitizeIconUrl` rejects `javascript:`, `http:`, `file:`, protocol-relative, `../`, non-raster `data:` (P-LIM-01)
- Factory drops unsafe `iconUrl` on drop
- Embed docs: do not put access tokens in palette items, `metadata`, or examples

## Not in this increment
- Dependency CVE scanners / pentest jobs (repo CI, not this unit)
- Canvas XSS via `iconPath`: path is bound as SVG `d`, not `innerHTML`
