# Performance Test Instructions — Solution Workflow

## Status

**N/A / lightweight** for this increment.

U-SW-01a / U-SW-01b did not introduce dedicated load/stress targets. Client is a local SPA; Enso calls are proxied third-party APIs outside this repo’s perf harness.

## Optional smoke checks

| Check | How | Pass heuristic |
|---|---|---|
| Cold build | `npm run build` | Completes in tens of seconds on a typical laptop |
| Unit suite | `npm test` | ~10s class runtime for 130 tests |
| Dev serve | `npm start` | Interactive canvas remains usable with dozens of nodes |

## When to expand

Add formal performance tests if NFRs later require palette load SLAs, large nested-graph routing budgets, or concurrent editor sessions.
