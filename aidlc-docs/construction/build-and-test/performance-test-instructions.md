# Performance Test Instructions

## Purpose
No load/stress suite for this increment. U-NP-01 is ng-packagr packaging + `npm pack`.

## Performance Requirements
N/A — NFR Requirements/Design skipped. No response-time, throughput, or concurrent-user targets. DR N/A (client library).

## Setup / Run
N/A.

Optional: `npm test` (existing PBT Partial on serialize / `parseWorkflowUnknown` in `workflow.serialize.spec.ts`).

SPA bundle budget warning (~604 kB vs 500 kB) is accepted as a warning, not a test failure.
