# Tech Stack Decisions — U8 Simulated Run & View Mode

## Carry forward
| Concern | Choice |
|---|---|
| Framework | Angular 20 standalone + signals |
| State | GraphStore + UiStore + WorkflowFacade |
| Tests | Vitest + fast-check |
| Status / errors | `canvasStatus` / `canvasError` |

## U8-specific
| Concern | Choice | Rationale |
|---|---|---|
| Walk order | Pure BFS helpers in `core/domain` | FD Q1=A |
| Animation pipeline | RxJS (`timer` / `concatMap` / `takeUntil`) in RunSimulation service | NFR Q2=B |
| Step delay | 400 ms default; ≤50 ms if `prefers-reduced-motion` | FD + NFR Q7=A |
| A11y live region | Polite `aria-live` in shell/top bar | NFR Q3=B |
| View mode | Existing `editorMode` + top-bar toggle | FD Q6=A |
| Extra npm packages | **None** | NFR Q5=A |

## Explicitly excluded
- Backend execution clients
- Animation libraries (GSAP, etc.)
- Toast libraries
