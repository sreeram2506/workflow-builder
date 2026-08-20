# Operations — Agent tabs doubleClick config

**Status**: PLACEHOLDER  
**Date**: 2026-08-20  
**Increment**: More Changes R62 — `agentTabs.doubleClick` (U-DC-01)

## Current state

AI-DLC Operations is not implemented in this workflow version. Build and Test for this increment completed under CONSTRUCTION and was approved.

The application remains a local SPA (`npm start` / `npm run build` / `npm test`). Hosts can pass `agentTabs.doubleClick` (default `true`) via JSON, `provideWorkflowBuilderUi`, or `[ui]`. Canvas dblclick enter is independent of the tab strip (`agentTabs.enabled`). Chip click still enters when the strip is on. Both flags false means no nested enter from builder chrome.

Package publish (`enso-workflow-builder@0.1.1` OTP) remains carry-over and is **not** part of this increment.

## Future scope (when Operations expands)

- Deployment planning and execution
- Monitoring and observability
- Incident response
- Maintenance / support workflows
- Production readiness checklists

## Increment outcome

| Unit | Result |
|---|---|
| U-DC-01 Agent tabs doubleClick config | COMPLETE |
| Build and Test | Approved — 308 tests passed; `dist/workflow-builder` |
| Operations | Placeholder — workflow ends here for this increment |

Host embed (`agentTabs.doubleClick`): `docs/workflow-builder-ui-embed.md`
