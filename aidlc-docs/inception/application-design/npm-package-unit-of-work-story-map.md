# Unit of Work Story Map — npm package publish

**Grouping**: Plan Q1=A — all stories in U-NP-01

---

## Story → Unit

| Story | Title | Unit | Notes |
|---|---|---|---|
| US-NP-01 | Install and import public API | **U-NP-01** | Library + name + barrel + peers |
| US-NP-02 | Styles / tokens | **U-NP-01** | Ship or document |
| US-NP-03 | npm pack; publish documented not run | **U-NP-01** | No npm publish |
| US-NP-04 | SPA + docs; no try/secrets | **U-NP-01** | Tests stay green |

**FR coverage**

| FR | Unit |
|---|---|
| FR-NP-01 Angular library project | U-NP-01 |
| FR-NP-02 Package identity | U-NP-01 |
| FR-NP-03 Public barrel | U-NP-01 |
| FR-NP-04 Styles and assets | U-NP-01 |
| FR-NP-05 Peer dependencies | U-NP-01 |
| FR-NP-06 Pack, not publish | U-NP-01 |
| FR-NP-07 SPA still builds and tests | U-NP-01 |
| FR-NP-08 Embed docs | U-NP-01 |
| FR-NP-09 Do not publish secrets or try | U-NP-01 |
| NFR Security (new-code scoped) | U-NP-01 |
| NFR Resiliency | U-NP-01 (DR N/A; U-HE-01 fail-safe unchanged) |
| NFR PBT Partial | U-NP-01 (existing serialize PBT) |

---

## Coverage check

| Check | Status |
|---|---|
| All US-NP-01..04 assigned | Yes |
| No story in a second unit | Yes (single unit) |
| Construction stages (Q2=A) | Skip FD/NFR/Infra; CG → Build/Test |
| Code layout (Q3=A) | `projects/enso-workflow-builder`; SPA stays |
| Ownership (Q4=A) | Same stream |

---

## Persona emphasis

| Unit | Primary persona |
|---|---|
| U-NP-01 | P-HOST (npm install) + P-AUTHOR (SPA demo still works) |
