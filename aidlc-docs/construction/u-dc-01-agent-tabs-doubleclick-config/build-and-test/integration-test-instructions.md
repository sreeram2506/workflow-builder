# Integration Test Instructions

## Purpose
U-DC-01 host `agentTabs.doubleClick` vs `agentTabs.enabled` in the same Angular SPA.

This increment has one construction unit. Automated checks live in the Vitest suite (`npm test`). There is no separate multi-service integration runner.

## Test Scenarios

### Scenario 1: Default / omit still enters
- **Description**: Omitted `doubleClick` keeps canvas dblclick enter
- **Setup**: `npm test`
- **Test Steps**: `canvas-viewport.agent-dblclick.spec.ts` default-true case; `merge-ui-features.spec.ts` default
- **Expected Results**: `selectAgentTab` called; merged `doubleClick` is true
- **Cleanup**: none

### Scenario 2: Flag false blocks canvas dblclick
- **Description**: `agentTabs.doubleClick: false` does not navigate; selection/drag unchanged
- **Setup**: `npm test`
- **Test Steps**: canvas spec false + view-mode false cases
- **Expected Results**: `selectAgentTab` not called
- **Cleanup**: none

### Scenario 3: Independent of strip; chips still enter
- **Description**: `enabled` hides strip only; `selectAgentTab` still works for chips
- **Setup**: `npm test`
- **Test Steps**: `workflow.facade.spec.ts` `selectAgentTab` with chrome off; `ui-chrome-gates.spec.ts` strip hide
- **Expected Results**: navigate still happens from facade; strip hidden when `enabled` false
- **Cleanup**: none

### Scenario 4: Nested no re-enter
- **Description**: Nested canvas dblclick does not call `selectAgentTab`
- **Setup**: `npm test`
- **Test Steps**: canvas spec nested case
- **Expected Results**: spy not called
- **Cleanup**: none

### Scenario 5: Manual embed / try (optional)
- **Description**: Parent `provideWorkflowBuilderUi({ features: { agentTabs: { enabled: false, doubleClick: true } } })`; dblclick AIAgent; strip off; **no** nested Solution pill (host breadcrumb)
- **Setup**: `npm start`; local try harness if present. Do not commit `src/app/try/`
- **Test Steps**: See `docs/workflow-builder-ui-embed.md` (`agentTabs.doubleClick`)
- **Expected Results**: enter on dblclick when true; stay on solution when false; chips work when strip on; nested Solution pill only when strip off **and** `doubleClick` false
- **Cleanup**: stop `ng serve` if started only for this stage

## Setup Integration Test Environment

### 1. Start Required Services
```bash
npm start
```

No backend is required.

### 2. Configure Service Endpoints
None.

## Run Integration Tests

### 1. Execute Integration Test Suite
```bash
npm test
```

### 2. Verify Service Interactions
See `docs/workflow-builder-ui-embed.md` (`agentTabs.doubleClick`).

### 3. Cleanup
Stop `ng serve` if started only for this stage.
