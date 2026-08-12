# Tech Stack Decisions — U4 Connections & Edge Reshape

## Carry forward
| Concern | Choice |
|---|---|
| Framework | Angular 20 standalone + signals |
| State | GraphStore + UiStore + WorkflowFacade |
| Canvas | Custom SVG edges + HTML nodes (no graph libs) |
| Scheduler | `CanvasPerformanceScheduler` (rAF) |
| Tests | Vitest + fast-check (Partial PBT) |
| Palette DnD | `@angular/cdk` (U3) — **not** used for edge draw |

## U4-specific
| Concern | Choice | Rationale |
|---|---|---|
| Edge draw gesture | Pointer events + capture | Q5 = A; matches U2 node drag |
| Geometry / path | Existing viewport math + small pure helpers | No new deps |
| Invalid feedback | CSS danger stroke on preview only | Q6 = A / FD |
| Extra npm packages | **None** | Q5 = A |

## Explicitly excluded
- Connection/graph libraries (React Flow, ngx-vflow, etc.)
- Geometry npm packages
- CDK drag for wire drawing
- New toast/notification libraries
