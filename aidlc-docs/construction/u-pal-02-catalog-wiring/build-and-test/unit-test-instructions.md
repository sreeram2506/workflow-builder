# Unit Test Instructions — U-PAL-02 Catalog wiring + docs

## Run
```bash
npm test
```

(`ng test --watch=false`)

## U-PAL-02 specs
| Spec | Focus |
|---|---|
| `enso-task-catalog.service.spec.ts` | Adapter skips Enso HTTP; empty-remote; HTTP/invalid adapter → static + banner; allow-list; `defaultAgents` origin |
| `left-sidebar.palette.spec.ts` | `palette-empty-remote`; no mock labels on error; featured allow-list; `default-agent-strip`; reload on palette change |
| `palette-host.helpers.spec.ts` | Origin tagging on resolved default agents (U-PAL-01 helpers) |
| `ui-chrome-gates.spec.ts` / `app.spec.ts` | Catalog mock includes `emptyRemote: false` and tagged Blank Agent |

## Expected
- All project tests green (includes U-PAL-01 + prior increments)
- Latest run: **203 passed** / 30 files, 0 failures
- Coverage: not gated
