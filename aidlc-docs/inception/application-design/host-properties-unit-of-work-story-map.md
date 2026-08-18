# Unit of Work Story Map — Generic host-driven Properties

**Grouping**: Plan Q1=A — all stories in U-HP-01

---

## Story → Unit

| Story | Title | Unit | Notes |
|---|---|---|---|
| US-HP-01 | Schema copy, render, Save to path | **U-HP-01** | View disables; skip invalid |
| US-HP-02 | Supply order; General only; no Ignore Keys | **U-HP-01** | Adapter + logic built-ins |
| US-HP-03 | Opaque blobs not flattened; unknown widget safe | **U-HP-01** | Disabled text for unknown `ui_component` |
| US-HP-04 | Embed docs: schema + properties adapter | **U-HP-01** | No Enso names in public API |

**FR coverage**

| FR | Unit |
|---|---|
| FR-HP-01 Generic schema types | U-HP-01 |
| FR-HP-02 Resolve schema (first win) | U-HP-01 |
| FR-HP-03 Palette and factory copy | U-HP-01 |
| FR-HP-04 Render and save | U-HP-01 |
| FR-HP-05 Logic built-in fallback | U-HP-01 |
| FR-HP-06 General only when no schema | U-HP-01 |
| FR-HP-07 Unknown widget safe | U-HP-01 |
| FR-HP-08 Stop flatten path | U-HP-01 |
| FR-HP-09 Invalid schema fields | U-HP-01 |
| FR-HP-10 Docs | U-HP-01 |
| NFR-HP-01 Security | U-HP-01 |
| NFR-HP-02 Resiliency | U-HP-01 |
| NFR-HP-03 PBT Partial | U-HP-01 |

---

## Coverage check

| Check | Status |
|---|---|
| All US-HP-01..04 assigned | Yes |
| No story in a second unit | Yes (single unit) |
| Construction stages (Q2=A) | FD → CG → Build/Test; NFR/Infra skipped |
| Code layout (Q3=A) | Change in place; no `core/properties/` folder |
| Ownership (Q4=A) | Same stream |

---

## Persona emphasis

| Unit | Primary persona |
|---|---|
| U-HP-01 | P-HOST (+ P-AUTHOR sees schema form or General only; P-REVIEWER sees view-disabled) |
