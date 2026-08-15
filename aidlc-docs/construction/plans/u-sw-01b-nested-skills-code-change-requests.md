# U-SW-01b Code Change Requests (round 11)

**Unit**: `u-sw-01b-nested-skills`  
**Status**: RESOLVED — awaiting Code Generation re-approval  

---

## Answers (locked)

| Q | Answer |
|---|---|
| Q1 | **A** — Solution Agents Library |
| Q2 | **A** — Solution only |
| Q3 | Use `pipeline/list` (not task/list) with agent payload; on failure show mock agents |
| Q4 | **A** (UI) — implemented Q3 API/behavior as specified |

## Fixes applied

1. Solution Agents Library calls `/api/canvas/pipeline/list` with:
   - `pipeline_type: agent`, `agg_version_info: true`, workflow + version ids from environment
2. Maps `result.metadata.results` → `AIAgent` palette rows
3. On auth miss / empty / HTTP error → shows **mock agents** (Claims / Policy / Notify) plus Blank Agent + logic shapes

## Verification

- `npm test` — see latest run
