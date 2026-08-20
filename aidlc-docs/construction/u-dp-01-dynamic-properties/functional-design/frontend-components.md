# Frontend Components — U-DP-01 Dynamic Properties

**FD Q7=A**

---

## Hierarchy

```text
wb-right-sidebar
  ├── General (existing)
  ├── Built-in configuration sections (existing, logic types)
  ├── Host schema sections (existing field controls → properties map)
  ├── Remaining keys
  │     └── wb-dynamic-property (per key)
  └── Add property row (if propertiesPanel.addProperty)
```

## wb-dynamic-property

| Input / Output | Type | Notes |
|---|---|---|
| `key` | string | Label fallback = key |
| `value` | unknown | Current |
| `metadata` | optional field meta | When present, prefer schema type |
| `disabled` | boolean | View mode or readonlyJson |
| `valueChange` | output unknown | Parent form |

Controls: text, number, boolean toggle, read-only JSON textarea. Never bind innerHTML to host strings.

## Sidebar delta

| Concern | Behavior |
|---|---|
| Schema bind | Form values ↔ `getAtPath`/`setAtPath` on working properties map |
| Remaining | Track `listRemainingPropertyKeys` |
| Save | Merge `properties` into `patchNode` payload |
| Add | Local key/value inputs; trim; no-op empty; overwrite duplicate |
| Chrome | Read effective `propertiesPanel.addProperty` |
| View | Disable all edits; hide Add |

## Try / docs

Not Angular library chrome — update embed markdown + try host demo separately in Code Generation.
