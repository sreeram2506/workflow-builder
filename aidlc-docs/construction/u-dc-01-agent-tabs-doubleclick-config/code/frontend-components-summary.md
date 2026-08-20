# Frontend Components Summary — U-DC-01 Agent tabs doubleClick config

**Stories**: US-DC-02, US-DC-03, US-DC-04, US-DC-05

## Modified

| Path | Change |
|---|---|
| `src/app/features/canvas/canvas-viewport.component.ts` | `onNodeDblClick` returns unless `ui.is('agentTabs.doubleClick')`; nested early-return unchanged |
| `src/app/features/canvas/canvas-viewport.agent-dblclick.spec.ts` | Default true enters; false does not; nested no re-enter; view + false does not enter |
| `docs/workflow-builder-ui-embed.md` | Document `agentTabs.doubleClick`; parent `provideWorkflowBuilderUi` example |
| `docs/workflow-builder-ui-config-try.md` | `is()` inventory includes `agentTabs.doubleClick` |
| `src/assets/examples/wb-ui-config.all-on.json` | `doubleClick: true` |
| `src/assets/examples/wb-ui-config.all-off.json` | `doubleClick: false` |
| `src/assets/examples/wb-ui-config.minimal-canvas.json` | `doubleClick: true` |

## Behavior

- Chip click still calls `selectAgentTab` (not gated)
- Nested canvas dblclick still does not re-enter
- Host still must register `/agent/:nodeId`
- `src/app/try/` was not committed
