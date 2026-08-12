# Logical Components — U2 (NFR Design)

## In-scope logical components

### ViewportMath
| Field | Detail |
|---|---|
| **Type** | Pure functions under `core/domain/` (or `features/canvas/math/`) |
| **Responsibility** | Clamp scale; screen↔world; zoom-at-point; pan-by-delta; viewport CSS transform string |
| **Inputs** | Viewport, screen points, factors |
| **Outputs** | New Viewport / points |
| **Does not** | Touch DOM or stores |

### CanvasPerformanceScheduler
| Field | Detail |
|---|---|
| **Type** | Injectable Angular service |
| **Responsibility** | Coalesce high-frequency updates onto `requestAnimationFrame`; expose `schedule(fn)` / `cancel` |
| **Inputs** | Callbacks that write viewport or node positions via facade |
| **Outputs** | Single flush per frame |
| **Does not** | Own graph state; replace change detection |

### PointerInteractionController
| Field | Detail |
|---|---|
| **Type** | Logic colocated in `CanvasViewportComponent` **or** small helper class used by it |
| **Responsibility** | Interpret pan (Space/middle), marquee (left-empty), node-drag, wheel zoom; use pointer capture; call scheduler + facade |
| **Does not** | Use CDK; draw connections (U4) |

### CanvasErrorPresenter
| Field | Detail |
|---|---|
| **Type** | Signal on UiStore/facade + optional banner in canvas host/shell |
| **Responsibility** | Show non-blocking message if pointer/render handler throws |
| **Does not** | Replace U1 bootstrap error banner; not a global `ErrorHandler` |

### Existing core (from U1 / Application Design)
- `WorkflowFacade` — viewport, selection, moveNodes APIs
- `GraphStore` / `UiStore` — document, viewport, selection, errors
- `CanvasHost` → Viewport → GraphRenderer / WorkflowNode / Minimap / ZoomControls

## Explicitly out of scope (N/A)
| Component | Reason |
|---|---|
| Spatial index / quadtree | Q2 = A |
| DOM sanitizer npm package | C1 = A |
| Message queues / caches / CB | No backend |
| Workers | Not required for ≤100 nodes |
| API GW / DB / LB | Infrastructure Design skipped |

## PBT logical artifact
| Artifact | Detail |
|---|---|
| `ViewportMath` | Properties: scale always in [0.25, 2.0]; screen↔world round-trip within epsilon |

## Dependency diagram (logical)

```text
Pointer / Wheel
  -> PointerInteractionController
       -> CanvasPerformanceScheduler (rAF)
            -> WorkflowFacade (setViewport / moveNodes / selection)
                 -> GraphStore / UiStore
ViewportMath <- pure helpers used by facade or controller
.catch -> CanvasErrorPresenter (non-blocking)
.world CSS transform <- viewport signal
```
