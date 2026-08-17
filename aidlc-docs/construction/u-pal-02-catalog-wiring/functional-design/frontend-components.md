# Frontend Components — U-PAL-02 Catalog wiring + docs

---

## Hierarchy

Unchanged shells. Library remains `wb-left-sidebar` (`agentsLibrary` / `skillsLibrary` chrome flags).

```text
wb-left-sidebar
  ├─ catalogError banner          @if error (ERROR path only)
  ├─ loading status
  ├─ empty-remote state           @if emptyRemote (Q3b=C) — sole body content
  └─ else:
       ├─ featured strip          filtered Condition/Decision/Repeater (Q6)
       ├─ default-agent strip     origin default-agent, 0..N, one CDK list (Q5, Q11)
       ├─ search
       └─ category / adapter lists
```

---

## LeftSidebarComponent

| Item | Detail |
|---|---|
| Reload | `effect` (or equivalent) on `features().palette` → `loadCatalog` (Q8=B) |
| `logicShapeItems()` | From `allItems()` only; no full-catalog fallback |
| `defaultAgentItems()` | `allItems()` where `origin === 'default-agent'` |
| `blankAgentItem()` | **Remove**; do not call `blankAgentPaletteItem()` |
| `solutionAgentItems()` | `AIAgent` rows **without** `origin === 'default-agent'` |
| Empty remote | Hide featured, defaults, search, lists; show empty-state copy |
| testids | `palette-empty-remote`; `default-agent-strip`; `default-agent-card-{key}`; keep `logic-shape-*` |

Empty-state copy (solution vs skills) is implementation detail; must be non-blocking and not imply a crash.

---

## EnsoTaskCatalogService

- Inject optional catalog tokens + `UiConfigService`.
- Classify ok / empty / error per business-logic-model.
- Compose with U-PAL-01 helpers on ok and error paths only.

---

## provideWorkflowBuilderUi

Extend options with `catalog.solution` / `catalog.agent` (Q2=A). Tests may provide tokens directly.

---

## Docs / examples (Q10=A)

| Artifact | Action |
|---|---|
| `docs/workflow-builder-ui-embed.md` | Palette allow-lists, `defaultAgents`, `catalog` provider-only, empty vs error |
| `docs/workflow-builder-ui-config-try.md` | How to try example JSON |
| `src/assets/examples/` | New or extended JSON with `palette.solution.types` + `defaultAgents` |
| `src/assets/wb-ui-config.json` | Stay `{}` |
| `README.md` | Pointer if not already |

---

## Tests (CG)

- Adapter token present → Enso HTTP not called (HttpTestingController).
- Empty remote → `emptyRemote` true, no error, sidebar empty-state testid, no logic-shape / default-agent cards.
- HTTP/adapter error → static items + banner, no mock agent keys (Claims Intake / etc.).
- Allow-list hides featured types; default agents tagged and listed in strip only.
- Palette feature change retriggers load.
- Existing chrome tests still green.
