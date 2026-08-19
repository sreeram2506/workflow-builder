# Frontend Components Summary — U-NP-01 npm package

**Stories**: US-NP-01, US-NP-02  
**Status**: Part 2 complete (awaiting approval)

## Packaging

- Library prefix `wb`; shells remain `wb-shell-layout` and `wb-agent-skills-shell`
- SPA still hosts the demo; relative `src/app` imports unchanged
- Theme tokens ship as `styles/tokens.css` in the package (copy of `src/styles/tokens.css` under the library `src/styles/`)
- Host `html` / `body` / wrapper height stay the host’s job

## Specs

- `src/public-package-api.spec.ts` — imports from `'enso-workflow-builder'` (tsconfig.spec paths) and checks selectors

## Unchanged

- Shell templates, chrome, palettes, Properties, nested agent enter/exit
