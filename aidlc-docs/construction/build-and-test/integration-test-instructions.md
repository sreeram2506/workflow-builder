# Integration Test Instructions

## Purpose
Cross-feature checks for U1–U8. No separate automated integration suite yet.

## Manual Smoke (U1–U8)

### Scenarios 1–9
Carry forward U1–U7 smoke (bootstrap, pan/zoom, select, palette, connections, Properties, Layout/Route, theme, serialize/history).

### Scenario 10 — Simulated Run & View Mode (U8)
1. Click **Run** → nodes walk BFS with `running` → `success` badges; polite aria-live announces steps
2. During Run, **Stop** appears → cancel leaves statuses; `runActive` clears
3. **Reset** → all node statuses idle
4. Toggle **View** → View badge; Import/Undo/palette add locked; pan/zoom/Export/Save/Run still work
5. Start Run in view → allowed; switch edit↔view during Run → Stop behavior
6. Clear all nodes (or import empty) → Run shows canvas status “Nothing to run” (no throw)

## Run automated integration
None yet. Facade Vitest covers Run/Stop/Reset/view + empty soft-fail.
