# Component Methods — Dynamic Properties

**Note**: Detailed algorithms land in Functional Design (U-DP-01). Signatures here are high-level.

---

## C-DP-HELP — `host-properties.dynamic.ts`

| Method | Input | Output | Purpose |
|---|---|---|---|
| `getPropertiesMap` | `node.data` / unknown | `Record<string, unknown>` | Read map; missing/non-object → `{}` |
| `withPropertiesMap` | data, map | updated data | Set `data.properties` immutably |
| `inferControlKind` | `unknown` value | `'text' \| 'number' \| 'boolean' \| 'readonlyJson'` | FR-DP-03 |
| `schemaCoveredPaths` | `HostPropertiesSchema \| null` | `Set<string>` | Paths covered by visible schema fields |
| `builtInCollisionIds` | `NodeType` | `Set<string>` | Field ids to omit from dynamic list |
| `listRemainingPropertyKeys` | map, covered, collisions | `string[]` | Stable key order for UI |

---

## C-DP-DYN — Dynamic Property component

| Member | Kind | Purpose |
|---|---|---|
| `key` | input | Property key (label fallback) |
| `value` | input | Current value |
| `metadata` | input optional | Host field type/label/options when known |
| `disabled` | input | View mode / read-only JSON |
| `valueChange` | output | New value for parent form |

---

## C-DP-CHR — UI features

| Method / site | Purpose |
|---|---|
| Normalize defaults | `addProperty: false` when omitted |
| Effective chrome read | Sidebar gates Add UI |

---

## C-DP-SIDE — right-sidebar (delta)

| Method / flow | Purpose |
|---|---|
| Build configuration form | Schema controls bind to properties paths; remaining keys via Dynamic Property |
| Add property (if chrome) | Insert string key/value into working form map |
| Save | Merge `properties` into node via `facade.patchNode` |
| Built-in sections | Unchanged paths on `node.data`; collision filter for dynamic list |

---

## C-DP-FAC — unchanged API

| Method | Purpose |
|---|---|
| `patchNode(id, partial)` | Persist General + `data.properties` (+ built-in fields as today) |
