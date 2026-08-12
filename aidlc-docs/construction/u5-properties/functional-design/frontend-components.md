# Frontend Components — U5 Schema-Driven Properties Panel

## Hierarchy

```text
ShellLayout
  └─ RightSidebar / PropertiesPanel (evolve mock → real)
        ├─ PropertiesHeader (title, type, collapse)
        ├─ PropertiesEmptyState
        ├─ PropertiesForm (reactive forms)
        │     ├─ GeneralSection (label, subtitle, status)
        │     └─ ConfigurationSection (XPMS-driven controls)
        └─ PropertiesFooter (Save — edit mode only)
```

## Component responsibilities

### PropertiesPanel (`wb-right-sidebar` evolution)
| Concern | Behavior |
|---|---|
| Inputs | `collapsed`, document/selection via facade inject (match shell patterns) |
| Auto-expand | Emit / set collapsed=false when sole node selected |
| Binding | Subscribe to `focusNodeId` + node snapshot; rebuild form when focus or saved node changes |
| View mode | Disable form; hide Save |

### PropertiesForm
- `FormBuilder` group: `general` subgroup + dynamic `configuration` controls keyed by `config_path` or stable field id
- Validators from `required` and type coercion (boolean)
- Dirty tracking for Save enablement

### Configuration control renderer
- Map each `XpmsFieldDescriptor` → control (v1: boolean → select true/false or checkbox)
- Show `name`, optional `description`
- Inline error under control when invalid

### PropertiesFooter
- Save button: enabled per BR-U5-07
- No Cancel button (discard on selection change)

## Interaction flows

### Single-node select
1. User selects one node on canvas  
2. Properties expands  
3. Form loads General + Configuration from node + registry  
4. User edits → Save → `patchNode` → form pristine  

### Multi-select
1. User Shift-clicks additional nodes  
2. Form shows **most recently clicked** selected node  
3. Header may indicate multi-select context (optional subtitle)  

### Discard
1. Dirty form + user selects another node / clears selection  
2. Form torn down / rebuilt; previous edits not written  

### View mode
1. `editorMode === 'view'`  
2. Values visible; inputs disabled; Save hidden  

## State / facade API (design)

| API | Role |
|---|---|
| `selectionFocusNodeId` (store/facade) | Properties target |
| `patchNode(id, partial)` | Persist Save |
| `editorMode` | Disable path |
| Existing `selection` / `document` | Source data |

## Styling
- Keep floating Properties overlay tokens from U1
- Section headers for General / Configuration
- No new UI libraries

## Non-goals (UI)
- Edge property UI
- Toast notifications
- Autosave indicator (optional dirty text only if cheap)
