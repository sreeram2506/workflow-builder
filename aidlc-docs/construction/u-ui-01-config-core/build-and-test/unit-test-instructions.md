# Unit Test Instructions — U-UI-01 Config Core

## Run
```bash
npm test
```

## U-UI-01 specs
| Spec | Focus |
|---|---|
| `merge-ui-features.spec.ts` | defaults, merge, normalize, theme alias, example all-off |
| `merge-ui-features.pbt.spec.ts` | fast-check BR-11 invariants |
| `ui-config.service.spec.ts` | defaults, unknown path, 404/invalid/ok HTTP, provider wins |

## Expected
- All project tests green (includes prior units)
- Latest run: **149 passed** / 24 files
