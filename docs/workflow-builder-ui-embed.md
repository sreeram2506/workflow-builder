# Embed Workflow Builder UI config

Host apps and the SPA can control chrome via `provideWorkflowBuilderUi` and/or `/assets/wb-ui-config.json`.

## Provider API

```typescript
import { provideWorkflowBuilderUi, uiConfigAppInitializer } from './core/ui-config';
import { provideAppInitializer } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideWorkflowBuilderUi({
      features: {
        agentsLibrary: { enabled: false },
        canvas: { save: false },
      },
    }),
    provideAppInitializer(uiConfigAppInitializer),
    // ...
  ],
};
```

`provideWorkflowBuilderUi({ features })` supplies a deep-partial overlay. Omit the provider to use defaults + JSON only.

## Merge order (precedence)

1. **Built-in defaults** — every leaf `true`
2. **JSON** — `GET /assets/wb-ui-config.json` (missing → status `missing`, keep defaults; invalid → `invalid`, keep defaults)
3. **Host provider** — `provideWorkflowBuilderUi({ features })` wins over JSON for the same keys
4. **Instance `[ui]`** — bound on `wb-shell-layout` / `wb-agent-skills-shell`; wins per leaf over provider/JSON. Does **not** rewrite global `UiConfigService` (other instances keep their own effective map).

Alias: legacy `topBar.save|export|import|run|reset` map to the matching `canvas.*` leaves (canonical `canvas.save` wins in the same layer). Theme is only `topBar.theme` — do not put a root `themeToggle` key in JSON (a leftover alias is still accepted if present, including on `[ui]`).

## Active JSON + examples

| Path | Role |
|---|---|
| `src/assets/wb-ui-config.json` | Runtime file (committed as `{}`) |
| `src/assets/examples/wb-ui-config.all-on.json` | All chrome leaves explicit `true` |
| `src/assets/examples/wb-ui-config.all-off.json` | All chrome leaves explicit `false` |
| `src/assets/examples/wb-ui-config.minimal-canvas.json` | Hide libraries / floating actions; keep canvas |
| `src/assets/examples/wb-ui-config.palette-host.json` | Solution allow-list + `defaultAgents`; skills allow-list |

Try steps: [workflow-builder-ui-config-try.md](./workflow-builder-ui-config-try.md).

## Flag table

| Path | Controls |
|---|---|
| `topBar.enabled` | Mount top bar chrome. When hidden and no agent tabs are open, Agents Library / Properties sit at the top of the stage (small inset). |
| `topBar.logo` | Brand mark |
| `topBar.title` | Folder + workflow name |
| `topBar.status` | Draft/saved pill |
| `topBar.theme` | Theme toggle |
| `topBar.editView` | Edit / View toggle |
| `agentTabs.enabled` | Agent tabs strip (independent of top bar). Clicking the same library agent focuses the existing node/tab instead of duplicating it. |
| `agentsLibrary.enabled` | Solution left library |
| `skillsLibrary.enabled` | Nested agent left library |
| `propertiesPanel.enabled` | Right properties panel |
| `canvas.enabled` | Canvas chrome master (zoom bar, minimap, floating actions). Grid, nodes, and edges always stay. |
| `canvas.zoomControls` | Zoom +/− and 100% only (not the rest of the bottom bar) |
| `canvas.layoutControls` | Vertical / Horizontal / Layered dropdown |
| `canvas.minimap` | Minimap |
| `canvas.floatingActions` | Save/Export/Import/Run/Reset cluster |
| `canvas.save` | Save button + ⌘/Ctrl+S (`topBar.save` still aliases) |
| `canvas.export` | Export button (`topBar.export` aliases) |
| `canvas.import` | Import button (`topBar.import` aliases) |
| `canvas.run` | Run / Stop (`topBar.run` aliases) |
| `canvas.reset` | Reset statuses (`topBar.reset` aliases) |
| `palette.solution.types` | Allow-list of node types on the solution Agents Library. Omit = all; `[]` = none. |
| `palette.solution.defaultAgents` | Replace Blank Agent with 1..N cards when the key is present. Omit = keep Blank Agent. |
| `palette.agent.types` | Allow-list of node types on the nested Skills Library. Omit = all; `[]` = none. |

Palette allow-lists are independent per canvas. `"Router"` is not a type key (use `"Decision"`). Unknown type strings are dropped.

## Catalog adapter (provider-only)

