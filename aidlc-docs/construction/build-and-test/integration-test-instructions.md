# Integration Test Instructions

## Purpose
Cross-feature checks for U1–U9. No separate automated integration suite yet.

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

## Manual Smoke (U9 Logic Nodes)

### Scenario 11 — Condition Properties and edges
1. Select seed Condition (`Needs Delay?`) → Properties shows General + Condition expression; no Ignore Keys
2. Edit expression and Save → value persists; changing selection without Save discards
3. Connect a third outgoing from Condition → no new edge (silent)
4. Select a Condition outgoing edge → label is read-only `true` or `false`; no condition field; no Save

### Scenario 12 — Router Properties and connectors
1. Select seed Router → General only; Ignore Keys hidden
2. Draw a new edge from Router → label `Blank Condition`, empty condition
3. Select that edge → Connector Name + Condition required; Save disabled until both filled
4. Duplicate another Router/Repeater label → Save disabled with uniqueness error

### Scenario 13 — Repeater mock config
1. Select seed Repeater → Workflow/Agent = Claims Intake, Version = v1.0, Pause off
2. Change workflow → version clears; version options update
3. Save with workflow + version + optional Pause
4. Toggle View → fields disabled, no Save

## Run automated integration
None yet. Facade Vitest covers Condition/Router `createEdge`; right-sidebar spec covers bind branches.
