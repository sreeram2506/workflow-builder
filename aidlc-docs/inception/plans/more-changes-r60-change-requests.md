# More Changes R60 — Change Requests

**Source**: `more-changes-r60-clarification-questions.md`

## Scope

| ID | Request | Status |
|----|---------|--------|
| R60-1 | Allow connecting any handle to any handle (incl. output→output) | Done |
| R60-2 | When agent has no description, center the name (not top-aligned empty desc) | Done |

## Notes

- `arePortsCompatible` / `resolveConnection` accept any side pair; self-loop still rejected
- Body snap and `lockEdgePortSides` consider all four ports
- Library/agent cards hide empty description; `no-desc` centers the title mid-card
- Canvas cards hide empty subtitle the same way
