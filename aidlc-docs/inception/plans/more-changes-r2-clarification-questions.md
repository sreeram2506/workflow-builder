# More Changes — Clarification Questions (round 2)

**Status**: ANSWERED — implemented (direct)

### Locked
| # | Answer |
|---|---|
| Q1 | C — new behavior |
| Q2 | C — Nodes Library (+ Properties delete; canvas Delete) |
| Q3 | A — freeform list |
| Q4 | A — direct implement |

## Done
1. **Delete**
   - `Delete` / `Backspace` removes selected **nodes** (and incident edges) or **edges**
   - Properties header **trash** icon deletes the focused node/edge (edit mode only)
2. **Nodes Library**
   - Same drawer motion as Properties: left-edge slide (~280ms), chip fade-in after exit
