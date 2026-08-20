# Unit of Work Story Map — Dynamic Properties

**Grouping**: Plan Q1=A — all stories in U-DP-01

---

## Story → Unit

| Story | Title | Unit | Notes |
|---|---|---|---|
| US-DP-01 | Schema bind to `properties`; Save via `patchNode` | **U-DP-01** | General always; view disables |
| US-DP-02 | Dynamic Property + inference for remaining keys | **U-DP-01** | No reserved-key filter in map |
| US-DP-03 | Built-ins always; colliding dynamic keys omitted | **U-DP-01** | Condition/Router/Repeater |
| US-DP-04 | Add property when chrome flag on | **U-DP-01** | Default false |
| US-DP-05 | Embed docs + try host | **U-DP-01** | Vendor-neutral |

**FR coverage**

| FR | Unit |
|---|---|
| FR-DP-01 Properties value map | U-DP-01 |
| FR-DP-02 Dynamic Property component | U-DP-01 |
| FR-DP-03 Inference | U-DP-01 |
| FR-DP-04 Schema + remaining keys | U-DP-01 |
| FR-DP-05 Built-ins + dynamic | U-DP-01 |
| FR-DP-06 Add property | U-DP-01 |
| FR-DP-07 Save / write-back | U-DP-01 |
| FR-DP-08 Vendor neutrality | U-DP-01 |
| FR-DP-09 Docs and try host | U-DP-01 |
| NFR-DP-01 Security | U-DP-01 |
| NFR-DP-02 Resiliency | U-DP-01 |
| NFR-DP-03 PBT Partial | U-DP-01 |
| NFR-DP-04 Compatibility | U-DP-01 |
| NFR-DP-05 UX | U-DP-01 |

---

## Coverage check

| Check | Status |
|---|---|
| All US-DP-01..05 assigned | Yes |
| No story unassigned | Yes |
| FR-DP-01..09 covered | Yes |
| Single unit matches execution plan | Yes |
