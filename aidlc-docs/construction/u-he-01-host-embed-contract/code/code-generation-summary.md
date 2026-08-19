# Code Generation Summary — U-HE-01 Host embed contract

**Stories**: US-HE-01, US-HE-02, US-HE-03, US-HE-04  
**Status**: Part 2 complete (awaiting approval)

## Created (application)

- `src/app/core/ui-config/persist-adapter.ts`
- `src/app/features/shell/shell-layout.embed-contract.spec.ts`

## Modified

- `src/app/core/domain/workflow.serialize.ts` + spec (PBT Partial)
- `src/app/core/ui-config/provide-workflow-builder-ui.ts` + `index.ts`
- `src/app/core/history/autosave.service.ts` (`hostDirty`)
- `src/app/core/stores/graph.store.ts` (`skipHostDirty` on pan)
- `src/app/core/facade/workflow.facade.ts` + spec
- `src/app/features/shell/shell-layout.component.ts`
- `src/app/features/agent/agent-skills-shell.component.ts`
- `src/app/features/shell/chrome-shortcuts.directive.ts`
- `src/app/features/canvas/zoom-controls.component.ts`
- `src/app/features/shell/ui-chrome-gates.spec.ts`
- `docs/workflow-builder-ui-embed.md`

## Unchanged (confirmed)

- Export / Import file chrome
- `src/styles.css` `html, body { height: 100%; }`
- `app-root` `:host { height: 100%; }`
- `src/app/try/` not committed

## Verification

- `npm test` — 298 passed / 40 files
- `npm run build` — success (existing budget warnings)

## Follow-up (2026-08-19)

- Embed docs: host nested route `agent/:nodeId` + `AgentSkillsShellComponent` required for dblclick enter
- Pointer-capture delay lives in U-AE-01 canvas follow-up (not a new U-HE-01 code change)

## SKIP

- API layer, repository layer, deployment artifacts — N/A (client SPA)
