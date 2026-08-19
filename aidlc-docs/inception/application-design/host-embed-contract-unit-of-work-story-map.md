# Unit of Work Story Map — Host embed contract

**Grouping**: Plan Q1=A — all stories in U-HE-01

---

## Story → Unit

| Story | Title | Unit | Notes |
|---|---|---|---|
| US-HE-01 | Load `[document]`; invalid keeps last good | **U-HE-01** | Fail-safe; no throw |
| US-HE-02 | getDocument / dirty / documentChange | **U-HE-01** | Flush nested first |
| US-HE-03 | Save/Run handlers vs defaults | **U-HE-01** | First-win shell output over provider |
| US-HE-04 | Fill host height; embed docs | **U-HE-01** | No `[height]`; no ng-packagr |

**FR coverage**

| FR | Unit |
|---|---|
| FR-HE-01 Load document | U-HE-01 |
| FR-HE-02 Invalid load fail-safe | U-HE-01 |
| FR-HE-03 Get document and dirty | U-HE-01 |
| FR-HE-04 documentChange output | U-HE-01 |
| FR-HE-05 Save host hook | U-HE-01 |
| FR-HE-06 Run host hook | U-HE-01 |
| FR-HE-07 Export / Import files | U-HE-01 |
| FR-HE-08 Fill host height | U-HE-01 |
| FR-HE-09 Embed docs | U-HE-01 |
| NFR Security (new-code scoped) | U-HE-01 |
| NFR Resiliency (invalid load) | U-HE-01 |
| NFR PBT Partial | U-HE-01 (serialize/parse round-trip) |

---

## Coverage check

| Check | Status |
|---|---|
| All US-HE-01..04 assigned | Yes |
| No story in a second unit | Yes (single unit) |
| Construction stages (Q2=A) | Skip FD/NFR/Infra; CG → Build/Test |
| Code layout (Q3=A) | Change in place; no `core/embed-contract/` |
| Ownership (Q4=A) | Same stream |

---

## Persona emphasis

| Unit | Primary persona |
|---|---|
| U-HE-01 | P-HOST (contract) + P-AUTHOR (defaults still work) + P-REVIEWER (view Save off) |
