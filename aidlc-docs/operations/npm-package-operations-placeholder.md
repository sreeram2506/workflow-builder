# Operations — npm package publish

**Status**: PLACEHOLDER  
**Date**: 2026-08-19  
**Increment**: npm package publish (U-NP-01, `enso-workflow-builder` @ `0.1.0`)

## Current state

AI-DLC Operations is not implemented in this workflow version. Build and Test for this increment completed under CONSTRUCTION and was approved.

The product is a client Angular library plus the existing SPA demo:

- Library: `npm run build:lib` / `npm run pack:lib` → `dist/enso-workflow-builder/enso-workflow-builder-0.1.0.tgz`
- SPA: `npm start` / `npm run build` / `npm test`
- Hosts install the tarball (or later `npm install enso-workflow-builder`) and import from `'enso-workflow-builder'`
- `npm publish` was **not** run this increment
- `src/app/try/` remains gitignored and is not in the tarball

No cloud deployable, monitoring stack, or registry publish pipeline is generated here.

## Future scope (when Operations expands)

- Deployment planning and execution (including optional npm registry publish with auth)
- Monitoring and observability
- Incident response
- Maintenance / support workflows
- Production readiness checklists

## Increment outcome

| Unit | Result |
|---|---|
| U-NP-01 npm package publish | COMPLETE |
| Build and Test | Approved — 300 tests passed; library tarball; SPA `dist/workflow-builder` |
| Operations | Placeholder — workflow ends here for this increment |

Embed + install: `docs/workflow-builder-ui-embed.md`

## Post-ops polish (not a new increment)

**2026-08-19** — With `agentTabs.enabled: false`, solution dblclick failed to enter nested agent because `canvas-viewport` captured the pointer on first press (tab strip no longer re-rendered). Capture is delayed until drag threshold. Hosts still need `{ path: 'agent/:nodeId', component: AgentSkillsShellComponent }`. Recorded under U-AE-01 construction summaries.
