# Business Logic Summary — U-AE-01 Enter agent without tab bar

**Stories**: US-AE-01, US-AE-02, US-AE-03

## Modified

| Path | Change |
|---|---|
| `src/app/core/stores/ui.store.ts` | `agentTabsChromeEnabled` (default true); setter; reset |
| `src/app/core/facade/workflow.facade.ts` | Expose flag; `openAgentTab` skips chip add when flag is false; `selectAgentTab` still navigates |
| `src/app/core/facade/workflow.facade.spec.ts` | Bar off: no chips; still navigate; view still enters; missing agent redirects |
| `src/app/features/canvas/canvas-viewport.component.ts` | **Follow-up 2026-08-19:** delay `setPointerCapture` until node-drag threshold so solution dblclick still fires when `agentTabs.enabled` is false |
| `src/app/core/ui-config/ui-config.service.ts` | **Follow-up 2026-08-19:** sticky last instance `[ui]` so routed nested shell does not reset `agentTabs.enabled` to default true |

## Rules implemented

- Chip add is gated on effective `agentTabs.enabled` (sticky instance `[ui]` across solution → `/agent/:id` when nested omits `[ui]`)
- Navigation to `/agent/:id` is not gated
- Hosts must register `{ path: 'agent/:nodeId', component: AgentSkillsShellComponent }` or dblclick has no nested shell to mount
- Invalid agent route still redirects home
- `createNodeFromPaletteItem` / `enterAgentCanvas` inherit the `openAgentTab` no-op when the bar is off
