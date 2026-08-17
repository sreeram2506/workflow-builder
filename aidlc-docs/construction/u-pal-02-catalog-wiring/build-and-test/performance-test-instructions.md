# Performance Test Instructions — U-PAL-02

**N/A / light** — catalog compose is one HTTP or adapter call per library load, plus in-memory allow-list filter.

No load/stress suite. NFR Design was skipped for this unit.

Optional: `npm test` (PBT still on U-PAL-01 helpers; U-PAL-02 has no new generator suite).

Bundle budget warning (~580 kB vs 500 kB) is accepted as a warning, not a test failure.
