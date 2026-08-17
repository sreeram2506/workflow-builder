# Build and Test — U-PAL-01 Palette config core

**Date**: 2026-08-17  
**Unit**: `u-pal-01-palette-config-core`  
**Status**: APPROVED  
**Stories**: US-PAL-01, US-PAL-02, US-PAL-03, US-PAL-04  

## Commands run

```bash
npm test
npm run build
```

## Results

| Check | Result |
|---|---|
| `npm test` | **191 passed** / 28 files |
| `npm run build` | Success → `dist/workflow-builder` |
| Warnings | Bundle budget; left-sidebar CSS budget — non-blocking |

## U-PAL-01 coverage exercised

- Palette defaults (`mode: 'all'`, omitted `defaultAgents`)
- Presence merge (omit vs `[]` vs present); provider wins
- Unknown types / `"Router"` dropped
- `filterPaletteItemsByAllowList` + PBT invariant
- `resolveDefaultAgents` omit / `[]` / present + AIAgent gate
- `applySolutionDefaultAgents` replaces Blank Agent
- Service JSON + provider `palette` overlay

## Manual smoke

See `integration-test-instructions.md` — library **UI** still unfiltered until U-PAL-02.

## Next after approval

Per Units Generation (**strict**): start **U-PAL-02** CONSTRUCTION (Functional Design → Code Generation → Build and Test).
