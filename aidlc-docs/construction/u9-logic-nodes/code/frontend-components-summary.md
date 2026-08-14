# Frontend Components Summary — U9 Logic Nodes

## Changed
- `RightSidebarComponent` — type-specific Properties:
  - Condition: General + expression; Ignore Keys hidden
  - Router (`Decision`): General + uniqueness vs Router/Repeater; Ignore Keys hidden
  - Repeater: mock Workflow/Agent, dependent Version, Pause; uniqueness; Ignore Keys hidden
  - Router outgoing edge: Connector Name + Condition (required); Save → `patchEdge`
  - Condition outgoing edge: read-only true/false label; no condition editor; no Save
- Seed `mock-workflow.repository.ts` — Condition/Repeater data; Condition max-2 true/false; Router connector seed
- `right-sidebar.component.spec.ts` — bind branches for Condition, Router, Repeater, connector, condition-out

## Behavior
- Save-only persist (U5)
- Third Condition connect is a silent no-op (facade)
- View mode: controls disabled, no Save
- `data-testid` on new logic controls
