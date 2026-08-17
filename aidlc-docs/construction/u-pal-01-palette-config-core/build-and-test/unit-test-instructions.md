# Unit Test Instructions — U-PAL-01 Palette config core

## Run
```bash
npm test
```

(`ng test --watch=false`)

## U-PAL-01 specs
| Spec | Focus |
|---|---|
| `merge-ui-features.spec.ts` | Palette omit / `[]` / present; `"Router"` dropped; malformed ignored; provider wins |
| `merge-ui-features.pbt.spec.ts` | Chrome + palette omit/replace |
| `palette-host.helpers.spec.ts` | Filter, `resolveDefaultAgents`, `applySolutionDefaultAgents` |
| `palette-host.helpers.pbt.spec.ts` | Allow-list invariant; AIAgent gate; idempotent filter |
| `ui-config.service.spec.ts` | JSON `palette` + provider overlay on `features().palette` |

## Expected
- All project tests green (includes prior units)
- Latest run: **191 passed** / 28 files
