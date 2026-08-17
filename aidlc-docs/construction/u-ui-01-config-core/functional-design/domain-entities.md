# Domain Entities — U-UI-01 Config Core

**Shape**: Q1=C — nested runtime object + derived path index for `is()`.

---

## UiFeatures (resolved, complete)

```text
UiFeatures
├── topBar
│   ├── enabled, logo, title, status, back
│   ├── save, export, import, run, reset
│   ├── theme, editView
├── agentTabs
│   └── enabled                          // independent of topBar.enabled
├── agentsLibrary
│   └── enabled
├── skillsLibrary
│   └── enabled
├── propertiesPanel
│   └── enabled
└── canvas
    ├── enabled, zoomControls, minimap, floatingActions
```

All leaves: `boolean`. No optional leaves on the **resolved** object.

## PartialDeep\<UiFeatures\>

Same shape with every object/leaf optional. Used for JSON and provider overlays.

## Theme alias input

Partial layers may also carry:

| Field | Type | Meaning |
|---|---|---|
| `themeToggle` | `boolean?` | Alias → `topBar.theme` (BR-08) |

Not stored as a separate leaf on resolved `UiFeatures` unless Code Gen adds a mirrored getter; path `themeToggle` may be included in `UiFeaturePath` as alias to `topBar.theme`.

## UiFeaturePath

Dot-path string union of all leaves, e.g.:

- `topBar.enabled`, `topBar.save`, …
- `agentTabs.enabled`
- `agentsLibrary.enabled`, `skillsLibrary.enabled`, `propertiesPanel.enabled`
- `canvas.enabled`, `canvas.zoomControls`, `canvas.minimap`, `canvas.floatingActions`
- `themeToggle` (alias path → `topBar.theme`)

## UiConfigLoadStatus

| Field | Type | Values |
|---|---|---|
| `kind` | enum | `ok` \| `missing` \| `invalid` |
| `message` | `string \| null` | Human-readable, non-blocking; no secrets |

## Injection token payload

`PartialDeep<UiFeatures> & { themeToggle?: boolean }` (or equivalent options bag `{ features: ... }`).

---

## Relationships

```text
defaults (UiFeatures)
    + normalize(JSON)     → merge
    + normalize(provider) → merge
    → resolved UiFeatures
    → pathIndex (UiFeaturePath → boolean)
```

No relationship to workflow `WorkflowDocument` / GraphStore.
