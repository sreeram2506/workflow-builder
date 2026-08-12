# Domain Entities — U5 Schema-Driven Properties Panel

## Purpose
Schema registry and patch models for schema-driven node properties.

## Carried from prior units
| Entity | Use in U5 |
|---|---|
| `WorkflowNode` | Target of bind/patch (`label`, `subtitle`, `status`, `data`) |
| `NodeType` / `NodeStatus` | Schema key / status enum |
| `SelectionState` | Drive focus + empty state |
| `EditorMode` | Edit vs view (disable form) |

## New concepts

### XpmsFieldDescriptor
In-app schema field (XPMS-style), not JSON Schema Draft.

| Field | Meaning |
|---|---|
| `name` | Display label |
| `description` | Help text |
| `data_type` | e.g. `boolean`, `string`, `number` |
| `op_type` | Optional classifier (e.g. `categorical`) |
| `value` | Default / catalog seed value |
| `multi_select` | Whether multi value (v1: false) |
| `hidden` | Omit from UI when true |
| `config_path` | Dot path under `node.data` |
| `ui_component` | Optional override; empty → infer from `data_type` |
| `required` | Validation flag |
| `basic` | Optional grouping hint (v1 unused beyond General vs Configuration) |
| `placeholder` | Optional placeholder |
| `options` | Allowed values when categorical |
| `task_name` | Optional catalog metadata (store-through; unused by UI) |

### NodeTypeSchema
| Field | Meaning |
|---|---|
| `type` | `NodeType` |
| `configurationFields` | `XpmsFieldDescriptor[]` (v1: length 1) |

### PropertiesSchemaRegistry
Static map `NodeType` → `NodeTypeSchema` (and shared General field definitions).

### SelectionFocus
| Field | Meaning |
|---|---|
| `focusNodeId` | Most recently clicked selected node id, or sole selection, or `null` |

Implementation may live on `UiStore` as `selectionFocusNodeId` updated by facade select/toggle/marquee handlers.

### NodePatch
Partial update applied by `patchNode`:
| Field | Meaning |
|---|---|
| `label?` | Root |
| `subtitle?` | Root |
| `status?` | Root |
| `data?` | Full or deep-merged `Record` after applying config_path writes |

### ConfigPath
Dot-separated path relative to `node.data` (e.g. `config.data.ignore_keys_in_paragraph`).

Helpers (pure): `getAtPath(data, path)`, `setAtPath(data, path, value)` → new object trees (immutable).

## Locked v1 Configuration mock (all types)
```text
name: Ignore Keys in Paragraph
description: Ignore Keys in Paragraph & Sentence
data_type: boolean
op_type: categorical
value: true
multi_select: false
hidden: false
config_path: config.data.ignore_keys_in_paragraph
ui_component: (empty)
required: false
basic: false
placeholder: null
options: [true, false]
```

## Explicitly not entities in U5
- JSON Schema documents
- Edge property schemas
- History entries (U7)
- Remote schema DTOs
