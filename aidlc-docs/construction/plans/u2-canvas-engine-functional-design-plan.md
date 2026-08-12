# U2 Functional Design Plan — Canvas Engine (Navigate + Render + Select)

**Unit**: `u2-canvas-engine`  
**Build phases**: 2–3  
**Stories**: US-2.1–2.4, US-3.1–3.4  
**Depends on**: U1 (shell, stores, facade, seed, CanvasHost placeholder)  
**Status**: GENERATION COMPLETE — AWAITING APPROVAL  

### Locked answers
| # | Answer |
|---|---|
| Q1 | A — middle-mouse or Space+left-drag pan |
| Q2 | A — cursor-anchored wheel zoom; controls toward center; clamp 0.25–2.0 |
| Q3 | A — custom node drag via facade (incl. multi-select move) |
| Q4 | A — click exclusive; Shift toggle; marquee replace/union; edge select |
| Q5 | A — left-drag empty = marquee; pan = Space/middle |
| Q6 | A — straight SVG lines between midpoints |
| Q7 | A — basic minimap with click/drag viewport rect |
| Q8 | A — load seed viewport; mutate in-memory; lost on refresh |
| Q9 | A — icon, label, subtitle, accent, status badge |
| Q10 | A — floating zoom controls bottom-right with minimap |

### Locked from prior stages
| Topic | Decision |
|---|---|
| Rendering | SVG graph layer + HTML node cards |
| Canvas libs | None (custom) |
| CDK | Palette only (U3) — not for canvas node drag |
| U2 out of scope | Palette DnD, connection drawing, properties forms, history, run, auto-layout/routing |

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
- [x] Consistency check vs US-2.* / US-3.* only

### Steps
- [x] Step 1: Viewport / selection domain entities & store responsibilities
- [x] Step 2: Business rules for pan, zoom, select, lasso, minimap
- [x] Step 3: Render model (SVG edges + HTML nodes) and transform math
- [x] Step 4: Frontend component hierarchy (Host → Viewport → Graph/Nodes/Minimap/Zoom)
- [x] Step 5: Explicit U2 non-goals (U3–U8 boundaries)
