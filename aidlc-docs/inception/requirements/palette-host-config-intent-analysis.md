# Intent Analysis — Host Palette, Default Agents, Extra Catalog APIs

**Date**: 2026-08-17  
**Increment**: Palette / catalog host config (v1)  
**Requirements depth**: Standard  

## User request (raw)

Parent/host repos should control which built-in nodes appear (Condition, Router, Repeater, Blank Agent), independently at solution vs skills canvas; rename or supply multiple default agents; and connect extra APIs to list agents or skills.

## Classification

| Field | Value |
|---|---|
| **Clarity** | Incomplete — intent clear, API and config shape not specified |
| **Type** | New Feature / Enhancement (brownfield) |
| **Scope** | Multiple components (palette catalog, left sidebar, ui-config, Enso HTTP, host provider) |
| **Complexity** | Moderate–Complex |

## How it works today (code)

**Solution Agents Library** (`paletteScope=solution`): featured strip = Condition, Router (type `Decision`), Repeater; plus static **Blank Agent**; plus Enso `/api/canvas/pipeline/list` (or mock agents if auth/list fails).

**Skills Library** (`paletteScope=agent`): same featured logic shapes; Enso `/api/canvas/task/list` mapped as Action-like skills; static `PALETTE_ITEMS` as fallback.

**Chrome flags** (`provideWorkflowBuilderUi` / `wb-ui-config.json`) can hide the whole Agents or Skills **library**, not individual node types. Agent **label** is hardcoded `"Blank Agent"`. Extra catalog URLs are not a host API — Enso URLs live in `environment.ts`.

## Gaps vs request

1. No per-type show/hide for Condition / Router / Repeater / Blank Agent.
2. No host list of default agents (rename or 2+ static agents).
3. No injection point for additional agent/skill HTTP APIs (only built-in Enso + mocks).
