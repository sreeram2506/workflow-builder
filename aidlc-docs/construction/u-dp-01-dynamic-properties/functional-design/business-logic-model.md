# Business Logic Model — U-DP-01 Dynamic Properties

**Unit**: `u-dp-01-dynamic-properties`  
**FD locks**: Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A  

---

## Purpose

Extend U-HP-01 so host/dynamic configuration **values** live in `node.data.properties`, while schema metadata still comes from first-win resolve. Inferred keys use Dynamic Property; optional Add when chrome allows.

## Core flows

### Render (selected node)

```text
1. General (always)
2. If Condition / Decision / Repeater: built-in sections (paths on node.data as today)
3. Resolve host schema (metadata first-win — U-HP-01)
4. propertiesMap = getPropertiesMap(node.data)   // malformed → {}
5. For each visible schema field: bind control to getAtPath(propertiesMap, field.path)
6. remaining = listRemainingPropertyKeys(map, coveredPaths, collisionIds)
7. For each remaining key: Dynamic Property (infer or no metadata)
8. If propertiesPanel.addProperty: show Add row
```

### Save

```text
1. Collect General + built-in node.data paths (unchanged)
2. Build properties object from schema form values + dynamic form values (+ Adds)
3. patchNode merge: data = { ...prevData, properties }
4. No propertiesChange output
```

### Add property (chrome on)

```text
trim(key); if empty → no-op
set working map[key] = string value (overwrite if duplicate)
```

## Algorithms (pure)

| Function | Behavior |
|---|---|
| `getPropertiesMap` | Plain object → copy/use; else `{}` |
| `withPropertiesMap` | Return data with `properties` set to plain map |
| `inferControlKind` | string→text; number→number; boolean→boolean; null/undefined→text; else→readonlyJson |
| `schemaCoveredPaths` | Visible non-hidden field.path strings |
| `builtInCollisionIds(type)` | Condition: `{condition}`; Repeater: repeater.* paths; Decision: `{}` |
| `listRemainingPropertyKeys` | `Object.keys(map)` order; drop if in covered or collision |

## Testable Properties (PBT Partial — Q6=A)

| ID | Category | Property |
|---|---|---|
| P-DP-01 | Invariant | `inferControlKind` matches FR-DP-03 table for generated primitives / nullish / objects |
| P-DP-02 | Invariant | `listRemainingPropertyKeys` never returns a key in covered ∪ collision |
| P-DP-03 | Round-trip | `getPropertiesMap(withPropertiesMap(data, map))` equals map for generated plain string maps |

Example (non-PBT): Save merge writes `properties`; Add hidden when chrome false.

## Traceability

| Story | Logic |
|---|---|
| US-DP-01 | Bind + Save merge |
| US-DP-02 | Remaining + infer + Dynamic Property |
| US-DP-03 | Built-ins + collision |
| US-DP-04 | Add chrome |
| US-DP-05 | Docs/try (out of pure model; see frontend + CG) |
