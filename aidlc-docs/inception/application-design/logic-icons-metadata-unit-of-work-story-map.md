# Unit of Work Story Map — Host logic extras + agent metadata

**Grouping**: Plan Q1=A — all stories in U-LIM-01

---

## Story → Unit

| Story | Title | Unit | Notes |
|---|---|---|---|
| US-LIM-01 | Extra logic cards; featured strip replace | **U-LIM-01** | Omit keeps static three; present replaces |
| US-LIM-02 | Library icons, allowlist, fallback | **U-LIM-01** | URL wins; canvas unchanged |
| US-LIM-03 | Metadata + taskMeta on drop | **U-LIM-01** | No Properties editor |
| US-LIM-04 | Embed docs + try samples | **U-LIM-01** | No secrets |

**FR coverage**

| FR | Unit |
|---|---|
| FR-LIM-01 Extra logic cards | U-LIM-01 |
| FR-LIM-02 Featured strip replace | U-LIM-01 |
| FR-LIM-03 Icon fields | U-LIM-01 |
| FR-LIM-04 Library-only icons | U-LIM-01 |
| FR-LIM-05 URL sanitization | U-LIM-01 |
| FR-LIM-06 Icon fallback | U-LIM-01 |
| FR-LIM-07 Metadata on cards | U-LIM-01 |
| FR-LIM-08 Metadata on drop | U-LIM-01 |
| FR-LIM-09 Sanitizers preserve extras | U-LIM-01 |
| FR-LIM-10 Docs | U-LIM-01 |
| NFR-LIM-02..04 Allowlist / fail-safe / PBT | U-LIM-01 |

---

## Coverage check

| Check | Status |
|---|---|
| All US-LIM-01..04 assigned | Yes |
| No story in a second unit | Yes (single unit) |
| Construction stages (Q2=A) | FD → CG → Build/Test; NFR/Infra skipped |
| Code layout (Q3=A) | `icon-url.ts` + extend existing files |
| Ownership (Q4=A) | Same stream |

---

## Persona emphasis

| Unit | Primary persona |
|---|---|
| U-LIM-01 | P-HOST (+ P-AUTHOR sees strip / icons / dropped `data.metadata`) |
