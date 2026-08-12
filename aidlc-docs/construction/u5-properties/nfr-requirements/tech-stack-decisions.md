# Tech Stack Decisions — U5 Schema-Driven Properties Panel

## Carry forward
| Concern | Choice |
|---|---|
| Framework | Angular 20 standalone + signals |
| State | GraphStore + UiStore + WorkflowFacade |
| Forms | `@angular/forms` (already in package.json) |
| Tests | Vitest + fast-check (Partial PBT) |
| Theme / tokens | Existing CSS variables |

## U5-specific
| Concern | Choice | Rationale |
|---|---|---|
| Schema format | In-app XPMS-style descriptors | Functional Design C1=B |
| Schema → UI | Hand-map descriptors → reactive controls | Q4 = A; no form-builder libs |
| Nested config | Pure `getAtPath` / `setAtPath` in `core/domain` | Q6 = A; locked nested path |
| Persist | `facade.patchNode` on Save | FD Save-only |
| Selection focus | `selectionFocusNodeId` (or equivalent) on UiStore/facade | FD multi-select = most recent click |
| Extra npm packages | **None** | Q4 = A |

## Explicitly excluded
- `@angular/material` / formly / JSON Forms / ajv (unless later stop-and-ask)
- JSON Schema Draft document runtime
- New toast libraries
- Backend schema HTTP client
