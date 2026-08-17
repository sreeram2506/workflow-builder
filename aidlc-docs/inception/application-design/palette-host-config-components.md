# Components — Palette / catalog host config (v1)

**Additive to** UI Configurability catalogs. Does not replace chrome-flag docs.  
**Plan answers**: Q1=A · Q2=C · Q3=A · Q4=A · Q5=A  
**Units**: U-PAL-01 (config + filter + defaultAgents) → U-PAL-02 (adapter, catalog, sidebar, docs)

---

## Component catalog (new / extended)

| ID | Name | Layer | Role |
|---|---|---|---|
| C-PAL-CFG | `UiConfigService` + `UiFeatures.palette` | core/ui-config | Own `palette.solution.types`, `palette.agent.types`, `palette.solution.defaultAgents` on the same resolved tree as chrome |
| C-PAL-MERGE | `merge-ui-features` (extend) | core/ui-config | Deep-merge chrome as today; palette arrays use **omit vs present vs `[]`** (not boolean default-true) |
| C-PAL-PROV | `provideWorkflowBuilderUi` (extend) | core/ui-config | Host `features.palette` plus optional `catalog.solution` / `catalog.agent` that set injection tokens |
| C-PAL-TOK | Catalog injection tokens | core/ui-config | Optional tokens for tests and provider helper; omit ⇒ Enso default |
| C-PAL-FILTER | Allow-list + defaultAgents helpers | core/domain or ui-config | Pure `filterPaletteItemsByAllowList`; pure `resolveDefaultAgents` → `PaletteItem[]` (`type: AIAgent`) |
| C-PAL-ADAPT | `WorkflowBuilderCatalogAdapter` | core/ui-config contract | Host-supplied load for one canvas; replaces Enso HTTP for that canvas only |
| C-PAL-CAT | `EnsoTaskCatalogService` (extend) | core/data | Default Enso adapter; if token present, call host adapter instead; apply filter + defaultAgents **before** emit; no `MOCK_SOLUTION_AGENTS` |
| C-PAL-LEFT | `LeftSidebarComponent` (extend) | features/shell | Featured strip + 0..N default-agent cards + category lists from **already-filtered** catalog |
| C-PAL-SHELL | Shell / agent shells | features/shell, features/agent | Unchanged chrome master switch (`agentsLibrary` / `skillsLibrary`); both canvases reuse `LeftSidebarComponent` |
| C-PAL-DOCS | Embed / try markdown + example JSON | docs / assets | Allow-lists, `defaultAgents`, provider-only adapters; no secrets |

Unused `NestedSkillsLibraryComponent` is **not** a v1 consumer; Skills Library is `LeftSidebarComponent` with `mode: agent-skills`.

---

## Responsibilities

### C-PAL-CFG / C-PAL-MERGE / C-PAL-PROV (Q1=A, Q2=C)

- Palette config lives on **`UiFeatures.palette`**, loaded by the existing APP_INITIALIZER + JSON + provider merge.
- Serializable JSON: allow-lists and `defaultAgents` only. **No** adapter functions, URLs-as-secrets, or tokens in JSON.
- `provideWorkflowBuilderUi({ features, catalog })`:
  - `features` continues to overlay chrome + palette (wins).
  - `catalog.solution` / `catalog.agent` register optional tokens (hosts use the helper; tests may provide tokens directly).
- Omitted `palette.solution.types` / `palette.agent.types` ⇒ show-all for that canvas (NFR-PAL-01).
- Present array (including `[]`) ⇒ only those type keys (built-in **and** adapter rows).

### C-PAL-FILTER (Q3=A, Q5=A)

- **Allow-list**: pure helper. When the list is present, every output item’s `type` is in the list (including empty list ⇒ empty output). When omitted, pass through.
- **defaultAgents**: pure helper builds `PaletteItem[]` with `type: 'AIAgent'`.  
  - Key omitted ⇒ built-in Blank Agent item (if `AIAgent` allowed).  
  - `[]` ⇒ no static default cards.  
  - Non-empty ⇒ those cards **replace** Blank Agent.  
  - If allow-list is present and omits `AIAgent` ⇒ **no** default-agent rows.
- Skills canvas has **no** `defaultAgents` in v1.

### C-PAL-CAT / C-PAL-ADAPT

- At most **one** adapter per canvas. Host may compose extra HTTP **inside** its adapter.
- Omit token ⇒ current Enso calls (`pipeline/list` solution, `task/list` skills).
- On failure or empty remote list: emit **static defaults only** (filtered + resolved defaultAgents). **Do not** append `MOCK_SOLUTION_AGENTS`. Set non-blocking `error` string. Canvas remains usable.
- Do not log Authorization headers or access tokens.

### C-PAL-LEFT

- Consume `PaletteCatalogLoad.items` as already filtered (do **not** re-filter by allow-list).
- Featured strip = Condition / Router (`Decision`) / Repeater **that remain in the filtered list**, in that order.
- Default agents: render **0..N** cards from catalog items (`type === AIAgent` static defaults), not a hard-coded single Blank Agent fallback that bypasses the allow-list.
- Search still uses existing `filterPaletteItems` (text query), not the type allow-list.

---

## Locked config shape (v1)

```text
palette.solution.types          optional string[]  (omit = all; [] = none)
palette.agent.types             optional string[]  (omit = all; [] = none)
palette.solution.defaultAgents  optional { key, label, description }[]
catalog.solution | catalog.agent  provider-only adapters (not JSON)
```

**Type keys**: `Condition`, `Decision` (Router), `Repeater`, `AIAgent`, plus `Trigger`, `Action`, `Delay`, `End`, `Notification`.

Exact TypeScript (`AllowListState` omit vs present) lands in Functional Design. Chrome flags remain the library **mount** switch.

---

## Out of scope (components)

- Publishable ng library packaging
- Skills-side `defaultAgents`
- Multiple parallel adapters per canvas
- In-app UI to edit palette JSON
- Using unused `NestedSkillsLibraryComponent`
