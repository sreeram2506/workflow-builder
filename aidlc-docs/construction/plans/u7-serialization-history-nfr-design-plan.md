# U7 NFR Design Plan — Serialization, Autosave, History, Clipboard

**Unit**: `u7-serialization-history`  
**Stories**: US-9.1–US-9.5  
**Status**: GENERATION COMPLETE — AWAITING APPROVAL  

### Locked answers
| # | Answer |
|---|---|
| Q1 | A — injectable `HistoryService` |
| Q2 | B — GraphStore write interceptor hooks history |
| Q3 | A — RxJS Subject + debounceTime(500) |
| Q4 | B — `ImportWorkflowDialogComponent` |
| Q5 | B — `SerializationService` wrapping pure helpers |
| Q6 | B — allowlist / strip unknown top-level keys on import |
| Q7 | A — SKIP Infrastructure Design |

---

## Part B — Generation Checklist

### Planning
- [x] All questions answered
- [x] Ambiguities resolved (HistoryService owns stacks; GraphStore interceptor pushes)

### Artifacts
- [x] `nfr-design-patterns.md`
- [x] `logical-components.md`

### Steps
- [x] Step 1: Performance patterns (structuredClone, debounce, coalesce)
- [x] Step 2: Resilience patterns (import reject, inline + canvasError)
- [x] Step 3: Scalability (stack cap 100)
- [x] Step 4: Logical component map + dependency diagram
- [x] Step 5: Security hygiene + testing alignment
- [x] Step 6: Confirm Infrastructure Design SKIP/run

---

## Approval
Awaiting user: **Request Changes** or **Continue to Next Stage** (Infrastructure Design — will SKIP per Q7=A, then Code Generation plan).
