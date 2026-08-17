# Performance Test Instructions — U-UI-02

## Purpose
U-UI-02 NFR Design was skipped. There is no load/stress suite for chrome `@if` gates.

## Performance Requirements
Not specified for this unit. Gates are boolean checks on an in-memory feature tree.

## Setup / Run
N/A — no JMeter/k6 scripts.

Optional manual check: `npm start` and toggle JSON flags; confirm the SPA stays responsive while hiding/showing libraries and canvas chrome.

## Performance Optimization
If the initial bundle budget warning (576.48 kB vs 500 kB warn) becomes an error, treat it as a separate change request — not a U-UI-02 functional failure.
