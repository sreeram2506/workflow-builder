# Frontend Components Summary — U-SW-01b

## Created
- `app.routes.ts` — `/` ShellLayout; `/agent/:nodeId` AgentSkillsShell
- `features/agent/agent-skills-shell.component.ts` — full canvas + Nodes Library (agent scope)
- `core/domain/agent-graph.ts` — `nestedWorkflow` read/write helpers
- Legacy: `nested-skills-panel` / `nested-skills-library` (unused by shell after round 3)

## Modified
- `left-sidebar.component.ts` — `paletteScope` solution \| agent
- `workflow.facade.ts` — `enterAgentCanvas` / `exitAgentCanvas` document swap
- `canvas-viewport.component.ts` — dblclick → agent route (solution only)
- `top-bar` / `right-sidebar` — Back; Open agent canvas

## UX
- **Solution**: slim palette + solution canvas
- **Agent**: full Nodes Library + diagram drag-drop on `data.nestedWorkflow`
- Back persists nested graph onto the Blank Agent and restores solution
