# Frontend Components — U-HUI-01 Host UI chrome inputs

---

## Hierarchy (solution) — effective gates

```text
wb-shell-layout [ui]
  providers: UI_EFFECTIVE_FEATURES → reader(effectiveFeatures)
  ├─ config warning banner (@if global loadStatus missing|invalid)
  └─ stage
       ├─ wb-canvas-host          @if effective canvas.enabled
       ├─ header-overlay
       │    ├─ wb-top-bar         @if effective topBar.enabled
       │    └─ wb-agent-tabs      @if effective agentTabs.enabled
       ├─ wb-left-sidebar         @if effective agentsLibrary.enabled
       └─ wb-right-sidebar        @if effective propertiesPanel.enabled
```

Nested `wb-agent-skills-shell [ui]` mirrors this with `skillsLibrary.enabled` and its **own** token scope (does not inherit parent overlay — Q5=A).

---

## ShellLayoutComponent / AgentSkillsShellComponent

| Item | Detail |
|---|---|
| Input | `ui = input<UiFeaturesPartial \| undefined>()` — no default |
| Computed | `effectiveFeatures = computed(() => mergeUiFeatures(uiConfig.features(), normalizePartial(ui() ?? {})))` |
| Local `is(path)` | Path index over `effectiveFeatures()` |
| Providers | `{ provide: UI_EFFECTIVE_FEATURES, useFactory: … }` reading effective signal |
| Region gates | Switch from `uiConfig.is` to shell-local effective `is` |
| Banner | Still `uiConfig.loadStatus()` (Q6=A) |

---

## Token consumers

| Component | Change |
|---|---|
| `TopBarComponent` | Inject `UI_EFFECTIVE_FEATURES` optional; else `UiConfigService`; gate actions/`topBar.save` via reader |
| `ChromeShortcutsDirective` | Same for Save shortcut |
| `ZoomControlsComponent` | Same for canvas action flags |
| `CanvasViewportComponent` | Same for zoom/minimap/floating overlays |

When token absent (unit tests hosting a leaf alone), behavior matches pre-`[ui]` global service (Q4=A).

---

## core/ui-config additions (Q3=A layout)

| File | Role |
|---|---|
| `ui-effective.token.ts` | `UI_EFFECTIVE_FEATURES` token + reader type |
| `effective-ui-reader.ts` (optional) | `createEffectiveUiReader(signal)` shared helper |
| Existing merge/normalize | Reused; no bootstrap order change |

---

## Docs

| Artifact | Action |
|---|---|
| `docs/workflow-builder-ui-embed.md` | Add `[ui]` section: precedence, omit/`{}`/partial, both shells, example binding |
| `README.md` | Pointer to embed `[ui]` API |

---

## Tests (for Code Generation)

| Kind | Coverage |
|---|---|
| PBT (Q9=A) | `mergeUiFeatures(base, normalizePartial(partial))` leaves; no mutation of cloned base |
| Example | Omit / `{}` / partial precedence vs provider/JSON |
| Example | Two shells different overlays — isolation; global unchanged |
| Example | Reactive `[ui]` change hides/shows a region without remount |
| Example | Agent shell `[ui]` gates `skillsLibrary` |
| Existing | Defaults all-on suites remain green |

---

## Traceability

| Story | Frontend focus |
|---|---|
| US-HUI-01 | Bind + precedence + isolation |
| US-HUI-02 | Omit / `{}` |
| US-HUI-03 | Reactive input → computed |
| US-HUI-04 | Both shells + docs |
