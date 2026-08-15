# Unit Dependencies — Solution Workflow Increment

Parent: **Solution Workflow**. Does not replace U1–U9 dependency docs.

---

## Dependency matrix

| Unit | Depends on | Dependency type | Notes |
|---|---|---|---|
| U-SW-01a | U1 shell / GraphStore / UiStore / Facade | Hard | Extend existing SPA |
| U-SW-01a | U2 canvas nodes | Hard | Dblclick on WorkflowNode |
| U-SW-01a | U9 featured logic strip | Soft | Blank Agent sits below existing strip |
| U-SW-01b | **U-SW-01a** | Hard (strict) | Requires tabs + Blank Agent on canvas |
| U-SW-01b | U1/U5 Properties + view mode | Hard | Nested Properties / read-only |
| U-SW-01b | Angular Router (reintroduced) | Hard | `/agent/:nodeId` |

---

## Sequence

```text
[Prior U1-U9]
      |
      v
 U-SW-01a (P0)  -- Build/Test approved -->  U-SW-01b (P1)
 palette+tabs                              route+skills+Back
```

### Text alternative

1. Complete U-SW-01a construction loop and get Build/Test approval.  
2. Start U-SW-01b construction loop (no parallel start before that approval).  
3. No further Solution Workflow units in this increment.

---

## Shared resources

| Resource | Owner unit | Consumers |
|---|---|---|
| `AIAgent` palette + canvas node | U-SW-01a | U-SW-01b |
| Open agent tabs (UiStore) | U-SW-01a | U-SW-01b (select tab → navigate) |
| `AIAgent.data.skills` | U-SW-01b | Serialize (reuse) |
| Mock skills catalog | U-SW-01b | Nested library only |

---

## Integration checkpoints

| When | Check |
|---|---|
| End of U-SW-01a | Blank Agent addable; dblclick focuses tab; no nested route required yet |
| End of U-SW-01b | Tab → nested skills; add skills; Back; view mode; prior suites still green |
