# Unit of Work Dependency — Dynamic Properties

**Sequencing**: Single unit (plan Q1=A, Q2=A)

---

## Dependency matrix

| Unit | Depends on | Dependency type | Notes |
|---|---|---|---|
| U-DP-01 | U-HP-01 host Properties | Soft / extend | Schema types, resolve, sidebar General |
| U-DP-01 | `WorkflowFacade.patchNode` | Soft / reuse | Batch Save merges `data.properties` |
| U-DP-01 | UI chrome normalize | Soft / change | `propertiesPanel.addProperty` |
| U-DP-01 | Logic built-ins + connector UI | Soft / reuse | Always show; collision omit from dynamic list |

No second unit in this increment.

---

## Sequence

```text
U-HP-01 COMPLETE --> U-DP-01 (FD -> CG -> Build/Test)
```

Text alternative: One construction unit after host-driven Properties. Functional Design, Code Generation, then Build and Test.

```mermaid
flowchart LR
    Prior["U_HP_01"]
    Dp["U_DP_01"]
    Prior --> Dp
```

Text alternative: U-DP-01 depends on shipped U-HP-01. No reverse edge.

---

## Shared resources

| Resource | Owner | U-DP-01 use |
|---|---|---|
| `wb-right-sidebar` | U-HP-01 / existing | Bind schema to properties map; Dynamic Property; Add UX |
| `resolveHostPropertiesSchema` | U-HP-01 | Metadata first-win |
| `provideWorkflowBuilderUi` | existing | Chrome + existing properties adapter |
| Embed guide | prior increments | Document map + inference + addProperty |

---

## Inter-unit protocol

None — single unit.
