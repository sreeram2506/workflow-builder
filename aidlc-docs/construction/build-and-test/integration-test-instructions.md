# Integration Test Instructions

## Purpose
U-AE-01 enter/exit nested agent when the tab strip is hidden, without accumulating chips, while keeping chip enter when the strip is on.

This SPA has one construction unit for this increment. Automated checks live in the Vitest suite (`npm test`). There is no separate multi-service integration runner.

## Test Scenarios

### Scenario 1: Bar off — double-click enters; no chips
- **Description**: `agentTabsChromeEnabled` false; `openAgentTab` / palette drop do not add chips; `selectAgentTab` still routes to `/agent/:id`
- **Setup**: `npm test`
- **Test Steps**: `workflow.facade.spec.ts` (chrome off cases)
- **Expected Results**: `agentTabs()` empty; router URL `/agent/:id`
- **Cleanup**: none

### Scenario 2: Bar on — chips still enter
- **Description**: Default chrome on; `selectAgentTab` opens a chip and navigates; Solution chip still returns (existing `wb-agent-tabs`)
- **Setup**: `npm test`
- **Test Steps**: `workflow.facade.spec.ts` `selectAgentTab opens tab and navigates`; `ui-chrome-gates.spec.ts` strip visible when tabs exist and flag is on
- **Expected Results**: one chip; `/agent/:id`; strip present
- **Cleanup**: none

### Scenario 3: Nested Back without the strip
- **Description**: Nested shell shows **Solution** when `agentTabs.enabled` is false; click calls `navigateBackToSolution` without requiring chips
- **Setup**: `npm test`
- **Test Steps**: `agent-skills-shell.nested-back.spec.ts`
- **Expected Results**: `nested-back-to-solution` present when bar off; absent when bar on (strip present)
- **Cleanup**: none

### Scenario 4: Nested no re-enter; View still enters
- **Description**: Canvas dblclick no-ops when `editingAgentNodeId` is set (unchanged). View mode `selectAgentTab` still navigates with chrome off
- **Setup**: `npm test`
- **Test Steps**: `workflow.facade.spec.ts` view-mode chrome-off case; canvas `onNodeDblClick` early-return (source confirmed, no extra spec)
- **Expected Results**: `/agent/:id` in view; nested edits still blocked by existing view guards
- **Cleanup**: none

### Scenario 5: Manual embed / try (optional)
- **Description**: Instance `[ui]="{ agentTabs: { enabled: false } }"` — dblclick Blank Agent enters; nested **Solution** returns; no tab strip
- **Setup**: `npm start`; local try harness if present (`/try-ui`). Do not commit `src/app/try/`
- **Test Steps**: See `docs/workflow-builder-ui-embed.md` (Nested agent enter / exit)
- **Expected Results**: strip hidden; dblclick enters; Back works; chips not accumulated from select/drop
- **Cleanup**: stop `ng serve` if started only for this stage

## Setup Integration Test Environment

### 1. Start Required Services
```bash
npm start
```

No backend is required.

### 2. Configure Service Endpoints
None. Nested routing is in-process Angular Router.

## Run Integration Tests

### 1. Execute Integration Test Suite
```bash
npm test
```

### 2. Verify Service Interactions
See `docs/workflow-builder-ui-embed.md` (`agentTabs.enabled` is strip chrome, not a routing block).

### 3. Cleanup
Stop `ng serve` if started only for this stage.
