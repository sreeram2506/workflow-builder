# More Changes R51 — Change Requests

**Source**: `more-changes-r51-clarification-questions.md`

## Scope

| ID | Request | Status |
|----|---------|--------|
| R51-1 | After drag-to-canvas, Condition / Router / Repeater / Blank Agent must stay in Nodes Library slots | Done |

## Notes

- Screenshot showed Router slot empty after drag while canvas node was created (CDK left source displaced)
- `onDragEnded` now always `reset()`s the drag source and clears inline `transform`
- Featured strip always reads from `allItems()` so slots are not lost to filter/drag quirks
- Placeholder CSS keeps library list slots visible during drag
