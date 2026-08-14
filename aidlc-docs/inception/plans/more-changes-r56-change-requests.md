# More Changes R56 — Change Requests

**Source**: `more-changes-r56-clarification-questions.md`  
**Answers**: Q1=A · Q2=A · Q3=A  
**Freeform**: Condition top/bottom connectors not connecting when dragging onto them

## Scope

| ID | Request | Status |
|----|---------|--------|
| R56-1 | Condition top/bottom accept connector drops | Done |

## Notes

- Root cause: AABB Euclidean snap on the diamond flanks preferred left/right over top/bottom
- Body snap now uses **angle-from-center** among input ports (`nearestInputSideByAngle`)
- Condition ports/handles inset ~6% to match rhombus SVG tips
- Unit test covers Condition upper/lower tip → top/bottom
