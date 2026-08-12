# Business Logic Summary — U2

## Implemented
- `ViewportMath` — clamp, screen↔world, zoomAt, panBy, transform CSS, marquee rect helpers
- `GraphStore.setViewport` / `moveNodes`
- `UiStore` selection + `canvasError`
- `WorkflowFacade` viewport/selection/move APIs
- `CanvasPerformanceScheduler` rAF coalesce

## Tests
- `viewport.math.spec.ts` — PBT clamp + screen↔world; zoomAt stability; marquee intersect
- `workflow.facade.spec.ts` — viewport/selection/moveNodes smoke

## Non-goals
- History, connections, palette drop, properties schema, auto-layout
