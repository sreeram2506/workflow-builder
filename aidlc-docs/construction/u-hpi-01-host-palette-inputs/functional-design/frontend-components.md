# Frontend Components — U-HPI-01 Host palette inputs

---

## Hierarchy

```text
Host parent template
  wb-shell-layout
    [palettes]
    [defaultAgents]
    wb-left-sidebar  (pass-through overlay)
  wb-agent-skills-shell
    [palettes]
    wb-left-sidebar  (pass-through palettes)
```

Library body UI stays U-PAL-02 (banner, loading, `palette-empty-remote`, featured strip, default-agent strip, lists).

---

## ShellLayoutComponent

| Item | Detail |
|---|---|
| `palettes` | `input<PaletteItem[] \| undefined>()` — no default |
| `defaultAgents` | `input<DefaultAgentCard[] \| undefined>()` — no default |
| Template | Pass both into `wb-left-sidebar` |

## AgentSkillsShellComponent

| Item | Detail |
|---|---|
| `palettes` | `input<PaletteItem[] \| undefined>()` — no default |
| Template | Pass into `wb-left-sidebar` |
| `defaultAgents` | **Not** added |

## LeftSidebarComponent

| Item | Detail |
|---|---|
| `palettes` | Same input; forward to `loadCatalog` when `!== undefined` |
| `defaultAgents` | Solution scope only |
| Reload | Overlay input changes **and** `features().palette` (Q4=A) |
| Render | Unchanged U-PAL-02; empty-remote testid stays `palette-empty-remote` |

Do not re-validate `NodeType` in the sidebar.

## EnsoTaskCatalogService

- If `hostPalettes` present: skip adapter/Enso; EMPTY vs OK per BR-HPI-05/06; `source: 'host'`.
- Host defaultAgents overlay per BR-HPI-08.
- Sanitize before compose.

## Docs (US-HPI-06)

| Artifact | Action |
|---|---|
| `docs/workflow-builder-ui-embed.md` | Parent template `[palettes]` / `[defaultAgents]`; omit vs `[]` vs items; input wins over `catalog` provider; known types only; no tokens |

---

## Tests (CG)

- Omit `[palettes]` → Enso or provider adapter still used.
- `[palettes]="[]"` → `emptyRemote`, `source: 'host'`, empty-state testid, no featured/defaults.
- Present items (e.g. AIAgent labeled Stream) → no Enso; featured + defaults + card.
- Present palettes wins over catalog provider token.
- Unknown `type: 'Stream'` dropped; valid sibling remains.
- All-unknown non-empty array → not empty-remote; featured/defaults remain.
- `[defaultAgents]` present wins over JSON; omitted uses JSON.
- `[palettes]="[]"` + `[defaultAgents]` → empty-state only.
- Skills shell `[palettes]` same omit/`[]`/items.
- PBT: sanitize never emits unknown types or items missing key/type/label.
- Existing chrome / U-PAL tests stay green.
