# Performance Test Instructions

## Purpose
No load/stress suite for this increment. U-PAL-01 is in-memory merge/filter; U-PAL-02 is one catalog load per library plus the same filter.

## Performance Requirements
N/A — NFR Design skipped for both units.

## Setup / Run
N/A.

Optional: `npm test` (PBT Partial on allow-list filter + merge only).

Bundle budget warning (~580 kB vs 500 kB) is accepted as a warning, not a test failure.
