# Properties UX — Follow-up Change Requests

**Status**: ANSWERED — sidebar motion updated

### Locked
| # | Answer |
|---|---|
| Q1 | B — transition / animation |
| Q2 | X — industry-style sidebar animation |
| Q3 | C — different motion (edge slide, not scale) |

## Done
- Properties panel uses **right-edge slide** (`translate3d`) ~280ms with `cubic-bezier(0.32, 0.72, 0, 1)` (common drawer/sidebar easing)
- Removed scale/blur-style motion
- Chip fades in slightly after panel exits
- Auto-collapse behavior unchanged; reduced-motion still disables transitions
