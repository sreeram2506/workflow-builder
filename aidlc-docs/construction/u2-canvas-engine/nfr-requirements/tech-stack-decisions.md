# Tech Stack Decisions — U2 Canvas Engine

## Carry forward from U1 (unchanged)
| Concern | Choice |
|---|---|
| Framework | Angular 20 standalone + signals |
| State | GraphStore + UiStore + WorkflowFacade |
| Styling | CSS design tokens (light/dark) |
| Unit tests | Vitest |
| PBT | `fast-check` (Partial) |
| Package manager | npm |
| Backend / persistence | None / in-memory only |

## U2-specific decisions
| Concern | Choice | Rationale |
|---|---|---|
| Canvas / pan-zoom libraries | **None** | C2b = A; custom SVG + HTML + pointer events |
| Gesture libraries | **None** | Same |
| CDK drag-drop | **Not used** on canvas nodes | Palette only in U3 |
| Rendering | SVG edges + HTML node cards | Requirements + Functional Design |
| Pointer model | Pointer Events + `setPointerCapture`; rAF-batched updates; passive wheel where safe | Q3 = B |
| Zoom bounds | 0.25–2.0 | Functional Design |
| Design size claim | ≤100 nodes | C1 = B |
| New npm dependencies for U2 | **Zero** | C2b = A |

## Explicitly excluded in U2
- ngx-vflow, React Flow, Konva, Paper.js, hammer.js, or any pan/zoom helper package
- `@angular/cdk` (until U3 palette)
- localStorage
- Backend clients

## Notes for NFR Design / Code Generation
- Implement pure viewport math helpers (testable with fast-check)
- Keep transforms on a single world layer for pan/zoom coherence with grid
- Prefer CSS `transform` for the world layer; avoid layout thrash during drag
