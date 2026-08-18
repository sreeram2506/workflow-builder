# Services — Remove APIs and dummy data

---

## Service / module catalog

| ID | Name | Kind | Responsibility |
|---|---|---|---|
| S-RAD-CAT | `EnsoTaskCatalogService` | injectable root | Catalog source: host overlay, adapter, or empty-remote. No Enso HTTP. |
| S-RAD-UIHTTP | `UiConfigService` | injectable root | Unchanged JSON fetch via HttpClient (Q5=A) |
| S-RAD-HOST | `palette-host.helpers` | pure | Unchanged sanitizers / `featuredLogicItems` |
| S-RAD-NEST | `NestedSkillsLibraryComponent` | UI | Palettes overlay list; Add via facade |
| S-RAD-FAC | `WorkflowFacade` | injectable | Skill refs without MOCK_SKILLS |
| S-RAD-REP | Right-sidebar + properties schema | UI / domain | Empty Repeater pickers |
| S-RAD-DOCS | Embed / README | documentation | Empty-when-omit; no secrets |

No new Angular service (Q5=A).

---

## Orchestration

### Catalog load (after this increment)

```text
LeftSidebar loadCatalog({ mode, hostPalettes?, hostDefaultAgents? })
    -> EnsoTaskCatalogService
        -> if hostPalettes defined:
              [] or all-unknown => empty-remote
              items => host overlay (U-HPI / U-LIM); skip adapter
        -> else if catalog adapter injected:
              adapter rows (U-PAL-02)
              adapter failure => static fallback + banner (Q2=A)
        -> else:
              empty-remote (no HTTP, no static featured compose)
    -> sidebar renders empty-remote or overlay as today
```

Text alternative: Parent palettes still win when bound. If palettes are omitted, a catalog adapter may load rows. If palettes are omitted and there is no adapter, the library is empty-remote. Enso HTTP is gone. Adapter failure still shows static defaults and a banner.

### Nested Developed-skills list (unmounted)

```text
Host [palettes] (optional compose)
    -> wb-nested-skills-library [palettes]
    -> sanitizeHostPaletteItems
    -> filter by search
    -> Add -> addSkillFromPaletteItem
```

Text alternative: The converted nested library lists sanitized palettes and adds via the existing facade helper. The agent shell does not mount this region; authors see nested skills in the left sidebar.

### Repeater pickers

```text
Select Repeater node
    -> properties schema options []
    -> right-sidebar workflow/version selects empty
```

---

## Non-goals

- PaletteCatalogService rename
- EmptyRemoteCatalogService
- Removing HttpClient from the app
- New Repeater workflow API
