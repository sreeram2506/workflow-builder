# Intent Analysis — Host palette inputs (Syncfusion-style)

**Increment**: Host component `[palettes]` / `[defaultAgents]`  
**Date**: 2026-08-17  
**User request (raw)**: "yes i want like that" (after asking to match Syncfusion `ejs-symbolpalette [palettes]="palettes"`)

## Request analysis

| Field | Value |
|---|---|
| Clarity | Clear intent; a few composition/precedence details open |
| Type | Enhancement / new host API on existing SPA |
| Scope | Shell (+ maybe skills shell), catalog wiring, embed docs |
| Complexity | Moderate — reuses U-PAL-01/02 helpers; new input surface |

## Intent

A **parent Angular component** should pass palette symbols the way Syncfusion does — property binding on the host tag — not only JSON allow-lists or `provideWorkflowBuilderUi` at bootstrap.

Today `"Stream"` in `palette.solution.types` cannot create a card. The parent must supply **items** (key, type, label, description).

## Existing code to reuse

- `PaletteItem` / `EnsoTaskCatalogService` catalog adapter
- `provideWorkflowBuilderUi({ catalog })` (provider-only adapter)
- `wb-shell-layout` / `wb-agent-skills-shell` (no palettes input yet)

## Out of scope (unless questions say otherwise)

- New canvas node type `Stream`
- Publishable ng library
- Changing chrome flags
