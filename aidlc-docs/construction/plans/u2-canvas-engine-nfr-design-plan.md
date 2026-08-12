# U2 NFR Design Plan — Canvas Engine

**Unit**: `u2-canvas-engine`  
**Status**: GENERATION COMPLETE — AWAITING APPROVAL  

### Locked answers
| # | Answer |
|---|---|
| Q1 | A — shared `.world` CSS transform + rAF coalesce |
| Q2 | A — full signal render; no spatial index |
| Q3 | B — try/catch + non-blocking canvas error banner |
| Q4 / C1 | A — hygiene only (no sanitizer package) |
| Q5 | B — include `CanvasPerformanceScheduler` injectable |
| Q6 | B — optional zoom-button easing gated by `prefers-reduced-motion` |

### Locked from NFR Requirements
| Topic | Decision |
|---|---|
| Perf bar | Qualitative smoothness; no CI FPS |
| Scale claim | ≤100 nodes |
| Libs | None new |
| PBT | Viewport clamp + screen↔world |

---

## Part B — Generation Checklist

### Planning
- [x] All questions answered
- [x] Ambiguities resolved (Q4 → C1 = A)

### Artifacts
- [x] `nfr-design-patterns.md`
- [x] `logical-components.md`

### Steps
- [x] Step 1: Map NFR-P/S/U/M to patterns
- [x] Step 2: Document resilience/security/scalability patterns (incl. N/A)
- [x] Step 3: Logical components & responsibilities
- [x] Step 4: Extension compliance notes
