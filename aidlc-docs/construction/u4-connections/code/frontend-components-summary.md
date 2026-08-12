# Frontend Components Summary — U4

## WorkflowNodeComponent
- Interactive source (right) / target (left) handles with accessible names
- `connectStart` from source handle (does not start node drag)

## GraphRendererComponent
- Paths through ports + waypoints
- Draft rubber-band (accent / danger)
- Waypoint dots when edge selected; focus styling

## CanvasViewportComponent
- Connection draft gesture + Escape cancel
- Waypoint drag + double-click add
- Delete priority: focused waypoint → selected edges

## Not in U4
Smart routing, Properties-on-select, keyboard-only connect, ConnectionService
