# Build and Test — U-PAL-02 Catalog wiring + docs

**Date**: 2026-08-17  
**Unit**: `u-pal-02-catalog-wiring`  
**Status**: APPROVED  
**Stories**: US-PAL-05, US-PAL-06, US-PAL-07  

## Commands run

```bash
npm test
npm run build
```

## Results

| Check | Result |
|---|---|
| `npm test` | **203 passed** / 30 files |
| `npm run build` | Success → `dist/workflow-builder` |
| Warnings | Bundle budget (~580 kB vs 500 kB); left-sidebar CSS (~6 kB vs 4 kB) — non-blocking |

## U-PAL-02 coverage exercised

- Adapter token present → Enso HTTP not called
- Empty remote → `emptyRemote`, empty-state testid, no featured / default-agent cards
- HTTP / invalid adapter → static filtered items + banner; no mock agent keys; no “mock agents” copy
- Allow-list hides featured types; `defaultAgents` tagged `origin: 'default-agent'`
- Sidebar reload when `features().palette` changes
- `MOCK_SOLUTION_AGENTS` removed from `src/`

## Manual smoke

See `integration-test-instructions.md` and `docs/workflow-builder-ui-config-try.md`.

## Next after approval

Increment Build and Test approved. Operations placeholder: `aidlc-docs/operations/palette-host-config-operations-placeholder.md`.
