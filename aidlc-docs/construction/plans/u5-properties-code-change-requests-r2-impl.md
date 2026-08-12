# U5 Change Request R2 — Implementation Notes

## Locked clarification answers
| Q | Answer |
|---|---|
| C1 | A — Render all fields from `data.ensoTask` (flattened nested objects) |
| C2 | A — Static Flow/Logic blocks **plus** enso task categories |
| C3 | A — Edge Properties override (was previously non-goal) |
| C4 | B — Edge: read-only id/source/target + editable `label` |
| C5 | A — Design lock change; docs refreshed |

## Delivered
- Palette merges static catalog with enso tasks
- Properties: General + full dynamic `ensoTask` configuration (or XPMS boolean mock for non-enso nodes)
- Selecting a connection opens Properties with id/source/target + label; `patchEdge`
- Decision static item labeled **Router / Decision**

## Docs
- README / this note updated for edge properties + dynamic enso config
