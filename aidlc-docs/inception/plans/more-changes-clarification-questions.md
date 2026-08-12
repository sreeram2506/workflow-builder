# More Changes — Clarification Questions

**Status**: ANSWERED — Properties UX implemented (direct pass; Q4=C deferred as overkill for this scope)

### Locked
| # | Answer |
|---|---|
| Q1 | A — UX polish |
| Q2 | D — Properties panel |
| Q3 | X — auto-collapse when empty / click-out; transition on close |
| Q4 | C requested; **applied as direct implement** for this small polish |

## Done
- Empty / deselect → Properties auto-collapses to chip
- Open/close transition (opacity + slide/scale); respects `prefers-reduced-motion`
- Default session state: Properties starts collapsed
- Selecting a single node/edge still expands the panel
