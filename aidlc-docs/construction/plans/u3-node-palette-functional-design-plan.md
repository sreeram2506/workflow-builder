# U3 Functional Design Plan — Node Palette

**Unit**: `u3-node-palette`  
**Build phase**: 4  
**Stories**: US-4.1, US-4.2 (+ click-to-add per Q6)  
**Status**: GENERATION COMPLETE — AWAITING APPROVAL  

### Locked answers
| # | Answer |
|---|---|
| Q1 | B — categorized expandable sections + search |
| Q2 | B — debounced search (~150–200ms) + clear |
| Q3 | A — createNode + select; do not open Properties |
| Q4 | A — canvas viewport drop zone only |
| Q5 | A — CDK default drag preview |
| Q6 | B — also click-to-add near viewport center |
| Q7 | A — id `n-{type}-{shortRandom}`; idle; empty data |

---

## Part B — Generation Checklist

### Planning
- [x] All questions answered
- [x] Ambiguities resolved

### Artifacts
- [x] `business-logic-model.md`
- [x] `business-rules.md`
- [x] `domain-entities.md`
- [x] `frontend-components.md`

### Steps
- [x] Step 1: Palette catalog model + categories/search
- [x] Step 2: createNode facade/store rules
- [x] Step 3: CDK drag from library → canvas drop → world coords
- [x] Step 4: Component hierarchy (evolve LeftSidebar / NodePalette)
- [x] Step 5: Explicit U3 non-goals (U4–U8)
