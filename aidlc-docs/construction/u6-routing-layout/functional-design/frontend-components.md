# Frontend Components — U6 Smart Routing & Auto-Layout

## Purpose
Expose Layout dropdown and Route edges controls; wire facade to domain helpers.

## Existing (touched)
| Component | Change |
|---|---|
| `ZoomControlsComponent` or `TopBarComponent` / canvas chrome | Add **Layout ▾** (Vertical / Horizontal / Layered) and **Route edges** |
| `GraphRendererComponent` | No algorithm change; consumes updated positions + waypoints |
| `WorkflowFacade` | `applyLayout(mode)`, `routeEdges()` (layout calls route after) |
| `GraphStore` | Batch position updates + waypoint patches |

## New (presentation thin)
| Component / module | Role |
|---|---|
| Layout menu UI | Three layout actions + route button; disabled in view mode |
| `layout.math.ts` (domain) | Vertical / horizontal / layered placement |
| `edge-routing.ts` (domain) | Medium obstacle-aware path → waypoints |
| Specs | Unit + Partial PBT on helpers |

## Interaction rules
1. Layout selection applies immediately then auto-routes once.
2. Route edges can run alone without layout.
3. Controls live in canvas/top chrome (Q6=A); not in Properties.
4. No modal confirmations.

## ASCII — control placement

```text
+--------------------------------------------------+
| Top bar / canvas chrome                          |
|  [Layout ▾]  [Route edges]  [Zoom ...]           |
+--------------------------------------------------+
| Canvas graph                                     |
+--------------------------------------------------+
```

## Non-goals
- Properties-panel layout controls
- Live routing during drag
- Third-party layout widgets
