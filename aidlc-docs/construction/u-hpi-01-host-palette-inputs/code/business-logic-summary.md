# Business Logic Summary — U-HPI-01 Host palette inputs

**Stories**: US-HPI-01..06

## Created

None (helpers extended in place).

## Modified

| Path | Change |
|---|---|
| `src/app/core/domain/palette-host.helpers.ts` | `sanitizeHostPaletteItems`, `sanitizeHostDefaultAgents` |
| `src/app/core/domain/palette-host.helpers.spec.ts` | Stream drop, missing fields, default-agent cards |
| `src/app/core/domain/palette-host.helpers.pbt.spec.ts` | Unknown types / blank key-label never in output |
| `src/app/core/data/catalog.types.ts` | `hostPalettes` / `hostDefaultAgents`; `source: 'host'` |
| `src/app/core/data/enso-task-catalog.service.ts` | Present overlay skips Enso/adapter; `[]` empty-remote; all-dropped still OK compose; host defaultAgents win over JSON |
| `src/app/core/data/enso-task-catalog.service.spec.ts` | Omit / `[]` / items; provider override; Stream drop; all-unknown; defaultAgents |

## Rules implemented

- Unbound overlay → U-PAL-02
- `hostPalettes: []` → `source: 'host'`, `emptyRemote: true`
- Present items → featured + defaults + sanitized rows; Enso/adapter not called
- Component palettes win over catalog provider
- Unknown `type` / invalid shapes skipped; non-empty all-dropped is not empty-remote
- Present `hostDefaultAgents` replaces JSON; ignored when palettes is `[]`
