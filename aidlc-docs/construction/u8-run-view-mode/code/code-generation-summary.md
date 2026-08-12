# Code Generation Summary — U8 Simulated Run & View Mode

**Unit**: `u8-run-view-mode`  
**Status**: Part 2 COMPLETE  
**Verify**: `npm test` — **66** tests passed; `npm run build` — success (~468 kB main; initial budget warning ~504 kB)

## Generated / evolved paths
| Path | Role |
|---|---|
| `src/app/core/domain/run-order.ts` | BFS seeds + order |
| `src/app/core/domain/run-order.spec.ts` | Examples + Partial PBT |
| `src/app/core/run/run-simulation.service.ts` | RxJS Run pipeline |
| `src/app/core/stores/graph.store.ts` | `patchNodeStatuses` |
| `src/app/core/stores/ui.store.ts` | `runActive`, `runAnnouncement`, `setEditorMode` |
| `src/app/core/facade/workflow.facade.ts` | Run / Stop / Reset / mode APIs |
| `src/app/features/shell/top-bar.component.ts` | Run/Stop/Reset, view toggle, aria-live |
| `src/environments/environment*.ts` | `runStepDelayMs` |

## Docs
- `business-logic-summary.md`, `frontend-components-summary.md`
- `api-layer-SKIP.md`, `deployment-SKIP.md`
- README Phase 10 + View Mode

## Extension compliance
| Extension | Status |
|---|---|
| Resiliency | Soft empty/no-seed; clear `runActive` on stop/error |
| PBT Partial | BFS order invariants |
| Security Baseline | N/A (disabled) |
