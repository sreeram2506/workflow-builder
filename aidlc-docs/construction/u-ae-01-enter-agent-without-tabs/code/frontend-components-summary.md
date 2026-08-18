# Frontend Components Summary — U-AE-01 Enter agent without tab bar

**Stories**: US-AE-01, US-AE-02, US-AE-03, US-AE-04

## Modified

| Path | Change |
|---|---|
| `src/app/features/shell/shell-layout.component.ts` | Publish `agentTabs.enabled` to facade (solution canvas; no nested Back) |
| `src/app/features/agent/agent-skills-shell.component.ts` | Publish flag before `ensureAgentRoute`; nested **Solution** Back when strip not mounted |
| `src/app/features/agent/agent-skills-shell.nested-back.spec.ts` | Bar off shows Back; bar on shows strip not Back |
| `src/app/features/shell/ui-chrome-gates.spec.ts` | `agentTabs.enabled: false` hides strip |
| `docs/workflow-builder-ui-embed.md` | Flag is strip chrome, not a routing block; dblclick enter; nested Back |

## Behavior

- When the tab strip is on, chips still enter and the Solution chip still returns
- When the strip is off, nested Back does not require `agentTabs().length > 0`
- View mode still enters; nested graph edits stay blocked as before
- `src/app/try/` was not committed (local harness already uses `agentTabs.enabled: false`)
