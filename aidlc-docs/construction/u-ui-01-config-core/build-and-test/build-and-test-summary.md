# Build and Test — U-UI-01 Config Core

**Date**: 2026-08-17  
**Unit**: `u-ui-01-config-core`  
**Status**: EXECUTED — awaiting approval  
**Stories**: US-UI-01, US-UI-07  

## Commands run

```bash
npm test
npm run build
```

## Results

| Check | Result |
|---|---|
| `npm test` | **149 passed** / 24 files |
| `npm run build` | Success → `dist/workflow-builder` |
| Warnings | Bundle budget; top-bar / left-sidebar CSS budgets — non-blocking |

## U-UI-01 coverage exercised

- Merge / normalize / theme alias / path index
- PBT merge invariants
- Soft-fail HTTP (404 / invalid) + provider wins
- Example all-off normalize path
- Bootstrap initializer wired; default asset restored to `{}`

## Manual smoke

See `integration-test-instructions.md` — console `[UiConfig]` log; examples under `src/assets/examples/`.

## Next after approval

Per Units Generation (**strict**): start **U-UI-02** CONSTRUCTION (Functional Design → Code Generation → Build and Test).

Increment Operations placeholder after both units complete.
