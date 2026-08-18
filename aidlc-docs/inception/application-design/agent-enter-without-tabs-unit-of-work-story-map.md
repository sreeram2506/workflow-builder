# Unit of Work Story Map — Enter agent without tab bar

**Grouping**: Plan Q1=A — all stories in U-AE-01

---

## Story → Unit

| Story | Title | Unit | Notes |
|---|---|---|---|
| US-AE-01 | Double-click enter with bar off; no hidden chips | **U-AE-01** | Gate `openAgentTab`; keep dblclick navigate |
| US-AE-02 | Tab chips enter when bar on | **U-AE-01** | Existing chip path unchanged |
| US-AE-03 | Nested Back; no re-enter; View still enters | **U-AE-01** | Independent Back/Solution; nested dblclick no-op |
| US-AE-04 | Embed/try: bar is chrome | **U-AE-01** | Docs; do not commit try unless asked |

**FR coverage**

| FR | Unit |
|---|---|
| FR-AE-01 Double-click enters | U-AE-01 |
| FR-AE-02 Tab bar still enters | U-AE-01 |
| FR-AE-03 No re-enter inside nested | U-AE-01 |
| FR-AE-04 Back without tab strip | U-AE-01 |
| FR-AE-05 No hidden tabs when bar off | U-AE-01 |
| FR-AE-06 View mode | U-AE-01 |
| FR-AE-07 Chrome flag unchanged | U-AE-01 |
| FR-AE-08 Embed / try | U-AE-01 |
| NFR Security (new-code scoped) | U-AE-01 |
| NFR Resiliency (fail-safe missing agent) | U-AE-01 |
| NFR PBT Partial | U-AE-01 (example gating tests; no new pure transform) |

---

## Coverage check

| Check | Status |
|---|---|
| All US-AE-01..04 assigned | Yes |
| No story in a second unit | Yes (single unit) |
| Construction stages (Q2=A) | Skip FD/NFR/Infra; CG → Build/Test |
| Code layout (Q3=A) | Change in place; no `core/agent-nav/` |
| Ownership (Q4=A) | Same stream |

---

## Persona emphasis

| Unit | Primary persona |
|---|---|
| U-AE-01 | P-AUTHOR (enter/exit) + P-HOST (chrome flag) + P-REVIEWER (view enter) |
