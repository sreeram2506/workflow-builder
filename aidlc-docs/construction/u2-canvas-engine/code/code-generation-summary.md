# Code Generation Summary — U2

## Application code
- Canvas engine under `src/app/features/canvas/`
- Domain math `viewport.math.ts`, visuals `node-visuals.ts`
- Scheduler `core/canvas/canvas-performance.scheduler.ts`
- Extended GraphStore / UiStore / WorkflowFacade

## Verification
- `npm test` — 10 passed
- `npm run build` — success

## Skipped
- API layer, deployment artifacts, new npm libraries

## Explicitly not included
Palette DnD, connection drawing, properties forms, smart routing, history, run/view-mode

## Change requests
- Round 1: Reference-like pan (left-drag empty), Shift+marquee, smoother zoom, dotted grid polish
- Round 2: Port-attached edges + visual handles (no draw-edge)
- Round 3: Bezier connector paths
