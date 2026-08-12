# U5 NFR Design Plan — Schema-Driven Properties Panel

**Unit**: `u5-properties`  
**Stories**: US-6.1 (+ US-6.2 readiness)  
**Status**: GENERATION COMPLETE — AWAITING APPROVAL  

**Inputs:** FD (XPMS schema, Save-only, selection focus) · NFR Requirements (no new libs, path helpers, fail-soft, PBT)

### Locked answers
| # | Answer |
|---|---|
| Q1 | B — dual-write `propertiesDraft` in UiStore; GraphStore only on Save |
| Q2 | A — fail-soft on `patchNode` only |
| Q3 | A — static `properties.schema.ts` module |
| Q4 | A — evolve RightSidebar in place; no PropertiesService |
| Q5 | A — text-only descriptor binding |

---

## Part B — Generation Checklist

### Planning
- [x] All questions answered
- [x] Ambiguities resolved

### Artifacts
- [x] `nfr-design-patterns.md`
- [x] `logical-components.md`

### Steps
- [x] Step 1: Performance patterns (dual-write draft until Save)
- [x] Step 2: Resilience patterns (patchNode fail-soft)
- [x] Step 3: Scalability / static registry module
- [x] Step 4: Logical component map + dependency diagram
- [x] Step 5: Security hygiene + testing alignment
- [x] Step 6: Confirm Infrastructure Design → SKIP
