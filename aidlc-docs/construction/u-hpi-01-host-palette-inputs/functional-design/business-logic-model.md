# Business Logic Model — U-HPI-01 Host palette inputs

**Unit**: `u-hpi-01-host-palette-inputs`  
**Stories**: US-HPI-01..06  
**Locked FD**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A · Q9=A

U-PAL-02 load paths still apply when `[palettes]` is omitted.

---

## Purpose

Let a parent bind `[palettes]` (and solution `[defaultAgents]`) on the host shells like Syncfusion SymbolPalette. Present overlay wins over Enso and `provideWorkflowBuilderUi({ catalog })`. Omit keeps Increment B.

---

## Core process: load with overlay

```text
1. Shells expose palettes / defaultAgents as input() with no default (Q8=A)
2. Left sidebar, if palettes() !== undefined, sets options.hostPalettes (including [])
   if defaultAgents() !== undefined (solution only), sets options.hostDefaultAgents
3. EnsoTaskCatalogService.loadCatalog(options):
   a. If hostPalettes key present:
        - [] → EMPTY path (Q7=A); skip Enso and provider adapter
        - non-empty → sanitize rows (Q6=A); skip Enso and adapter;
          OK-compose even if sanitized length is 0 (Q3=A)
        - source: 'host' (Q5=A)
   b. Else U-PAL-02 (adapter or Enso); then classify empty / ok / error
4. Default agents for compose:
   - EMPTY path: none (Q7=A)
   - else if hostDefaultAgents key present → resolveDefaultAgents({ mode: 'present', cards })
   - else JSON/provider U-PAL-01 state
5. Allow-list still filters static + remote
6. Reload when overlay inputs or features().palette change (Q4=A)
```

### EMPTY path (host `[]` only)

Same as U-PAL-02 empty-remote: `items = []`, `emptyRemote = true`, `error = null`, `source: 'host'`. No featured, no default agents.

Do **not** use EMPTY because sanitized host rows are empty after a **non-empty** input (Q3=A).

### OK path (host items present)

1. `sanitizeHostPaletteItems(hostPalettes)` → remote rows (unknown types / invalid shapes dropped).
2. Compose like U-PAL-02 OK: featured + `resolveDefaultAgents` (host list if present) + remote.
3. `emptyRemote = false`, `error = null`, `source: 'host'`.

### Omit palettes

U-PAL-02 classify. Host `defaultAgents` may still overlay JSON on that load.

---

## Transformations

| Step | Input | Output |
|---|---|---|
| Presence | Angular `input()` | Overlay keys only when not `undefined` |
| Sanitize palettes | unknown rows | Valid `PaletteItem[]` (Q6=A, Q9=A) |
| Sanitize defaultAgents | unknown cards | Valid `DefaultAgentCard[]` |
| Classify host | present `[]` vs present items | EMPTY vs OK |
| Compose | static + defaults + remote | `PaletteCatalogLoad` |
| Allow-list | `features().palette` | Filtered items |

---

## Persistence

None. Overlay is in-memory component input. JSON allow-lists / defaultAgents unchanged.

---

## Out of scope

- Stream `NodeType`
- Skills `[defaultAgents]`
- Component-scoped catalog tokens
- `wb-workflow-builder` wrapper

---

## Testable Properties (PBT-01)

| Component | Category | Property |
|---|---|---|
| `sanitizeHostPaletteItems` | PBT (Q9=A) | Output `type` always in `ALLOWED_NODE_TYPES`; every item has non-empty `key` / `type` / `label` |
| Overlay classify | Example | omit / `[]` / items; all-dropped still OK not empty-remote |
| Input vs provider | Example | present palettes → Enso and adapter not called |
| defaultAgents | Example | present wins over JSON; `[]` palettes hides defaults |

**PBT-02**: Helper is pure (no I/O). **PBT-05/06**: N/A. **PBT-07/08/09**: Keep generators small (arbitrary objects + known/unknown type strings).
