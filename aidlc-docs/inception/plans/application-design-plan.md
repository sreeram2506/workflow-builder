# Application Design Plan — Angular Workflow Builder

**Status**: GENERATION COMPLETE — AWAITING DESIGN APPROVAL  
**Sources**: `requirements.md`, `stories.md`, `execution-plan.md`

### Locked decisions
| # | Choice |
|---|---|
| Q1 | Feature folders + core + shared |
| Q2 | GraphStore + UiStore + facade |
| Q3 | Viewport + GraphRenderer + WorkflowNode |
| Q4 | Thin services over pure domain |
| Q5 | History deferred (not in design) |
| Q6 | Properties via facade + schema registry |
| Q7 | Full map now; P1 = shell + tokens + seed |

---

## Part A — Design Clarifying Questions

### Question 1
[Answer]: A

### Question 2
[Answer]: B

### Question 3
[Answer]: A

### Question 4
[Answer]: A

### Question 5
[Answer]: B

### Question 6
[Answer]: A

### Question 7
[Answer]: A

---

## Part B — Generation Checklist

### Planning
- [x] All Part A questions answered
- [x] Ambiguities resolved
- [x] Proceed to generate design artifacts

### Mandatory artifacts
- [x] `application-design/components.md`
- [x] `application-design/component-methods.md`
- [x] `application-design/services.md`
- [x] `application-design/component-dependency.md`
- [x] `application-design/application-design.md` (consolidation)
- [x] Validate completeness/consistency vs requirements (no scope creep)

### Generation steps
- [x] Step 1: Identify components per Q1–Q3, Q5, Q7
- [x] Step 2: Define high-level methods per component (no deep business rules)
- [x] Step 3: Define services and orchestration per Q2, Q4, Q6
- [x] Step 4: Document dependencies and data flow
- [x] Step 5: Consolidate into application-design.md
- [x] Step 6: Consistency check against FR/US and Phase 1 gate
