# Component Dependency — Dynamic Properties

## Dependency matrix

| From → To | C-DP-HELP | C-DP-DYN | C-DP-CHR | C-DP-SIDE | C-DP-RES | C-DP-FAC | C-DP-DOCS |
|---|---|---|---|---|---|---|---|
| C-DP-HELP | — | — | — | used by | — | — | described |
| C-DP-DYN | uses infer | — | — | child of | — | — | — |
| C-DP-CHR | — | — | — | read by | — | — | described |
| C-DP-SIDE | uses | hosts | gates Add | — | metadata | Save | — |
| C-DP-RES | — | — | — | used by | — | — | — |
| C-DP-FAC | — | — | — | called by | — | — | — |
| C-DP-DOCS | — | — | — | — | — | — | — |

## Data flow (Save)

```text
Author edits form
  -> wb-right-sidebar collects General + built-ins + properties map
  -> facade.patchNode(id, { label..., data: { ...prev, properties } })
  -> Host observes document / facade (no propertiesChange output)
```

## Data flow (render)

```text
Selected node
  -> resolveHostPropertiesSchema (metadata)
  -> getPropertiesMap(node.data)
  -> schema fields bind map[path]
  -> listRemainingPropertyKeys -> Dynamic Property per key
  -> optional Add row if propertiesPanel.addProperty
```

## Unit boundary

All of the above ships as **U-DP-01** (single Angular SPA package).