Hosts can replace Enso `pipeline/list` / `task/list` with an adapter per canvas. Adapters are **not** JSON — only `provideWorkflowBuilderUi({ catalog })`.

```typescript
provideWorkflowBuilderUi({
  features: {
    palette: {
      solution: { types: { mode: 'only', types: ['Condition', 'AIAgent'] } },
    },
  },
  catalog: {
    solution: {
      load: () => Promise.resolve({ items: hostAgents }),
    },
    // omit agent → Enso task/list for Skills Library
  },
});
```

Omit `catalog.solution` / `catalog.agent` to keep Enso for that canvas. One adapter per canvas.

| Remote outcome | Library |
|---|---|
| Success with 0 remote items | Empty-state only (`palette-empty-remote`). No featured strip, no default agents, no lists. Not an error banner. |
| Throw / HTTP error / invalid adapter / missing auth | Static filtered types + default agents, plus a non-blocking banner. No mock agents. Canvas stays usable. |
| Success with 1+ remote items | Static (filtered + default agents) plus remote rows (also filtered). |

Error copy never includes access tokens or the phrase “mock agents”.

## Parent template inputs (Syncfusion-style)

### Chrome — `[ui]`

```html
<wb-shell-layout
  [ui]="ui"
  [palettes]="palettes"
  [defaultAgents]="defaultAgents"
/>
```

```typescript
import type { UiFeaturesPartial } from './core/ui-config';

const ui: UiFeaturesPartial = {
  agentsLibrary: { enabled: true },
  topBar: { save: false },
  propertiesPanel: { enabled: false },
};
```

| Binding | Effect |
|---|---|
| Omit `[ui]` | No instance overlay — JSON/provider chrome only |
| `[ui]="{}"` | No leaf overrides |
| `[ui]="partial"` | Defined leaves win over global; omitted leaves keep lower layers |
| Nested `wb-agent-skills-shell [ui]` | Independent of the solution shell overlay (does not inherit parent `[ui]`) |

Changing the bound object updates chrome without a full page reload.

### Catalog — `[palettes]` / `[defaultAgents]`

Bind catalog cards on the host tags. These are **instance** inputs — they win over `provideWorkflowBuilderUi({ catalog })` when present.

```html
<wb-shell-layout
  [palettes]="palettes"
  [defaultAgents]="defaultAgents"
/>
```

```typescript
import type { PaletteItem } from './core/domain/palette.catalog';
import type { DefaultAgentCard } from './core/ui-config';

// Catalog card labeled Stream — type must be a known NodeType (e.g. AIAgent).
const palettes: PaletteItem[] = [
  {
    key: 'stream',
    type: 'AIAgent',
    label: 'Stream',
    description: 'Host-supplied agent',
    categoryId: 'agents',
  },
];

const defaultAgents: DefaultAgentCard[] = [
  { key: 'policy', label: 'Policy Agent', description: 'Default from parent' },
];
```

`wb-agent-skills-shell` accepts `[palettes]` only (no `[defaultAgents]`).

| Binding | Library |
|---|---|
| Omit `[palettes]` | Enso or `provideWorkflowBuilderUi({ catalog })` (U-PAL-02) |
| `[palettes]="[]"` | Empty-state only (`palette-empty-remote`). Featured and default agents hidden. |
| `[palettes]="items"` | Parent owns the remote list. Featured Condition / Router / Repeater and default agents stay. Enso and the catalog adapter are not called. |
| Omit `[defaultAgents]` | JSON / provider `palette.solution.defaultAgents` (Blank Agent if omitted there) |
| `[defaultAgents]="[]"` | No default-agent cards (unless `[palettes]="[]"`, which already hides them) |
| Unknown `type` (e.g. `"Stream"`) | Row dropped. Canvas cannot create unknown node types. |

Do not put access tokens in palette items or embed examples.

## Load status banner

When `loadStatus.kind` is `missing` or `invalid`, shells show a non-blocking banner (`data-testid="ui-config-banner"`) with the status message. Bootstrap errors remain a separate danger banner.

## Query at runtime

```typescript
inject(UiConfigService).is('agentsLibrary.enabled'); // global bootstrap layers only
inject(UiConfigService).features();
inject(UiConfigService).loadStatus();

// Under a shell, chrome consumers prefer UI_EFFECTIVE_FEATURES (global ⊕ [ui])
inject(UI_EFFECTIVE_FEATURES, { optional: true })?.is('agentsLibrary.enabled');
```
