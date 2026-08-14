# Enso logic-node reference

## Validation copy (enso i18n)

| Key | Message |
|---|---|
| CONDITION_PROPERTIES | Condition Properties |
| ROUTER_PROPERTIES | Router Properties |
| REPEATER_PROPERTIES | Repeater Properties |
| CONNECTOR_PROPERTIES | Connector Properties |
| CONDITION_NAME | Name |
| CONDITION_VALUE | Condition |
| CONDITION_PLACEHOLDER | Enter Condition |
| CONDITION_VALIDATION | Condition details missing |
| CONDITION_VALIDATION_DESC | Provide a value and try again |
| CONDITION_VALIDATION_INLINE | Condition cannot be empty |
| CONDITION_VALIDATION_NAME | Condition name cannot be empty |
| ROUTER_NAME | Router Name |
| ROUTER_VALIDATION | Router details missing |
| ROUTER_VALIDATION_DESC | Provide a value and try again |
| ROUTER_VALIDATION_INLINE | Router name cannot be empty |
| ROUTER_CONDITION_VALIDATION | Connector condition(s) missing |
| ROUTER_CONDITION_VALIDATION_DESC | Each linked connector requires a condition |
| ROUTER_TASK_VALIDATION | Router task with same name already exists |
| REPEATER_ERRORS | Repeater Errors |
| REPEATER_VALIDATION_MESSAGE | There are some errors in the Repeater Configuration. Please Check and resolve them.. |
| REPEATER_TASK_VALIDATION | Repeater task with same name already exists |
| CONNECTOR_VALIDATION | Only 2 connectors can be added to a condition... |
| CONNECTOR_VALIDATION_NAME | Connector name cannot be empty |
| CONNECTOR_VALIDATION_SOURCE_TARGET_ID | Please connect source and target to connectors. |

## Condition vs Router vs Repeater vs Connector

```
                    ┌─────────────┐
   incoming ───────►│  Condition  │──true──► path A
                    │  expr on    │──false─► path B
                    │  the NODE   │     (max 2 outs)
                    └─────────────┘

                    ┌─────────────┐
   incoming ───────►│   Router    │── connector{name, condition} ──► path A
                    │  name only  │── connector{name, condition} ──► path B
                    │             │── connector{name, condition} ──► path N
                    └─────────────┘

                    ┌─────────────┐
   incoming ───────►│  Repeater   │──► (runs nested workflow/agent in a loop)
                    │  skill cfg  │
                    └─────────────┘
```

## Repeater XPMS field types used in the panel

From `diagram-properties.component.html` / `skillconfig`:

| `_XpmsObjectMixin__type` | `multi_select` | UI |
|---|---|---|
| PlatformApiListConfiguration | false | API-backed dropdown (`app-ensomultiselect`). Disabled until `checkDependencies` passes. |
| StringConfiguration | false | Text box |
| PlatformApiListLabelConfiguration | false | API list with option labels |
| CategoricalListConfiguration | false | Static options dropdown (adv) |
| BooleanConfiguration | false | Boolean dropdown (adv) |

Hidden fields (`hidden == true`) are skipped.

Dependent fields: if `item.name === 'Workflow/Agent'`, the sibling `'Workflow/Agent Version'` gets `request_data.pipeline_id` + `pipeline_type` from the selected value and `apireload: true`.

Required empty values increment `errorCount` via `errorObj[fieldName] = true`.

## Persist shape (`generateConfigurationInfo`)

**Condition / Router / Connector:** return `addInfo` unchanged.

**Repeater:**

```ts
{
  isCustomAgent: false,
  isRepeater: true,          // solution
  skillRepeater: true,       // pipeline, if set
  id, name, display_name, description, user_category,
  default_task_version: { extras },
  skiptasks, configurations, task_id, default_version,
  errorCount, class
}
```

`configurations` is a nested map: `task_path` → `{ config_path_with_underscores: value }`.

## Agent pipeline vs solution canvas

| | Solution workflow | Agent pipeline (skills) |
|---|---|---|
| Condition | static palette | static palette |
| Router | static palette | static palette (hidden on Models) |
| Repeater | static palette + Workflow Manipulation skill payload on drop | `skillRepeater` skill, not in `getFlowShapesForAgents()` |
| Connector | palette Orthogonal + Router-edge properties | same; Router-edge click in `agent-workflow.component.ts` |
| Default names | Blank Condition / Blank Router / Blank repeater | Blank condition / Blank Router |

## workflow-builder gaps vs this model

Current builder (`properties.schema.ts`) uses the same locked boolean field for every node type. Missing:

1. Condition: `data.condition` + max-2 outs labeled true/false
2. Router (`Decision`): no node condition; edges from Router need `condition`
3. Repeater: nested workflow/agent picker + pause + error count
4. Edge panel: today only id/source/target/label — add condition when source is Router; lock label to true/false when source is Condition
