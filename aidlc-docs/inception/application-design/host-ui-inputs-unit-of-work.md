# Unit of Work — Host UI chrome inputs (`[ui]`)

**Parent label**: Host UI chrome inputs  
**Deployment model**: Same monolith Angular SPA (no new package)  
**Unit meaning**: One logical construction module  
**Sequencing**: Single unit — FD → Code Generation → Build and Test (plan Q2=A)  
**Ownership**: Same stream  
**Construction**: Functional Design → Code Generation; skip NFR Requirements/Design and Infrastructure Design (plan Q2=A)  
**Product boundary**: Instance `[ui]` overlay on existing shells — no change to JSON/provider bootstrap order; no palette `[palettes]` semantics; no workflow document schema change  
**Application Design**: `host-ui-inputs-application-design.md`  
**Plan answers**: Q1=A · Q2=A · Q3=A  
**Depends on**: U-UI-01 COMPLETE (merge + `UiConfigService`); U-UI-02 COMPLETE (chrome gates)

---

## Code organization (brownfield) — Q3=A

```text
src/app/
  core/ui-config/
    ui-features.types.ts              # REUSE UiFeatures / UiFeaturesPartial
    merge-ui-features.ts              # REUSE mergeUiFeatures
    ui-config.service.ts              # REUSE global bootstrap only (no [ui] write)
    ui-effective.token.ts             # NEW UI_EFFECTIVE_FEATURES InjectionToken
    effective-ui-reader.ts            # OPTIONAL createEffectiveUiReader(featuresSignal)
  features/shell/
    shell-layout.component.ts         # EXTEND: ui input(); effective computed; provide token; region @if
    top-bar.component.ts              # EXTEND: inject effective token (fallback global)
    chrome-shortcuts.directive.ts     # EXTEND: Save gate via effective
  features/agent/
    agent-skills-shell.component.ts   # EXTEND: same ui + token pattern
  features/canvas/
    zoom-controls.component.ts        # EXTEND: action flags via effective
    canvas-viewport.component.ts      # EXTEND: overlay flags via effective

docs/
  workflow-builder-ui-embed.md        # EXTEND: [ui] section + precedence
README.md                             # EXTEND: pointer to embed [ui] API
```

No new Angular project. No `core/ui-config/effective/` subfolder (Q3≠B). Global `UiConfigService` stays bootstrap-only.

---

## Unit Catalog

### U-HUI-01 — Host UI chrome inputs

| Field | Value |
|---|---|
| **Id** | `u-hui-01-host-ui-inputs` |
| **Stories** | US-HUI-01, US-HUI-02, US-HUI-03, US-HUI-04 |
| **Responsibility** | `input<UiFeaturesPartial \| undefined>()` on both shells; shell-local `effectiveFeatures = merge(global, ui() ?? {})`; provide `UI_EFFECTIVE_FEATURES`; TopBar / ChromeShortcuts / ZoomControls / CanvasViewport inject token with fallback to global; reactive updates; no global service mutation; embed + README; PBT on instance merge |
| **Primary components** | `ShellLayoutComponent`, `AgentSkillsShellComponent`, `UI_EFFECTIVE_FEATURES`, TopBar, ChromeShortcuts, ZoomControls, CanvasViewport, embed markdown |
| **Depends on** | U-UI-01 (`mergeUiFeatures`, `UiConfigService`); U-UI-02 chrome gates |
| **Out of scope** | Changing JSON/provider order; mutating `loadStatus` per instance; deprecating `provideWorkflowBuilderUi`; palette inputs; new deployable |
| **Internal order** | token (+ optional reader) → shell `ui` + effective + provider → child inject updates → agent shell parity → embed/README → unit + PBT tests |
| **PBT** | Partial — instance `[ui]` merge over resolved features (NFR-HUI-01 / Q10=B) |
| **Done when** | US-HUI-01..04 AC pass; omit = U-UI-02 behavior; `[ui]` wins leaves; isolation (no global write); both shells; docs; `npm test` green |

---

## Construction Rule

After Units Generation approval, CONSTRUCTION runs **U-HUI-01** (Functional Design → Code Generation → Build and Test), then Operations placeholder.
