# Integration Test Instructions — U-DP-01 Dynamic Properties

## Purpose
Validate Properties panel + host schema + dynamic map + chrome interact correctly within the SPA (no multi-service deploy).

## Automated scenarios (in `npm test`)

| Scenario | Coverage |
|---|---|
| Host schema binds/Saves to `node.data.properties` | `right-sidebar.component.spec.ts` |
| Remaining key appears; collision omits `condition` | same |
| Built-in Condition/Repeater still bind on `node.data` | same |
| Malformed map / inference helpers | `host-properties.dynamic*.spec.ts` |

## Manual / try-host

1. `npm start` (Node 22+)
2. Open try-ui (if routed) → Catalog **Host properties**
3. Drop **Timeout Action** → edit schema fields → Save → inspect `data.properties`
4. UI preset **Add property** → add a key → Save
5. Drop **Host If (schema)** → confirm Condition built-in + `branchNote` host section

## Cleanup
No external services; refresh SPA or discard in-memory document.
