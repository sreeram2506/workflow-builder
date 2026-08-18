# Unit of Work Story Map — Remove APIs and dummy data

**Grouping**: Plan Q1=A — all stories in U-RAD-01

---

## Story → Unit

| Story | Title | Unit | Notes |
|---|---|---|---|
| US-RAD-01 | No Enso HTTP; omit palettes is empty-remote | **U-RAD-01** | Adapter-when-omit kept; adapter failure unchanged |
| US-RAD-02 | Nested skills from agent-shell palettes; no MOCK_SKILLS | **U-RAD-01** | Convert nested library; do not mount new chrome |
| US-RAD-03 | Repeater Properties has no mock workflow catalog | **U-RAD-01** | Empty pickers |
| US-RAD-04 | Embed / README: no Enso proxy or credentials | **U-RAD-01** | Empty-when-omit documented |

**FR coverage**

| FR | Unit |
|---|---|
| FR-RAD-01 Remove Enso catalog HTTP | U-RAD-01 |
| FR-RAD-02 Omit palettes is empty-remote | U-RAD-01 |
| FR-RAD-03 Remove mock nested skills | U-RAD-01 |
| FR-RAD-04 Nested skills from palettes | U-RAD-01 |
| FR-RAD-05 Remove Repeater mock workflows | U-RAD-01 |
| FR-RAD-06 Docs | U-RAD-01 |
| NFR-RAD-01 Security (no credentials) | U-RAD-01 |
| NFR-RAD-02 Resiliency (empty-remote no-data path) | U-RAD-01 |
| NFR-RAD-03 PBT Partial (omit-without-adapter) | U-RAD-01 |

---

## Coverage check

| Check | Status |
|---|---|
| All US-RAD-01..04 assigned | Yes |
| No story in a second unit | Yes (single unit) |
| Construction stages (Q2=A) | FD → CG → Build/Test; NFR/Infra skipped |
| Code layout (Q3=A) | Change in place; no new catalog folder |
| Ownership (Q4=A) | Same stream |

---

## Persona emphasis

| Unit | Primary persona |
|---|---|
| U-RAD-01 | P-HOST (+ P-AUTHOR sees empty library, nested palettes, empty Repeater pickers) |
