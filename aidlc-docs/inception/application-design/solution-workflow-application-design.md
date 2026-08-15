# Application Design — Solution Workflow Increment (Consolidation)

## Summary

Brownfield enhancement: restore **Blank Agent** under the logic featured strip; **double-click** opens an **agent tab** (no immediate navigate); **tab select** routes to `/agent/:nodeId` with **dedicated nested** skills catalog + selected skills **list/cards**; skills persist on `AIAgent.data.skills[]`; **Back** in top bar returns to the solution canvas.

## Locked Design Decisions

| Topic | Decision |
|---|---|
| Open path | Tab-first (Q1b=B) |
| Navigation | Angular routes (Q1c=B) |
| Skills UI | Cards/list, not nested graph nodes (Q3b=A) |
| Storage | `AIAgent.data.skills[]` (Q2b=A) |
| Nested chrome | Dedicated nested shell children (Q4=B) |
| Back | Top bar (Q5=A) |
| Palette | Condition / Router / Repeater + Blank Agent below (FR-SW-01) |

## Artifact Index

| File | Contents |
|---|---|
| [solution-workflow-components.md](./solution-workflow-components.md) | New/extended components |
| [solution-workflow-component-methods.md](./solution-workflow-component-methods.md) | Facade / UI method signatures |
| [solution-workflow-services.md](./solution-workflow-services.md) | Catalog, skills helpers, orchestration |
| [solution-workflow-component-dependency.md](./solution-workflow-component-dependency.md) | Dependencies + data flow |

## Requirements / stories sync

Patched on this generation:

- `aidlc-docs/inception/requirements/solution-workflow-requirements.md` (FR-SW-02/03/05, goals, scenarios)
- `aidlc-docs/inception/user-stories/solution-workflow-stories.md` (US-SW-02..05)

## Consistency Check

- Matches updated FR-SW-01..05 and US-SW-01..05
- Aligns with execution plan U-SW-01 = P0+P1
- No live skills API; no nested Skill graph in this increment
- R58 empty Untitled boot preserved
- PBT Partial planned for skills array / catalog filter helpers
- Resiliency DR N/A (client SPA)

## Extension Notes

| Extension | Status |
|---|---|
| Resiliency | Compliant / N/A for DR — no new deployable |
| PBT Partial | Design identifies pure helpers for later PBT |
| Security | Disabled |

## Next Stage

**Units Generation** — formalize U-SW-01 (P0+P1) unit boundaries and story map
