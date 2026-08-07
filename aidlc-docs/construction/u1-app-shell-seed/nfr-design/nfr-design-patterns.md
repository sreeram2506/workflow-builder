# NFR Design Patterns — U1

## Resilience
| Pattern | Application in U1 |
|---|---|
| Fail-soft bootstrap | `AppComponent` / facade `initialize()` wrapped in try/catch |
| User-visible failure | On throw: set UiStore (or local signal) `bootstrapError` message; render error banner in shell; still show chrome where possible |
| Empty seed | Non-throwing empty nodes → empty canvas placeholder (functional BR-U1-07) |
| Retries / circuit breakers | **Not used** (no remote I/O) |

## Scalability
| Pattern | Application in U1 |
|---|---|
| Horizontal scale, queues, caches, CQRS | **N/A** — single-user local SPA |

## Performance
| Pattern | Application in U1 |
|---|---|
| Token-driven theming | CSS custom properties on `documentElement` via `ThemeApplicator` |
| Signal-based UI state | Theme/sidebar flags in UiStore signals; toggle avoids heavy work |
| Change detection | Keep Angular **default** (not forced zoneless in U1) |
| Lazy routes / workers | Not required for U1 single-shell |

## Security (hygiene)
| Pattern | Application in U1 |
|---|---|
| Default Angular sanitization | Use property/text bindings for all labels |
| No bypass APIs | Do not call `bypassSecurityTrust*` in U1 |
| No dynamic scripts | No `innerHTML` of untrusted content |
| Secrets | None in repo |

## Testing
| Pattern | Application in U1 |
|---|---|
| Example unit tests | Vitest for facade/store smoke as useful |
| PBT harness | `fast-check` + **one trivial property test** (seed node-type ∈ catalog **or** theme toggle pure helper idempotence) to prove tooling |

## Infrastructure Design Alignment
Infrastructure Design stage is **SKIP** — no cloud/logical infra components (API GW, LB, DB, etc.). Patterns above are in-app only.
