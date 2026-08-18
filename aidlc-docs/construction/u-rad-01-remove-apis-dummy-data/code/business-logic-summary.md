# Business Logic Summary — U-RAD-01 Remove APIs and dummy data

**Stories**: US-RAD-01, US-RAD-02, US-RAD-03

## Modified

| Path | Change |
|---|---|
| `src/environments/environment.ts` | Strip catalog URLs, IDs, credentials |
| `src/environments/environment.prod.ts` | Same |
| `src/app/core/data/enso-task-catalog.service.ts` | No HttpClient; omit-without-adapter = empty-remote; adapter-when-omit kept |
| `src/app/core/data/catalog.types.ts` | Drop `source: 'enso'`; omit comments |
| `src/app/core/data/enso-task-catalog.service.spec.ts` | Drop HTTP/Enso cases; omit-without-adapter empty-remote |
| `src/app/core/facade/workflow.facade.ts` | `addSkillToAgent` returns false |
| `src/app/core/facade/workflow.facade.spec.ts` | Palette-item add; mock ids no longer add |
| `src/app/core/domain/agent-skills.spec.ts` | No `MOCK_SKILLS` |
| `src/app/core/domain/properties.schema.ts` | Repeater workflow `options: []` |
| `src/app/core/domain/logic-node-rules.spec.ts` | Empty Repeater options |

## Created

| Path | Change |
|---|---|
| `src/app/core/data/enso-task-catalog.service.pbt.spec.ts` | P-RAD-01..03 |

## Deleted

| Path | Reason |
|---|---|
| `proxy.conf.json` | `/enso-api` only |
| `enso-pipeline.mapper.ts` + spec | HTTP-only |
| `enso-task.mapper.ts` + spec | HTTP-only |
| `mock-skills.catalog.ts` | Dummy nested skills |
| `repeater-mock.catalog.ts` | Dummy Repeater workflows |

## Rules implemented

- Omit `[palettes]`, no adapter: `emptyRemote`, `source: 'empty'`, no static featured
- `[palettes]="[]"`: still `source: 'host'` empty-remote
- Adapter failure: static fallback + banner unchanged
- No catalog credentials in environment
