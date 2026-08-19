# More Changes R61 — Change Requests

**Source**: `more-changes-r61-clarification-questions.md`

## Scope

| ID | Request | Status |
|----|---------|--------|
| R61-1 | Connection handle dots same color on all sides (no filled “output” accent) | Done |
| R61-2 | Do not invent agent descriptions; keep name centered when description absent | Done |

## Notes

- Removed `.handle-output` / `.handle-input` color split — all handles match elevated + edge stroke
- Subtitle/description only set from trimmed provided text (`''` if missing)
- Library cards keep `no-desc` name centering; no placeholder description added
