# Unit Test Instructions — U-HUI-01 Host UI chrome inputs

## Run
```bash
npm test
```

Focus on this unit:
```bash
npx ng test --watch=false --include='**/host-ui-inputs.spec.ts'
npx ng test --watch=false --include='**/effective-ui-reader.spec.ts'
npx ng test --watch=false --include='**/merge-ui-features*.spec.ts'
```

## U-HUI-01 specs
| Spec | Focus |
|---|---|
| `effective-ui-reader.spec.ts` | Reader updates + fail-open unknown path |
| `merge-ui-features.spec.ts` | `mergeInstanceUiFeatures` omit/`{}`/no-mutate/themeToggle |
| `merge-ui-features.pbt.spec.ts` | Instance merge PBT (NFR-HUI-01) |
| `host-ui-inputs.spec.ts` | Omit/`{}`/partial wins/isolation/reactive/agent shell |
| `ui-chrome-gates.spec.ts` | Regression — global chrome gates still pass |

## Expected
- All project tests green
- Latest run: **233 passed** / 33 files / 0 failed
