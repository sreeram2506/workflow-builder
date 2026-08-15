# Frontend Components Summary — U-SW-01a

## Modified
- `left-sidebar.component.ts` — Blank Agent card row under featured Condition/Router/Repeater; excluded from category lists
- `workflow-node.component.ts` — `dblclick` → `nodeDblClick` output
- `canvas-viewport.component.ts` — `onNodeDblClick` → `facade.openAgentTab` for `AIAgent`
- `top-bar.component.ts` — agent tabs strip (label, focus, × close)
- `app.spec.ts` — expects Blank Agent in library again

## UX notes (P0)
- Tab click focuses chrome + selects node; does **not** navigate nested route (01b)
- Max 5 tabs with FIFO eviction
- View mode: tabs open/close allowed; palette create still locked
