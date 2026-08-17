# Try UI Config

Exercise JSON / provider overlays, **chrome gates**, and **palette / catalog host config**.

Full embed API + flag table: **[workflow-builder-ui-embed.md](./workflow-builder-ui-embed.md)**.

## Active file

Runtime loads: **`/assets/wb-ui-config.json`** ← `src/assets/wb-ui-config.json`

Default committed value is `{}` (all flags default **on**).

## Example files (complete key coverage)

| File | Intent |
|---|---|
| `src/assets/examples/wb-ui-config.all-on.json` | Every chrome leaf explicit `true` |
| `src/assets/examples/wb-ui-config.all-off.json` | Every chrome leaf explicit `false` |
| `src/assets/examples/wb-ui-config.minimal-canvas.json` | Partial: hide libraries / floating actions; keep canvas |
| `src/assets/examples/wb-ui-config.palette-host.json` | Solution allow-list + two `defaultAgents`; skills allow-list |

### Try via JSON

```bash
# from repo root — pick one example
cp src/assets/examples/wb-ui-config.minimal-canvas.json src/assets/wb-ui-config.json
# restart or let ng serve rebuild, then refresh the browser
```

Restore defaults:

```bash
echo '{}' > src/assets/wb-ui-config.json
```

### Try via host provider (wins over JSON)

In `src/app/app.config.ts`:

```typescript
import { provideWorkflowBuilderUi } from './core/ui-config';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    provideWorkflowBuilderUi({
      features: {
        agentsLibrary: { enabled: false },
        canvas: { save: false },
      },
    }),
    provideAppInitializer(uiConfigAppInitializer),
  ],
};
```

Provider values override the same keys from JSON.

### Try palette host JSON

```bash
cp src/assets/examples/wb-ui-config.palette-host.json src/assets/wb-ui-config.json
```

Then click back into the browser (JSON reloads on window focus). Agents Library should show Condition / Router / Repeater plus **Claims Agent** and **Policy Agent** instead of Blank Agent. Restore with `echo '{}' > src/assets/wb-ui-config.json`.

Catalog adapters cannot be tried via JSON — wire `provideWorkflowBuilderUi({ catalog: { solution, agent } })` in `app.config.ts`. An adapter that returns `{ items: [] }` shows the empty-state (`palette-empty-remote`), not static defaults. HTTP/adapter failures still show static types plus a banner (no mock agents).

## What you should see

- **Chrome gates are live** — flags hide/show shell regions (libraries, properties, top bar, agent tabs, canvas overlays, floating actions, layout dropdown).
- When `topBar.enabled` is false and no agent tabs are open, Agents Library and Properties use the top of the stage (they are no longer stuck under a ~72px empty header).
- Clicking the same Agents Library agent again focuses the existing node and tab; it does not add a second tab. Copy/paste can still create another agent node.
- After editing `src/assets/wb-ui-config.json`, click back into the browser window (or switch to the tab) — JSON is re-fetched on **window focus** / tab visibility. A full refresh still works.
- On boot (dev mode), the browser console logs `[UiConfig] loadStatus=… features=…`.
- If JSON is missing or invalid, a non-blocking **config banner** appears (`ui-config-banner`).

Inspect:

- `loadStatus.kind`: `ok` | `missing` | `invalid`
- Resolved nested `features` object (all leaves after merge)

## Full key inventory

See `all-on.json` for every path, or the flag table in [workflow-builder-ui-embed.md](./workflow-builder-ui-embed.md).

Dot paths for `UiConfigService.is()`:

`topBar.*`, `agentTabs.enabled`, `agentsLibrary.enabled`, `skillsLibrary.enabled`, `propertiesPanel.enabled`, `canvas.*` (including `canvas.layoutControls`). Theme is `topBar.theme` (not a root `themeToggle` key). Palette is `features().palette` (not `is()` paths): `palette.solution.types`, `palette.solution.defaultAgents`, `palette.agent.types`.
