# Tech Stack Decisions — U6 Smart Routing & Auto-Layout

## Carry forward
| Concern | Choice |
|---|---|
| Framework | Angular 20 standalone + signals |
| State | GraphStore + UiStore + WorkflowFacade |
| Canvas | Custom SVG edges + HTML nodes (U2–U4) |
| Tests | Vitest + fast-check (Partial PBT) |
| Theme / tokens | Existing CSS variables |

## U6-specific
| Concern | Choice | Rationale |
|---|---|---|
| Routing algorithm | Hand-rolled medium grid / A* (or equivalent) in `core/domain` | FD Q1=B; NFR Q5=A |
| Layout algorithm | Hand-rolled Vertical / Horizontal / Layered (BFS L→R) | FD Q4=A, C1=A, C2=B |
| Execution model | Synchronous on button / after layout | NFR Q2=A |
| UI entry | Canvas/top chrome: Layout ▾ + Route edges | FD Q6=A |
| Post-layout viewport | Fit-to-content once (add helper if absent; reuse viewport math) | NFR Q7=B |
| Fail-soft UX | Bezier fallback + optional status string + `canvasError` on throws | NFR Q6=B |
| Extra npm packages | **None** | NFR Q5=A / FD lock |

## Explicitly excluded
- `dagre` / `@dagrejs/dagre` / `elkjs` / ngx-vflow / React Flow
- Web Workers for pathfinding
- New toast libraries
- Continuous / debounced re-route on node move
