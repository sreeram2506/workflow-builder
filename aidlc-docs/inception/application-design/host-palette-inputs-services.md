# Services — Host palette inputs (Syncfusion-style)

---

## Service / module catalog

| ID | Name | Kind | Responsibility |
|---|---|---|---|
| S-HPI-SHELL | `ShellLayoutComponent` | UI | Host `[palettes]` / `[defaultAgents]` |
| S-HPI-SKILLS | `AgentSkillsShellComponent` | UI | Host `[palettes]` |
| S-HPI-LEFT | `LeftSidebarComponent` | UI | Pass overlay into catalog load |
| S-HPI-CAT | `EnsoTaskCatalogService` | injectable root | Overlay wins over provider/Enso; empty-remote for `[]`; drop unknown types |
| S-HPI-FILTER | U-PAL-01 helpers | pure | Allow-list + `resolveDefaultAgents` (host list when present) |
| S-HPI-DOCS | Embed markdown | documentation | Template API |

No new Angular root service. Catalog stays `providedIn: 'root'` (Q1=A).

---

## Orchestration

### Catalog load with host overlay

```text
Parent template [palettes] / [defaultAgents]
    -> Shell
    -> LeftSidebar loadCatalog({ mode, hostPalettes?, hostDefaultAgents? })
    -> EnsoTaskCatalogService
        -> if hostPalettes defined:
              [] => empty-remote
              items => remote = dropUnknown(items); skip Enso and provider adapter
        -> else: U-PAL-02 (provider adapter or Enso)
        -> defaultAgents: hostDefaultAgents defined => resolveDefaultAgents(that)
                         else features().palette.solution.defaultAgents
        -> allow-list filter (ok path)
        -> emit PaletteCatalogLoad
    -> sidebar renders (unchanged U-PAL-02 UI)
```

Text alternative: The parent binds inputs on the shell. The sidebar forwards them on `loadCatalog`. If palettes is defined, that list is the remote catalog (empty array = empty-state). Otherwise Enso or the bootstrap catalog adapter runs. Present defaultAgents replace JSON. Allow-list still applies. The sidebar UI is unchanged.

### Precedence (remote catalog)

1. Enso default  
2. `provideWorkflowBuilderUi({ catalog })`  
3. Component `[palettes]` if present — **wins**

### Precedence (default agents)

1. Omitted JSON/provider → Blank Agent  
2. JSON / provider `defaultAgents`  
3. Component `[defaultAgents]` if present — **wins**

---

## Non-goals

- Component-scoped catalog tokens
- HostPaletteInputService
- Skills defaultAgents input
