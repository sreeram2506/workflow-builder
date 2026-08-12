# Frontend Components Summary — U3

## Nodes Library (`LeftSidebarComponent`)
- Categorized catalog (Flow / Logic / Integration / AI)
- Search input with 150ms debounce + clear
- CDK `cdkDrag` items inside palette `cdkDropList` (enter rejected — copy semantics)
- Drag-end: if pointer over canvas viewport id, `screenToWorld` → `createNode`
- Click / Enter / Space → `createNodeAtViewportCenter`
- Templates button remains disabled

## Canvas (`CanvasViewportComponent`)
- Hosts `wb-canvas-drop` id for palette hit-testing
- Publishes `viewSize` to UiStore for click-to-add centering

## Shared
- `palette-dnd.ids.ts` — `wb-palette-list` / `wb-canvas-drop` ids

## Not in U3
Edge drawing, Properties forms, Templates, history, run/view-mode.
