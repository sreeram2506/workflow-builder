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
| `agentTabs.enabled` | Agent tabs **strip** (independent of top bar). Hides chips only — it does **not** block `/agent/:id`. Double-click a Blank Agent / AIAgent on the **solution** canvas still enters. When the strip is not mounted, the nested shell shows a **Solution** Back control. Clicking the same library agent still focuses the existing node instead of duplicating it (when the strip is on). |
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

### Nested agent enter / exit

`agentTabs.enabled` is tab-strip chrome. It does not gate `/agent/:id`.

- **Enter:** double-click a Blank Agent / AIAgent on the solution canvas, or click a chip when the strip is on.
- **Exit without the strip:** nested shell **Solution** control (`navigateBackToSolution`). It does not require open chips.
- Nested canvas double-click does not enter another agent. View mode still enters; nested graph edits stay blocked.

Do not put secrets in UI config, palette items, or embed examples.

## Catalog adapter (provider-only)

Hosts can inject a catalog adapter per canvas. Adapters are **not** JSON — only `provideWorkflowBuilderUi({ catalog })`. This SPA does **not** call Enso `pipeline/list` / `task/list`.

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
    // omit agent → empty-remote for Skills Library unless that canvas binds [palettes]
  },
});
```

Omit `catalog.solution` / `catalog.agent` and omit `[palettes]` → empty-remote for that canvas. One adapter per canvas.

| Remote outcome | Library |
|---|---|
| Success with 0 remote items | Empty-state only (`palette-empty-remote`). No featured strip, no default agents, no lists. Not an error banner. |
| Throw / HTTP error / invalid adapter / missing auth | Static filtered types + default agents, plus a non-blocking banner. No mock agents. Canvas stays usable. |
| Success with 1+ remote items | Static (filtered + default agents) plus remote rows (also filtered). |

Error copy never includes access tokens or the phrase “mock agents”.

## Properties schema (provider + palette)

Hosts configure dropped-node Properties with a generic schema. This package only renders and writes `node.data`. It does not know host-specific config layouts.

First-win order:

1. **`node.data.propertiesSchema`** — a plain object (including `{}`) copied from the palette item on drop. `{}` still wins; it is not a fall-through to built-ins.
2. **`provideWorkflowBuilderUi({ properties: { schemaFor } })`** — sync adapter. Throw or a non-object return is treated as no adapter.
3. **Built-ins** — Condition expression, Repeater workflow/version/pause (empty option lists), Decision empty.
4. **Else** — General only (label, subtitle, status).

There is no instance `[properties]` input.

```typescript
provideWorkflowBuilderUi({
  properties: {
    schemaFor: (node) => {
      const fromHost = hostSchemaFor(node);
      return fromHost ?? null;
    },
  },
});
```

```typescript
const palettes: PaletteItem[] = [
  {
    key: 'timeout-action',
    type: 'Action',
    label: 'Timeout Action',
    description: 'Host-supplied action',
    categoryId: 'flow',
    taskMeta: { taskId: 't-1' },
    propertiesSchema: {
      sections: [
        {
          title: 'Limits',
          fields: [
            { type: 'number', path: 'timeout', label: 'Timeout', required: true },
            { type: 'text', path: 'taskMeta.note', label: 'Note' },
          ],
        },
      ],
    },
  },
];
```

Field `path` is relative to `node.data` (hosts may use `taskMeta.foo`). Built-in field types: `text`, `number`, `boolean`, `select`, `multiselect`, `textarea`. Unknown `ui_component` values render as disabled text — this package does not load host widgets.

Optional `taskMeta` on a palette item is copied onto `node.data.taskMeta` as an opaque blob. Properties does not walk it into fields.

Do not put access tokens in `propertiesSchema`, `taskMeta`, `metadata`, or embed examples.

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

const palettes: PaletteItem[] = [
  {
    key: 'stream',
    type: 'AIAgent',
    label: 'Stream',
    description: 'Host-supplied agent',
    categoryId: 'agents',
    iconUrl: 'https://cdn.example/stream.png',
    metadata: { owner: 'platform' },
  },
  {
    key: 'extra-if',
    type: 'Condition',
    label: 'Extra If',
    description: 'Second condition card',
    categoryId: 'logic',
    iconPath: 'M12 2 L2 22 h20 z',
    metadata: { kind: 'extra-condition' },
  },
];

const defaultAgents: DefaultAgentCard[] = [
  {
    key: 'policy',
    label: 'Policy Agent',
    description: 'Default from parent',
    iconUrl: '/assets/policy.png',
    metadata: { team: 'ops' },
  },
];
```

`wb-agent-skills-shell` accepts `[palettes]` only (no `[defaultAgents]`).

Optional library fields on palette items and default-agent cards:

- `iconUrl` — `https:`, `/…`, `./…`, or raster `data:image/png|jpeg|gif|webp`. Rejected values (`javascript:`, `http:`, `file:`, `../`, SVG data) are dropped. URL wins over `iconPath`.
- `iconPath` — SVG path `d` (viewBox `0 0 24 24`) when there is no usable URL.
- `metadata` — plain object copied onto the dropped node as `data.metadata`. Not shown in the library or Properties.
- `taskMeta` — opaque object copied onto the dropped node as `data.taskMeta`. Not flattened into Properties fields.
- `propertiesSchema` — plain object copied onto the dropped node as `data.propertiesSchema`. Wins for that node’s Properties form (see Properties schema above).

If an image fails to load, that card falls back to `iconPath` or the type glyph. On drop, the same `iconUrl` / `iconPath` are copied onto `node.data` so the canvas node shows the same icon (inside the Condition / Router / Repeater frame, or in the agent avatar).

| Binding | Library |
|---|---|
| Omit `[palettes]` (no adapter) | Empty-state only (`palette-empty-remote`). Featured and default agents hidden. Same as `[]`. |
| Omit `[palettes]` (adapter configured) | Adapter rows (U-PAL-02). Featured strip is the first Condition, Router, and Repeater unless host palettes are present. |
| `[palettes]="[]"` | Empty-state only (`palette-empty-remote`). Featured and default agents hidden. |
| `[palettes]="items"` (non-empty after sanitize) | Parent owns the remote list. Built-in featured three are **replaced**: the strip lists every remaining Condition / Router / Repeater from the host catalog (zero or more). Default agents stay. The catalog adapter is not called. |
| Omit `[defaultAgents]` | JSON / provider `palette.solution.defaultAgents` (Blank Agent if omitted there) |
| `[defaultAgents]="[]"` | No default-agent cards (unless `[palettes]="[]"`, which already hides them) |
| Unknown `type` (e.g. `"Stream"`) | Row dropped. Canvas cannot create unknown node types. |

Do not put access tokens in palette items, `metadata`, or embed examples.

Optional `wb-nested-skills-library` accepts the same `[palettes]` overlay (search + Add via palette item). It is not mounted in `wb-agent-skills-shell`; the agent-shell left sidebar is the visible nested Skills Library.

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
