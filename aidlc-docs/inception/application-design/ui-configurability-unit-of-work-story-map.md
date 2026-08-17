# Unit of Work Story Map — UI Configurability (v1)

**Grouping**: Plan Q1=A

---

## Story → Unit

| Story | Title | Unit | Notes |
|---|---|---|---|
| US-UI-01 | Provide UI feature config | **U-UI-01** | Merge, provider wins, soft-fail status |
| US-UI-07 | Defaults show full chrome | **U-UI-01** | Omitted keys → true (verified again in 02 chrome) |
| US-UI-02 | Top bar flags | **U-UI-02** | Actions + shortcuts; `agentTabs.enabled` independent |
| US-UI-03 | Agents Library | **U-UI-02** | |
| US-UI-04 | Skills Library | **U-UI-02** | Nested canvas still opens |
| US-UI-05 | Properties | **U-UI-02** | |
| US-UI-06 | Canvas / overlays / tabs / theme | **U-UI-02** | |
| US-UI-08 | View mode + flags | **U-UI-02** | |

**Non-story FR coverage**

| FR | Unit |
|---|---|
| FR-UI-09 Demo / SPA wiring | U-UI-02 (initializer exists in 01; example JSON in 02) |
| FR-UI-10 Embed API docs | U-UI-02 |

---

## Coverage check

| Check | Status |
|---|---|
| All US-UI-01..08 assigned | Yes |
| No story in both units as primary | Yes |
| US-UI-07 defaults testable in 01 without full chrome | Yes (service-level); 02 reconfirms visually |

---

## Persona emphasis

| Unit | Primary persona |
|---|---|
| U-UI-01 | P-HOST |
| U-UI-02 | P-HOST (+ P-AUTHOR / P-REVIEWER for visibility ACs) |
