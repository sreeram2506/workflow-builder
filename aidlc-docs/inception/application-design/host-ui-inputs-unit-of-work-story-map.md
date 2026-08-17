# Unit of Work Story Map — Host UI chrome inputs (`[ui]`)

**Grouping**: Plan Q1=A — all stories in U-HUI-01

---

## Story → Unit

| Story | Title | Unit | Notes |
|---|---|---|---|
| US-HUI-01 | Bind `[ui]` + precedence + isolation | **U-HUI-01** | Partial wins leaves; no global mutation across instances |
| US-HUI-02 | Omit / `{}` keeps DI/JSON | **U-HUI-01** | Unbound = no overlay; `{}` = no leaf overrides |
| US-HUI-03 | Reactive `[ui]` updates | **U-HUI-01** | Computed effective + child inject; no full reload |
| US-HUI-04 | Both shells + docs | **U-HUI-01** | `wb-shell-layout` + `wb-agent-skills-shell`; embed + README |

**FR coverage**

| FR | Unit |
|---|---|
| FR-HUI-01 Component input | U-HUI-01 |
| FR-HUI-02 Precedence | U-HUI-01 |
| FR-HUI-03 Flag scope (full partial) | U-HUI-01 |
| FR-HUI-04 Reactive updates | U-HUI-01 |
| FR-HUI-05 Isolation | U-HUI-01 |
| FR-HUI-06 Existing chrome gates use effective | U-HUI-01 |
| FR-HUI-07 Docs | U-HUI-01 |
| NFR-HUI-01 PBT instance merge | U-HUI-01 |

---

## Coverage check

| Check | Status |
|---|---|
| All US-HUI-01..04 assigned | Yes |
| No story in a second unit | Yes (single unit) |
| Construction stages (Q2=A) | FD → CG → Build/Test; NFR/Infra skipped |
| Code layout (Q3=A) | Extend `core/ui-config/` + shells + chrome consumers + docs |

---

## Persona emphasis

| Unit | Primary persona |
|---|---|
| U-HUI-01 | P-HOST (+ P-AUTHOR / P-REVIEWER see chrome outcomes) |
