# Intent Analysis — Angular Workflow Builder

## User Request (Summary)
Build a frontend-only Angular Workflow Builder that replicates the UX/layout/interaction of workflowbuilder.io (Synergy Codes), with canvas/graph engine built from scratch (no ngx-vflow / React Flow / third-party canvas-node libraries). Mock/in-memory data only; no backend; no localStorage persistence.

## Request Clarity
**Clear** — Feature list, stack constraints, visual style, phased build order, and anti-scope-creep rules are explicit. Remaining gaps: rendering primitive (SVG vs Canvas), initial node-type catalog, a few UX defaults, and extension opt-ins.

## Request Type
**New Project** (greenfield Angular SPA)

## Scope Estimate
**System-wide** — Full application shell + custom graph engine + palette + properties panel + history/serialization/run simulation

## Complexity Estimate
**Complex** — Custom pan/zoom/select/routing/layout from scratch; multi-phase delivery with approval gates

## Recommended Requirements Depth
**Comprehensive** — High complexity, many interacting subsystems, explicit phased delivery, and several open technical decisions that block Phase 1 scaffold choices

## Constraints Already Confirmed by User
- Angular latest stable, standalone components, signals
- `@angular/cdk/drag-drop` for palette only (not canvas nodes)
- `@angular/forms` reactive for properties panel
- No backend; mock seed JSON; in-memory store for save/load/auto-save
- Auto-save does **not** survive page refresh (must be called out explicitly)
- No new libraries/features without explicit approval
- Explicit confirmation required before advancing build phases
- Build order Phases 1–10 as specified

## Open Decisions (captured in questions file)
1. SVG vs HTML5 Canvas (or hybrid) for graph rendering
2. Initial node types / categories for mock seed + palette
3. Default theme (light vs dark vs system)
4. Default editor mode (edit vs read-only)
5. How closely to match workflowbuilder.io visuals (pixel-close vs inspired)
6. Extension opt-ins (security / resiliency / PBT)
