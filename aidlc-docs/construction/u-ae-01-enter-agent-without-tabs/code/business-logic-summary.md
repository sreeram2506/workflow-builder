# Business Logic Summary — U-AE-01 Enter agent without tab bar

**Stories**: US-AE-01, US-AE-02, US-AE-03

## Modified

| Path | Change |
|---|---|
| `src/app/core/stores/ui.store.ts` | `agentTabsChromeEnabled` (default true); setter; reset |
| `src/app/core/facade/workflow.facade.ts` | Expose flag; `openAgentTab` skips chip add when flag is false; `selectAgentTab` still navigates |
| `src/app/core/facade/workflow.facade.spec.ts` | Bar off: no chips; still navigate; view still enters; missing agent redirects |
| `src/app/features/canvas/canvas-viewport.component.ts` | Unchanged — solution dblclick still `selectAgentTab`; nested still no re-enter |

## Rules implemented

- Chip add is gated on effective `agentTabs.enabled` published from the mounted shell (root facade cannot see instance `[ui]`)
- Navigation to `/agent/:id` is not gated
- Invalid agent route still redirects home
- `createNodeFromPaletteItem` / `enterAgentCanvas` inherit the `openAgentTab` no-op when the bar is off
