# Frontend Components Summary — U7

## TopBarComponent
- Undo / Redo enabled from history stacks
- Save + Export download JSON
- Import opens dialog
- Run remains disabled (U8)
- Document shortcuts: ⌘/Ctrl+Z / Shift+Z / Y / C / V / S (ignored in inputs)

## ImportWorkflowDialogComponent
- File picker + paste textarea
- Inline validation error + Cancel / Import
- Confirm calls `facade.importJson`

## CanvasViewport
- `beginHistoryGesture` / `endHistoryGesture` on node & waypoint drag

## Non-goals absent
- OS clipboard sync
- localStorage
- Run / view-mode toggle
