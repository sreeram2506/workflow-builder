# Unit of Work Story Map — Host palette inputs (Syncfusion-style)

**Grouping**: Plan Q1=A — all stories in U-HPI-01

---

## Story → Unit

| Story | Title | Unit | Notes |
|---|---|---|---|
| US-HPI-01 | Solution `[palettes]` omit / `[]` / items | **U-HPI-01** | Unbound = U-PAL-02; `[]` = empty-remote; items = parent remote + featured/defaults |
| US-HPI-02 | `[defaultAgents]` on solution shell | **U-HPI-01** | Present (incl. `[]`) wins over JSON/provider |
| US-HPI-03 | Skills `[palettes]` | **U-HPI-01** | Same omit/`[]`/items on `wb-agent-skills-shell` |
| US-HPI-04 | Input wins over catalog provider | **U-HPI-01** | Present `[palettes]` skips adapter and Enso |
| US-HPI-05 | Drop unknown types | **U-HPI-01** | Catalog compose; no Stream node |
| US-HPI-06 | Embed docs | **U-HPI-01** | Template example; no tokens |

**FR coverage**

| FR | Unit |
|---|---|
| FR-HPI-01 Host tags | U-HPI-01 |
| FR-HPI-02 Precedence | U-HPI-01 |
| FR-HPI-03 Omit / `[]` / items | U-HPI-01 |
| FR-HPI-04 defaultAgents input | U-HPI-01 |
| FR-HPI-05 Unknown types | U-HPI-01 |
| FR-HPI-06 Docs | U-HPI-01 |
| NFR-HPI-01 Omit fail-open | U-HPI-01 |
| NFR-HPI-02 No secrets in docs | U-HPI-01 |
| NFR-HPI-03 Invalid shapes skipped | U-HPI-01 |
| NFR-HPI-04 PBT omit/`[]`/drop | U-HPI-01 |

---

## Coverage check

| Check | Status |
|---|---|
| All US-HPI-01..06 assigned | Yes |
| No story in a second unit | Yes (single unit) |
| Product boundary (Q5=A) | No Stream node; no wrapper; no skills `[defaultAgents]` |
| Code layout (Q6=A) | Overlay via sidebar `loadCatalog`; catalog stays root |

---

## Persona emphasis

| Unit | Primary persona |
|---|---|
| U-HPI-01 | P-HOST (+ P-AUTHOR for library contents / empty-state) |
