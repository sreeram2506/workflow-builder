# Business Logic Summary — U3 Node Palette

## Implemented flows
1. **Browse / search** — `PALETTE_CATEGORIES` + `PALETTE_ITEMS`; search via Subject + `debounceTime(150)`; clear restores full catalog; categories expand/collapse.
2. **CDK drag-drop** — palette `cdkDrag` items connected to canvas `cdkDropList`; drop maps `dropPoint` → world via `screenToWorld` → `facade.createNode`.
3. **Click-to-add** — click / Enter / Space on palette item → `createNodeAtViewportCenter`.
4. **createNode** — validates type; ignores view mode / missing doc; id `n-{type}-{shortRandom}`; `status: idle`, `data: {}`; selects new node only (does not open Properties).

## Key modules
| Module | Role |
|---|---|
| `palette.catalog.ts` | Categories, items, filter helper |
| `node.factory.ts` | Id + defaults |
| `GraphStore.addNode` | Append node |
| `WorkflowFacade.createNode*` | Orchestration + try/catch → canvasError |

## Errors
Unexpected throws in create/drop paths set non-blocking `canvasError`.
