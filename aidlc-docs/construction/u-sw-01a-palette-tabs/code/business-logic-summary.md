# Business Logic Summary — U-SW-01a

## Created
- `src/app/core/domain/agent-tabs.ts` — `MAX_AGENT_TABS`, open/close/focus/prune with FIFO
- `src/app/core/domain/agent-tabs.spec.ts` — unit + PBT Partial (idempotent open, max length)

## Modified
- `src/app/core/domain/palette.catalog.ts` — restore `AIAgent` / Blank Agent; `BLANK_AGENT_TYPE`, `blankAgentPaletteItem()`
- `src/app/core/domain/palette.catalog.spec.ts` — Blank Agent presence; not in featured types
- `src/app/core/stores/ui.store.ts` — `agentTabs`, `focusedAgentTabId`, `setAgentTabs`, reset clears tabs
- `src/app/core/facade/workflow.facade.ts` — `openAgentTab`, `closeAgentTab`, `focusAgentTabChrome`, `agentTabLabel`, prune on delete
- `src/app/core/facade/workflow.facade.spec.ts` — agent tab behaviors

## Rules covered
BR-SW01A-01..10 (palette placement, create, dblclick, focus, FIFO, label, close, view mode, prune, session-only)
