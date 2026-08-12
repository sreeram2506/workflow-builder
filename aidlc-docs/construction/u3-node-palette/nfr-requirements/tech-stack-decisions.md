# Tech Stack Decisions — U3 Node Palette

## Carry forward
| Concern | Choice |
|---|---|
| Framework | Angular 20 standalone + signals |
| State | GraphStore + UiStore + WorkflowFacade |
| Tests | Vitest + fast-check (Partial PBT) |
| Canvas libs | None (custom SVG/HTML) |

## U3-specific
| Concern | Choice | Rationale |
|---|---|---|
| Drag-drop | `@angular/cdk` (drag-drop) aligned to Angular 20 | Q1 = A; project constraint |
| Extra npm packages | **None** beyond CDK | Q6 = A |
| Search debounce | 150ms | Q3 = A |
| Canvas node move | Still custom (U2) — not CDK | Locked |

## Dependency intent (Code Gen)
```bash
npm install @angular/cdk@^20
```
Use `DragDropModule` / standalone CDK drag-drop directives as appropriate for Angular 20.

## Explicitly excluded
- Other DnD libraries
- Forms libraries (U5)
- Graph/canvas libraries
