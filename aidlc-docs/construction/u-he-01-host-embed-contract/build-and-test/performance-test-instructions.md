# Performance Test Instructions

## Purpose
No load/stress suite for this increment. U-HE-01 is host document I/O, persist hooks, and shell height.

## Performance Requirements
N/A — NFR Requirements/Design skipped. No response-time, throughput, or concurrent-user targets for this SPA increment. DR N/A.

## Setup / Run
N/A.

Optional: `npm test` (PBT Partial on `parseWorkflowUnknown` / serialize round-trip in `workflow.serialize.spec.ts`).

Bundle budget warning (~604 kB vs 500 kB) is accepted as a warning, not a test failure.
