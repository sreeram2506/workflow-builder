# Business Logic Summary — U-DC-01 Agent tabs doubleClick config

**Stories**: US-DC-01, US-DC-02, US-DC-03

## Modified

| Path | Change |
|---|---|
| `src/app/core/ui-config/ui-features.types.ts` | `AgentTabsFeatures.doubleClick`; path `agentTabs.doubleClick` |
| `src/app/core/ui-config/merge-ui-features.ts` | Default `true`; normalize `doubleClick`; path index |
| `src/app/core/ui-config/merge-ui-features.spec.ts` | Default / independent of `enabled` / explicit false |
| `src/app/core/ui-config/merge-ui-features.pbt.spec.ts` | Omit → true; explicit false wins; independent of `enabled` |

## Rules implemented

- Absent key after merge stays `true` (compat with today’s always-on dblclick)
- `enabled` and `doubleClick` merge independently
- Invalid / non-boolean leaf dropped (existing `pickBooleanLeaves`)
- No secrets in feature map
