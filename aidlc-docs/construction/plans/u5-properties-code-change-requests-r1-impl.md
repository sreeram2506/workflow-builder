# U5 Change Request R1 — Implementation Notes

## Locked clarification answers
| Q | Answer |
|---|---|
| C1 | B — Only enso palette API (not Properties mouseout) |
| C2 | B — Backend override allowed for task/list |
| C3 | A — Implement in U3 palette / left sidebar |
| C4 | N/A (Q1 not in scope this round) |
| C5 | A — (Q1 polish deferred) |

## Delivered
- `EnsoTaskCatalogService` → `POST` task/list with Bearer token
- Mapper groups by `user_category`; items create as `Action` nodes with `data.ensoTask`
- Dev proxy `/enso-api` → enso-suite-be
- Fail-soft: no token / HTTP error → static catalog + banner

## Auth
1. Copy enso-suite `localStorage.currentUser` (must include `accesstoken`), **or**
2. Set `environment.ensoAccessToken`

## Docs refreshed
- README Phase 6 exception
- This note
