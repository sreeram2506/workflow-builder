# Frontend Components Summary — U-AE-01 Enter agent without tab bar

**Stories**: US-AE-01, US-AE-02, US-AE-03, US-AE-04

## Modified

| Path | Change |
|---|---|
| `src/app/features/shell/shell-layout.component.ts` | Publish `agentTabs.enabled` to facade (solution canvas; no nested Back) |
| `src/app/features/agent/agent-skills-shell.component.ts` | Publish flag before `ensureAgentRoute`; nested **Solution** Back when strip not mounted |
| `src/app/features/agent/agent-skills-shell.nested-back.spec.ts` | Bar off shows Back; bar on shows strip not Back |
| `src/app/features/shell/ui-chrome-gates.spec.ts` | `agentTabs.enabled: false` hides strip |
| `docs/workflow-builder-ui-embed.md` | Flag is strip chrome, not a routing block; dblclick enter; nested Back; host `/agent/:nodeId` route required |

## Follow-up (2026-08-19)

- `src/app/features/canvas/canvas-viewport.component.ts` — do not pointer-capture on node press; capture only after `NODE_DRAG_THRESHOLD_PX` so dblclick enters when the tab strip is off
- `UiConfigService` sticky instance `[ui]`: routed nested shell without `[ui]` keeps solution `agentTabs.enabled: false` (no chip strip; **Solution** Back)
- Verify: hard-refresh; double-click the **canvas** AIAgent; URL `/agent/:id`; **no** agent tab strip; **Solution** Back when strip is off

## Behavior

- When the tab strip is on, chips still enter and the Solution chip still returns
- When the strip is off, nested Back does not require `agentTabs().length > 0`
- View mode still enters; nested graph edits stay blocked as before
- `src/app/try/` was not committed (local harness already uses `agentTabs.enabled: false`)
