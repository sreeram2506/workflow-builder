# Code Generation Summary — U-AE-01 Enter agent without tab bar

**Stories**: US-AE-01, US-AE-02, US-AE-03, US-AE-04  
**Status**: Part 2 complete (awaiting approval)

## Created (application)

- `src/app/features/agent/agent-skills-shell.nested-back.spec.ts`

## Modified

- `src/app/core/stores/ui.store.ts`
- `src/app/core/facade/workflow.facade.ts` + spec
- `src/app/features/shell/shell-layout.component.ts`
- `src/app/features/agent/agent-skills-shell.component.ts`
- `src/app/features/shell/ui-chrome-gates.spec.ts`
- `docs/workflow-builder-ui-embed.md`

## Unchanged at original CG (later revised)

- `src/app/core/ui-config/ui-config.service.ts` — sticky last instance `[ui]` so routed nested shell without `[ui]` keeps solution chrome
- `src/app/features/canvas/canvas-viewport.component.ts` — originally left unchanged; **follow-up 2026-08-19** delayed pointer capture so dblclick works with `agentTabs.enabled: false`
- `src/app/features/shell/agent-tabs.component.ts` — chip enter/exit when bar on

## Verification

- Original CG: `npm test` — 280 passed / 39 files; `npm run build` success
- Follow-up 2026-08-19: `npm test` — 302 passed / 41 files; sticky instance `[ui]` across `/agent/:id`; embed docs require host route `/agent/:nodeId`

## SKIP

- API layer, repository layer, deployment artifacts — N/A (client SPA)
