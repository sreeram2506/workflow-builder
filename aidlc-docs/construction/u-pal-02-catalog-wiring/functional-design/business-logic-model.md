# Business Logic Model — U-PAL-02 Catalog wiring + docs

**Unit**: `u-pal-02-catalog-wiring`  
**Stories**: US-PAL-05, US-PAL-06, US-PAL-07  
**Locked FD**: Q1=A · Q2=A · Q3=X/3b=C · Q4=A · Q5=A · Q6=A · Q7=A · Q8=B · Q9=A · Q10=A · Q11=A

---

## Purpose

Wire host catalog adapters (or Enso default), apply U-PAL-01 filter/`defaultAgents` helpers, drop mock agents, render the filtered library (featured strip, 0..N default-agent cards), and document the host API.

---

## Core process: load palette catalog

```text
1. LeftSidebar (or catalog) reads UiConfigService.features().palette for current canvas
2. If catalog token for mode exists → adapter.load(options)
   else → Enso HTTP (pipeline/list or task/list)
3. Classify outcome:
   a. Throw / HTTP error / invalid adapter shape  → ERROR path (Q9=A)
   b. HTTP 200 (or adapter success) with 0 remote items → EMPTY path (Q3b=C)
   c. One or more remote items → OK path
4. Emit PaletteCatalogLoad
5. Sidebar renders; reload when features().palette changes (Q8=B)
```

### ERROR path (Q9=A)

1. Build static items: solution = featured types + `resolveDefaultAgents`; skills = `PALETTE_ITEMS`.
2. `filterPaletteItemsByAllowList` + `applySolutionDefaultAgents` (solution).
3. Tag default-agent rows `origin: 'default-agent'` (Q5=A).
4. `error` = user-safe string (no tokens, no “mock agents”).
5. `source: 'static'`. Canvas not blocked.

### EMPTY path (Q3b=C)

1. `items = []`, `categories = []`.
2. `error = null` (not a failure banner).
3. `emptyRemote = true` (or `source: 'empty'`).
4. Sidebar shows **only** an empty-state in the library body. No featured strip, no default agents, no adapter list.

### OK path

1. Map adapter/Enso rows to `PaletteItem[]` (+ optional categories).
2. Compose: static (filtered + tagged defaults) **plus** remote rows, then filter remote by allow-list.
3. `error = null`, `emptyRemote = false`.

Do **not** append `MOCK_SOLUTION_AGENTS` on any path (Q7=A).

---

## Transformations

| Step | Input | Output |
|---|---|---|
| Adapter or Enso | `CatalogLoadOptions` | Remote `{ items, categories? }` (Q1=A) |
| Classify | remote length + errors | `ok` / `empty-remote` / `error` |
| U-PAL-01 helpers | `features().palette` + static catalog | Filtered static + default agents |
| Tag origin | default-agent `PaletteItem`s | `origin: 'default-agent'` |
| Filter remote | remote items + allow-list | Remote rows whose `type` is allowed |

---

## Adapter contract (Q2=A)

```text
WorkflowBuilderCatalogAdapter.load(options)
  → Observable or Promise of { items: PaletteItem[]; categories?: PaletteCategory[] }
```

Optional tokens: `WORKFLOW_BUILDER_CATALOG_SOLUTION`, `WORKFLOW_BUILDER_CATALOG_AGENT`.  
`provideWorkflowBuilderUi({ catalog: { solution?, agent? } })` sets them. Omit = Enso for that canvas. One adapter per canvas.

---

## Persistence

- JSON: existing `wb-ui-config.json` (palette serializable fields only). Active file stays `{}` (Q10=A).
- Adapters are **provider-only**.

---

## Out of scope

- Skills-side `defaultAgents`
- Multiple adapters per canvas
- Publishable ng library

---

## Testable Properties (PBT-01)

| Component | Category | Property |
|---|---|---|
| `EnsoTaskCatalogService` compose | No PBT | I/O + DI orchestration; uses U-PAL-01 helpers already covered |
| Origin tagging | Easy verification | Unit example: tagged items have `origin === 'default-agent'` (table test; not a generator suite) |
| Adapter / HTTP | N/A | Side effects; Q9 error mapping is example-based |

**PBT-02/03/07/08/09**: No new blocking PBT in this unit; U-PAL-01 helpers remain the PBT surface. **PBT-05/06**: N/A.
