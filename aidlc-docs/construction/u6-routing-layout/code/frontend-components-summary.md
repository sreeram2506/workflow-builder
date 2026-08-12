# Frontend Components Summary — U6

## ZoomControlsComponent
- Layout ▾ select: Vertical / Horizontal / Layered → `applyLayout`
- Route button (static inline SVG) → `routeEdges`
- Disabled when `viewMode` input is true
- Existing zoom +/- / 100% unchanged

## CanvasViewportComponent
- Wires layout/route outputs with current `viewSize`
- Passes `editorMode === 'view'` into ZoomControls

## CanvasHostComponent
- Shows `canvasStatus` (non-error) alongside `canvasError`
- Status stacked below error when both present

## Non-goals shipped as absent
- Top-bar-only layout controls
- Separate LayoutRouteControlsComponent
- Live/debounce routing on node move
