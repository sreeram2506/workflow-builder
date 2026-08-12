# Frontend Components — U8 Simulated Run & View Mode

## Purpose
Enable Run / Stop / Reset statuses and view-mode toggle; finish lock surface for US-VM.2 / US-6.2.

## Existing (touched)
| Component | Change |
|---|---|
| `TopBarComponent` | Enable Run; add Stop when active; Reset statuses; enable view/edit toggle + View indicator |
| `UiStore` / facade | `setEditorMode`; `runActive` signal; `startRun` / `stopRun` / `resetStatuses` |
| `GraphStore` | `setNodeStatus` / batch status with `skipHistory` |
| Palette / canvas / Properties | Ensure view locks (most already); verify completeness |
| Zoom/Layout controls | Already disable Layout/Route in view |

## New (optional thin)
| Piece | Role |
|---|---|
| Run controls cluster | Run / Stop / Reset in top bar nav segment |
| Pure `run-order.ts` | BFS order helper + specs |

## Interaction rules
1. View indicator visible only in view mode.
2. Run disabled when `runActive`; Stop visible/enabled when `runActive`.
3. Properties remain readonly in view (existing); Save hidden/disabled.
4. No modal required for Run.

## ASCII

```text
[Undo][Redo][Save][Export][Import][Run|Stop][Reset] ... [View toggle] [Theme]
                                              ^ active shows Stop
```

## Non-goals
- Full run console / log panel
- Branch debugger UI
