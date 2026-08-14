# More Changes R55 — Change Requests

**Source**: `more-changes-r55-clarification-questions.md`  
**Answers**: Q1=F · Q2=A · Q3=A  
**Freeform**: still see Route icon in canvas bar

## Scope

| ID | Request | Status |
|----|---------|--------|
| R55-1 | Remove **Route** button from canvas chrome bar | Done |

## Notes

- Removed from `zoom-controls.component.ts` (button + `routeEdges` output)
- Unwired from `canvas-viewport.component.ts`
- `facade.routeEdges()` still used internally by Layout apply
