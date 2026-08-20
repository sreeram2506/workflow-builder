# Unit of Work Story Map — Agent tabs doubleClick config

**Grouping**: Plan Q1=A — all stories in U-DC-01

---

## Story → Unit

| Story | Title | Unit | Notes |
|---|---|---|---|
| US-DC-01 | Default / omit still enters | **U-DC-01** | Leaf + merge + default true |
| US-DC-02 | Flag false blocks canvas dblclick | **U-DC-01** | Edit and view |
| US-DC-03 | Independent of strip; both false = no enter | **U-DC-01** | Matrix of `enabled` × `doubleClick` |
| US-DC-04 | Chip click still enters; nested no re-enter | **U-DC-01** | Keep U-AE-01 nested no-op |
| US-DC-05 | Embed/JSON documents the leaf | **U-DC-01** | Docs + examples; no secrets |

**FR coverage**

| FR | Unit |
|---|---|
| FR-DC-01 Feature leaf | U-DC-01 |
| FR-DC-02 Merge precedence | U-DC-01 |
| FR-DC-03 Canvas double-click gated | U-DC-01 |
| FR-DC-04 Independent of strip chrome | U-DC-01 |
| FR-DC-05 Chip single-click unchanged | U-DC-01 |
| FR-DC-06 Nested canvas no re-enter | U-DC-01 |
| FR-DC-07 View mode | U-DC-01 |
| FR-DC-08 Embed / examples | U-DC-01 |
| NFR Security (no secrets in config) | U-DC-01 |
| NFR PBT Partial (merge invariant) | U-DC-01 |

---

## Coverage check

| Check | Status |
|---|---|
| All US-DC-01..05 assigned | Yes |
| No story in a second unit | Yes (single unit) |
| Construction stages (Q2=A) | Skip FD/NFR/Infra; CG → Build/Test |
| Code layout (Q3=A) | Change in place; no new helper module |
| Ownership (Q4=A) | Same stream |

---

## Persona emphasis

| Unit | Primary persona |
|---|---|
| U-DC-01 | P-HOST (flag) + P-AUTHOR (canvas dblclick) + P-REVIEWER (view gate) |
