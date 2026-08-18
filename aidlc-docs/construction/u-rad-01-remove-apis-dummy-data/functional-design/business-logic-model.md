# Business Logic Model — U-RAD-01 Remove APIs and dummy data

**Unit**: `u-rad-01-remove-apis-dummy-data`  
**Stories**: US-RAD-01..04  
**Locked FD**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A

Host `[palettes]` overlay (U-HPI) and featured replace when palettes are present (U-LIM) still apply. This unit **removes Enso catalog HTTP and dummy catalogs**, and makes **omit-without-adapter empty-remote**.

---

## Purpose

Stop calling Enso catalog APIs. When the host does not bind `[palettes]` and has not injected a catalog adapter, the library is empty-remote (same as `[]`). Nested Developed-skills lists sanitized palettes. Repeater Properties has no dummy workflow catalog.

---

## Core process

```text
1. loadCatalog({ mode, hostPalettes?, hostDefaultAgents? })
   a. hostPalettes defined
      -> existing host overlay ( [] or all-unknown => empty-remote; items => U-HPI/U-LIM )
      -> never HTTP, never adapter
   b. hostPalettes omitted AND adapter injected
      -> U-PAL-02 adapter
      -> adapter failure => errorLoad static fallback + banner (unchanged)
   c. hostPalettes omitted AND no adapter
      -> empty-remote (Q1=A): emptyRemote true, items [], categories [], error null, source empty
      -> do not compose PALETTE_ITEMS featured types
      -> do not HTTP
2. Left sidebar
   -> empty-remote hides featured strip and default agents (Q2=A)
   -> present non-empty palettes: U-LIM replace unchanged
3. Nested skills library (unmounted)
   -> palettes input -> sanitizeHostPaletteItems
   -> filter query on label, description, key (case-insensitive substring)
   -> Add -> addSkillFromPaletteItem
   -> omit / [] / no matches -> empty ul (Q7=A)
4. addSkillToAgent
   -> no findMockSkill; always false (Q5=A)
5. Repeater Properties
   -> workflow/version option lists []
   -> do not clear existing node repeater.workflowId / versionId (Q4=A)
```

---

## Transformations

| Step | Input | Output |
|---|---|---|
| Omit-without-adapter | `loadCatalog` without `hostPalettes`, no adapter | `PaletteCatalogLoad` empty-remote (`source: 'empty'`) |
| Host overlay | defined `hostPalettes` | existing U-HPI / U-LIM load |
| Adapter | omitted palettes + adapter | adapter rows or `errorLoad` static |
| Nested filter | palettes + query | subset of sanitized `PaletteItem` |
| Nested Add | palette item | `addSkillFromPaletteItem` skill ref |
| Repeater schema | Repeater type | `options: []` for workflow; version `[]` |

`source: 'enso'` is never emitted. Enso mapper HTTP helpers are deleted. `enso-task-form` stays for Properties.

---

## Testable Properties (PBT Partial)

| ID | Category | Property |
|---|---|---|
| P-RAD-01 | Invariant (PBT-03) | Omit-without-adapter `loadCatalog` never has `emptyRemote === false` |
| P-RAD-02 | Invariant | Omit-without-adapter `items` never include static featured keys `Condition` / `Decision` / `Repeater` from `PALETTE_ITEMS` |
| P-RAD-03 | Invariant | Omit-without-adapter `source` is never `'enso'` |

Compose/empty-omit has **no inverse** (PBT-02 N/A for the full domain). Generators: omit vs `[]` vs items vs adapter present (PBT-07). `fc.assert` + seed (PBT-08). fast-check (PBT-09).

Example (non-PBT) tests: nested filter; Repeater options empty; `addSkillToAgent` false without mocks; no HttpClient on catalog service.

---

## Persistence

No new workflow fields. Existing Repeater ids on nodes are left as-is (Q4=A). Nested Add still writes `agent.data.skills` via `addSkillRef`.
