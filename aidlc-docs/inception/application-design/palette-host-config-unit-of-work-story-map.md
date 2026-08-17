# Unit of Work Story Map — Palette / catalog host config (v1)

**Grouping**: Plan Q1=A

---

## Story → Unit

| Story | Title | Unit | Notes |
|---|---|---|---|
| US-PAL-01 | Provide palette and catalog config | **U-PAL-01** | Merge layers; provider wins; no secrets in JSON |
| US-PAL-02 | Solution allow-list | **U-PAL-01** | Helper + merge; visual strip confirmed in U-PAL-02 |
| US-PAL-03 | Skills allow-list | **U-PAL-01** | Independent `palette.agent.types`; visual in 02 |
| US-PAL-04 | defaultAgents replace Blank Agent | **U-PAL-01** | `resolveDefaultAgents`; 0..N cards rendered in 02 |
| US-PAL-05 | Catalog adapter replaces Enso | **U-PAL-02** | Tokens + provider `catalog` |
| US-PAL-06 | List failure, no mocks | **U-PAL-02** | Drop `MOCK_SOLUTION_AGENTS`; banner |
| US-PAL-07 | Embed docs and example JSON | **U-PAL-02** | Provider-only adapters |

**FR coverage**

| FR | Unit |
|---|---|
| FR-PAL-01 Config layers | U-PAL-01 |
| FR-PAL-02 Allow-list | U-PAL-01 (logic); U-PAL-02 (sidebar uses filtered catalog) |
| FR-PAL-03 defaultAgents | U-PAL-01 (logic); U-PAL-02 (render) |
| FR-PAL-04 Catalog adapter | U-PAL-02 |
| FR-PAL-05 Failure / empty | U-PAL-02 |
| FR-PAL-06 Featured strip | U-PAL-02 (uses 01 filter) |
| FR-PAL-07 Docs | U-PAL-02 |
| NFR-PAL-04 / NFR-PAL-05 PBT | U-PAL-01 |

---

## Coverage check

| Check | Status |
|---|---|
| All US-PAL-01..07 assigned | Yes |
| No story in both units as primary | Yes |
| US-PAL-02..04 testable in 01 without sidebar | Yes (pure helpers + merge); 02 reconfirms in UI |
| Product boundary (Q5=A) | No skills `defaultAgents`; no ng library |

---

## Persona emphasis

| Unit | Primary persona |
|---|---|
| U-PAL-01 | P-HOST |
| U-PAL-02 | P-HOST (+ P-AUTHOR for library contents / failure AC) |
