# Components — Host palette inputs (Syncfusion-style)

**Additive to** U-PAL-01/02 catalogs. Does not replace chrome or JSON allow-lists.  
**Plan answers**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A  
**Unit**: U-HPI-01 (shells + catalog overlay + docs)

---

## Component catalog (new / extended)

| ID | Name | Layer | Role |
|---|---|---|---|
| C-HPI-SHELL | `ShellLayoutComponent` | features/shell | `input() palettes`, `input() defaultAgents` (no defaults). Passes overlay to left sidebar |
| C-HPI-SKILLS | `AgentSkillsShellComponent` | features/agent | `input() palettes` only. Passes overlay to left sidebar |
| C-HPI-LEFT | `LeftSidebarComponent` | features/shell | New optional inputs for host palettes / defaultAgents; forwards to `loadCatalog` |
| C-HPI-CAT | `EnsoTaskCatalogService` | core/data | If host palettes **present**, treat as remote list (wins over provider token and Enso). `[]` → empty-remote. Drop unknown types. Host defaultAgents present wins over JSON |
| C-HPI-DOCS | Embed markdown | docs | Parent template `[palettes]` / `[defaultAgents]` example |

Reuse (unchanged contracts): featured strip, empty-remote empty-state, allow-list filter, `resolveDefaultAgents`.

---

## Responsibilities

### C-HPI-SHELL / C-HPI-SKILLS (Q2=A)

- `palettes = input<PaletteItem[] | undefined>()` — unbound = omit.
- Solution also `defaultAgents = input<DefaultAgentCard[] | undefined>()`.
- Bind through to `wb-left-sidebar` so the catalog service (root) still sees the overlay on `loadCatalog` (Q1=A). Do **not** use component-level catalog tokens.

### C-HPI-LEFT (Q1=A)

- Accept the same optional inputs; include them in `loadCatalog` options.
- Reload when inputs change (same as palette feature reload).
- Do not re-drop unknown types (Q3=A). Keep empty-remote / featured / default-agent strip behavior from U-PAL-02.

### C-HPI-CAT (Q3=A, Q4=A)

- Host palettes **present** ⇒ remote = those items (filter unknown types / invalid shapes); skip Enso and skip provider adapter.
- Host palettes `[]` ⇒ empty-remote path.
- Host palettes omitted ⇒ U-PAL-02 (provider adapter or Enso).
- Host defaultAgents **present** (incl. `[]`) ⇒ `resolveDefaultAgents` uses that list; JSON/provider defaultAgents ignored for this load.
- Host defaultAgents omitted ⇒ U-PAL-01 merged `features().palette.solution.defaultAgents`.

### C-HPI-DOCS

- Template example; omit vs `[]` vs items; input wins over `provideWorkflowBuilderUi({ catalog })`; known `NodeType` only; no secrets.

---

## Locked input shape (v1)

```text
wb-shell-layout
  [palettes]        PaletteItem[] | undefined   omit / [] / items
  [defaultAgents]   DefaultAgentCard[] | undefined

wb-agent-skills-shell
  [palettes]        PaletteItem[] | undefined
```

`PaletteItem.type` must be an `ALLOWED_NODE_TYPES` value or the row is dropped.

---

## Out of scope

- New `Stream` canvas node
- `wb-workflow-builder` wrapper
- Changing catalog `providedIn: 'root'`
- Skills `[defaultAgents]`
- Appending parent items and Enso together
