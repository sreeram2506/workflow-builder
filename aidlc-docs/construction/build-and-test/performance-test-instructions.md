# Performance Test Instructions

## Scope
U2–U9 NFRs (qualitative). No formal load/stress harness.

## Requirements
| ID | Check |
|---|---|
| NFR-P-10 / P-50 | Pan/zoom/layout/route feel smooth ≤100 nodes |
| NFR-P-60 / P-61 | Undo/redo/export feel instant; `structuredClone` snapshots |
| NFR-P-62 | Autosave status debounce 500 ms (no file I/O) |
| NFR-P-70 / P-71 | Run steps feel smooth; reduced-motion shortens delay ≤50 ms |
| NFR-P-72 / P-73 | Status patches skip history; Stop tears down timers promptly |
| NFR-S-* | No claim beyond ≤100 nodes; history cap 100; single concurrent Run |
| U9 | Properties bind and Save remain snappy on seed graph; mock catalog is static (no HTTP) |

## Manual checks
1. `npm start` — edit graph; undo/redo feels snappy
2. Layout + Route + Save download
3. Run simulation on seed graph; Stop mid-run; Reset
4. Enable OS reduced-motion → steps feel near-instant
5. Open Condition / Router / Repeater Properties; Save; connect Condition (max 2) and Router edges
6. Note bundle size (~504 kB main / ~540 kB initial last measured)

## Skipped
Load/stress tools, FPS CI, localStorage persistence tests, backend run load tests.
