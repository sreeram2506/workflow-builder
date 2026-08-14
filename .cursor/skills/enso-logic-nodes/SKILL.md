---
name: enso-logic-nodes
description: >-
  Domain model for Enso workflow logic nodes Condition, Router, and Repeater,
  extracted from enso-suite. Use when implementing or changing Condition,
  Router, Decision, Repeater, connector conditions, or logic-node properties
  in workflow-builder. Distinguishes Router (branching node) from edge
  routing (routeEdges).
---

# Enso logic nodes (from enso-suite)

Source of truth: `/Users/sreeram/ofcwork/enso-suite` solution canvas + agent pipeline.

**Do not confuse:**

| Term | What it is |
|---|---|
| **Router** (`isRouterTask`) | Logic node. Multi-way branch. Each outgoing edge carries its own condition. |
| **route / routeEdges** | Orthogonal edge pathfinding in workflow-builder. Unrelated to Router. |
| **Condition** (`isCondition`) | Binary yes/no branch. Node holds the expression; edges are `true` / `false`. |
| **Repeater** (`isRepeater` / `skillRepeater`) | Loop node. Re-runs a nested workflow/agent. Config comes from a platform skill. |
| **Connector** (`isConnector`) | Conditional outgoing edge from a **Router** (name + expression). Not a generic canvas edge. |

## Type mapping (workflow-builder ↔ enso-suite)

| workflow-builder | Palette label | enso-suite flag | Shape |
|---|---|---|---|
| `Condition` | Condition | `addInfo.isCondition` | Rhombus (`Rhombus.svg`) |
| `Decision` | **Router** | `addInfo.isRouterTask` | Router glyph (`Router.svg`) |
| `Repeater` | Repeater | `addInfo.isRepeater` (solution) or `addInfo.skillRepeater` (agent pipeline) | Repeater glyph (`Repeater.svg`) |
| edge from Router | — | connector `addInfo.isConnector` | Orthogonal edge with label |

Keep `Decision` as the type id; display name is **Router**.

Logic nodes are **60×60** HTML shapes (not agent cards). They skip agent name-edit on drop.

## 1. Condition — binary branch

**Intent:** Evaluate one expression, then take exactly one of two paths.

**Node `addInfo` (enso):**

```ts
{
  isCondition: true,
  name: 'Blank Condition',   // required
  condition: '',             // expression string, required on save
  id: string
}
```

**Properties panel:** title "Condition Properties"

- Name (required)
- Condition / value (required) — free-text expression, placeholder "Enter Condition"

**Edges:**

- Max **2** outgoing connectors. A third is rejected: *"Only 2 connectors can be added to a condition..."*
- Labels are auto-assigned `true` then `false` (read-only annotations). Opposite of the first existing label.
- Condition **node** owns the expression. Outgoing edges do **not** open Connector Properties (unlike Router).

**Save validation:**

- `name` not empty
- `condition` not empty
- Duplicate-name check **skips** Condition nodes

**Click:** single-click opens properties. No "View Agent" / pause / lineage.

## 2. Router — multi-way branch

**Intent:** Fan out to N paths. Each path is a **conditional connector**.

**Node `addInfo` (enso):**

```ts
{
  isRouterTask: true,
  name: 'Blank Router',  // required
  id: string
}
```

Router node itself has **no condition field**. Conditions live on outgoing connectors (and historically on `ports[0].addInfo.name`).

**Properties panel:** title "Router Properties"

- Router Name (required)

**Conditional connector (`isConnector`):**

Created when the user clicks an edge whose **source is a Router**. If the edge has no `addInfo` yet:

```ts
{
  name: 'Blank Condition',
  condition: '',
  isConnector: true
}
```

Connector properties (title "Connector Properties"):

- Name (required)
- Condition / value (required) — same expression field as Condition node

Edge label on canvas = connector `name`. Empty condition turns the stroke red.

**Save validation:**

- Router `name` not empty
- Router `ports[0].addInfo.name` not empty (legacy port condition)
- Every `isConnector` edge: `sourceID` + `targetID` set, `condition.trim()` not empty
- Duplicate names: "Router task with same name already exists"

**Click:**

- Click Router node → Router Properties
- Click edge **from** Router → Connector Properties
- Click edge from any other node → ignore (no connector panel)

No pause / view-agent / lineage on Router.

## 3. Repeater — nested loop

**Intent:** Repeat a nested workflow or agent. Not a visual loop of canvas nodes; it is a **task** whose config selects what to run.

