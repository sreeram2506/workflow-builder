# Unit ↔ Story Map — Solution Workflow Increment

All stories from `solution-workflow-stories.md` are assigned. Original `unit-of-work-story-map.md` and `logic-nodes-unit-of-work-story-map.md` are unchanged.

| Story | Title | Unit | FR |
|---|---|---|---|
| US-SW-01 | Add Blank Agent from the solution palette | **U-SW-01a** | FR-SW-01 |
| US-SW-02 | Open agent tab then nested skills view | **U-SW-01b** | FR-SW-02, FR-SW-03 |
| US-SW-03 | Add developed skills to the agent list | **U-SW-01b** | FR-SW-03, FR-SW-04 |
| US-SW-04 | Return to solution canvas with skills preserved | **U-SW-01b** | FR-SW-03, FR-SW-05 |
| US-SW-05 | Properties and view mode on nested skills view | **U-SW-01b** | FR-SW-03, NFR-SW-02 |

### U-SW-01a non-story scope (explicit)

Tab chrome (dblclick → open/focus agent tab, stay on solution canvas) is **implemented in U-SW-01a** as a prerequisite for US-SW-02, but **US-SW-02 acceptance criteria** (including nested route open) are verified in **U-SW-01b** only (Q6=B).

---

## Coverage Check

| Unit | Stories |
|---|---|
| U-SW-01a | US-SW-01 (+ tab chrome prerequisite) |
| U-SW-01b | US-SW-02, US-SW-03, US-SW-04, US-SW-05 |

- **Orphan stories**: None  
- **Personas**: P-AUTHOR (01–05), P-REVIEWER (04–05 Back / view)

## First Construction Focus

**U-SW-01a only** for the next CONSTRUCTION loop.  
**U-SW-01b** after U-SW-01a Build/Test approval.
