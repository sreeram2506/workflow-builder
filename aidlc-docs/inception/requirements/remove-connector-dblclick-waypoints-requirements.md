# Requirements — Remove connector double-click waypoints

**Increment**: More Changes R64  
**Answers**: Q1=A · Q2=A · Q3=A  
**Source**: `aidlc-docs/inception/plans/more-changes-r64-clarification-questions.md`

## Functional

- **FR-01**: Double-click on a connector MUST NOT add a waypoint (no new dots on the edge).
- **FR-02**: Single-click on a connector MUST still select it and open the properties panel.
- **FR-03**: `addWaypoint` / layout `routeEdges` remain for auto-layout and existing waypoint data. This increment does not hide waypoint handles that already exist.

## Out of scope

- Removing the waypoint model
- Hiding auto-layout midpoints
- npm publish
