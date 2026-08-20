# Performance Test Instructions

## Purpose
No load/stress suite for this increment. U-DC-01 is a chrome boolean leaf and canvas dblclick gate.

## Performance Requirements
N/A — NFR Requirements/Design skipped. No response-time, throughput, or concurrent-user targets for this SPA increment. DR N/A.

## Setup / Run
N/A.

Optional: `npm test` (PBT Partial on merge: omit `doubleClick` → true; explicit false wins).

Bundle budget warning (~605 kB vs 500 kB) is accepted as a warning, not a test failure.
