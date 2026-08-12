# Business Rules — U5 Schema-Driven Properties Panel

## BR-U5-01 — Properties target node
Properties bind to **selection focus**:
- Single selection → that node
- Multi-selection → **most recently clicked** node that remains in `selection.nodeIds`
- No selected nodes → empty state (no form)

## BR-U5-02 — Auto-expand
When selection becomes **exactly one** node, expand the Properties overlay if collapsed.

## BR-U5-03 — Schema source
Configuration fields come only from the in-app **XPMS-style descriptor registry** keyed by `NodeType`. No remote fetch in U5.

## BR-U5-04 — Locked v1 fields (gate)

### General (all types) — node root
| Key | Control | Values |
|---|---|---|
| `label` | text | string |
| `subtitle` | text | string |
| `status` | select | `idle` \| `running` \| `success` \| `error` |

### Configuration (every type) — one mock descriptor
| name | data_type | config_path | options | default |
|---|---|---|---|---|
| Ignore Keys in Paragraph | boolean | `config.data.ignore_keys_in_paragraph` | `true`, `false` | `true` |

Same descriptor shape for all eight `NodeType`s in v1 (mock catalog).

## BR-U5-05 — Value placement
- General writes to `WorkflowNode.label` / `.subtitle` / `.status`
- Configuration writes under `WorkflowNode.data` following `config_path` segments  
  Example: path `config.data.ignore_keys_in_paragraph` → `node.data.config.data.ignore_keys_in_paragraph`

## BR-U5-06 — Persist only on Save
Store updates **only** via Save → `patchNode`. Unsaved edits are discarded when the bound node changes or selection clears.

## BR-U5-07 — Save enablement
Save is enabled iff:
- `editorMode === 'edit'`
- form is dirty
- form is valid

Invalid controls show **inline** errors only (no toast).

## BR-U5-08 — View mode
When `editorMode === 'view'`:
- Form controls disabled / readonly
- Save not available
- Values still visible (US-6.2 readiness)

## BR-U5-09 — No edge properties
Selecting edges does not populate the properties form (empty / select-a-node messaging).

## BR-U5-10 — Descriptor visibility
If a descriptor has `hidden: true`, omit it from the form. v1 mock uses `hidden: false`.

## BR-U5-11 — Required fields
If `required: true` and value empty/null → control invalid. v1 mock boolean uses `required: false`.

## BR-U5-12 — Control mapping (XPMS → UI)
| data_type / hints | UI control |
|---|---|
| `boolean` (+ categorical options true/false) | select or checkbox (implementation choice; prefer select matching options) |
| `string` + long text hint / textarea ui | textarea |
| `string` | text input |
| enum-like `options` non-boolean | select |

v1 only needs boolean → select/checkbox.