Two flags, same idea:

| Canvas | Flag | Palette |
|---|---|---|
| Solution workflow | `isRepeater: true` | Static palette item "Repeater" |
| Agent pipeline | `skillRepeater: true` | Injected from skills API |

**On drop (solution):** merge first skill from `getSkills({ user_category: ['Workflow Manipulation'] })` into `addInfo`, then run `constructErrorObj`. That skill supplies `default_task_version.extras.x_config`.

**Node data after drop:**

```ts
{
  isRepeater: true,            // or skillRepeater
  name: 'Blank repeater',      // required; regex-validated
  display_name?,
  task_id,
  default_version,
  default_task_version: {
    extras: {
      x_config: {
        basic_config: XpmsField[],  // general
        adv_config: XpmsField[]     // advanced / dependencies
      }
    }
  },
  configurations: {},          // flattened config_path → value for persist
  errorCount: number,
  is_paused?: boolean
}
```

**Properties panel:** title "Repeater Properties"

1. Error banner if `errorCount > 0` ("Repeater Errors")
2. Name (required, regex like other task names)
3. **General** (`basic_config`): rendered by XPMS field type
   - `PlatformApiListConfiguration` — dropdown (Workflow/Agent picker). Changing "Workflow/Agent" resets "Workflow/Agent Version" and sets `request_data.pipeline_id` + `pipeline_type`, `apireload: true`
   - `StringConfiguration` — text
   - `PlatformApiListLabelConfiguration` — labeled API list
4. **Advanced** (`adv_config`): `CategoricalListConfiguration`, `BooleanConfiguration` (skip `hidden`)
5. Actions: Pause task toggle (repeaters + custom agents). Delete.

**Save validation:**

- Name not empty; regex unless Condition/Repeater special-case
- `errorCount === 0` or block save: *"There are some errors in the Repeater Configuration..."*
- Duplicate: "Repeater task with same name already exists"

**Persist:** `generateConfigurationInfo` keeps repeater flags + `default_task_version.extras` + flattened `configurations`. Condition/Router/Connector skip this flatten and persist `addInfo` as-is.

## 4. Properties panel contract (what to build in workflow-builder)

Today workflow-builder uses one generic schema (`Ignore Keys in Paragraph`) for every type. Enso uses **per-type panels**. Target:

**Condition node**

- `data.name` / `label` (required)
- `data.condition` (required string)

**Router (`Decision`) node**

- `data.name` / `label` (required)
- no condition on the node

**Edge whose source is Router**

- `edge.label` = connector name (required)
- `edge` / `data.condition` (required string)
- treat as `isConnector`

**Edge whose source is Condition**

- `edge.label` is `true` or `false` only
- do not show a free-text condition on the edge
- enforce max 2 outgoing edges

**Repeater node**

- `data.name` / `label` (required)
- `data.config` from XPMS `x_config` (Workflow/Agent, version, plus adv fields)
- `data.is_paused`
- surface required-field errors like `errorCount`

## 5. Shared canvas rules

- Logic nodes: no rotate, no resize.
- All connectors: Orthogonal.
- Logic nodes: delete without agent duplicate menu.
- Highlight: Router/Repeater selection border is circular (`rx/ry = 50%`); Condition is square.
- Pause icon only on Repeater (and agents), not Condition/Router.

## Source files (enso-suite)

- Palette: `src/app/secure/canvas/solutions/diagram.service.ts` (`getFlowShapesForSolution`)
- Agent palette (no static Repeater; Repeater is a skill): `src/app/secure/canvas/agent-workflow/agent.service.ts` (`getFlowShapesForAgents`)
- Properties UI: `src/app/secure/canvas/solutions/diagram-properties/`
- Pipeline properties: `src/app/secure/canvas/pipeline/skillconfig/`
- Drop / true-false edges: `src/app/secure/canvas/solutions/diagram-content/diagram-content.component.ts` (`dropEnter`, `sourcePointChange`)
- Router-edge click: `src/app/secure/canvas/solutions/solution-diagram/solution-diagram.component.ts` (`onAgentClick`, `saveDiagram`)
- Repeater skill fetch: `getSkills` with `user_category: ['Workflow Manipulation']`
- Copy: `src/assets/i18n/en.json` keys under `CANVAS.DIAGRAM.*` and `CANVAS.SOLUTIONS.CONDITION_*` / `ROUTER_*` / `REPEATER_*`

For field-level XPMS types and validation strings, see [reference.md](reference.md).
