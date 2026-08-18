# Performance Test Instructions

## Purpose
No load/stress suite for this increment. U-AE-01 is chrome vs routing (chip gate + nested Back).

## Performance Requirements
N/A — NFR Requirements/Design skipped. No response-time, throughput, or concurrent-user targets for this SPA increment. DR N/A.

## Setup / Run
N/A.

Optional: `npm test` (example gating tests in `workflow.facade.spec.ts`; PBT Partial not added — no new pure transform).

Bundle budget warning (~600 kB vs 500 kB) is accepted as a warning, not a test failure.
