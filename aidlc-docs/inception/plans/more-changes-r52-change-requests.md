# More Changes R52 — Change Requests

**Source**: `more-changes-r52-clarification-questions.md`  
**Answers**: Q1=X (Router, Condition, Repeater, Blank Agent) · Q2=A · Q3=A

## Scope

| ID | Request | Status |
|----|---------|--------|
| R52-1 | Featured strip drag should match other Nodes Library cards (no pop / odd snap-back) | Done |

## Notes

- Root cause: Condition / Router / Repeater / Blank Agent used free `cdkDrag` outside a `cdkDropList`, so the source element itself moved and snapped back
- Category cards already live in `wb-palette-list` drop list (placeholder + preview)
- Wrapped `featured-strip` in its own drop list (`wb-featured-palette-list`) with the same copy-only settings
- Logic shape tiles are `div` listitems (same pattern as node cards) for consistent drag behavior
