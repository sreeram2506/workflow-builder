# Intent Analysis — Logic Node Properties (Condition / Router / Repeater)

## User Request (raw)

1. Prepare context from enso-suite for Condition, Router, Repeater (Router is not edge `routeEdges`).
2. Wire those three property panels and edge rules into workflow-builder.
3. **Do that through AI-DLC phases only** (no direct implement / More Changes shortcut).

## Request Clarity

**Clear intent, incomplete detail** — Source of truth (enso-suite) and the three node types are specified. Open: Repeater mock vs API, Condition expression UI, whether canvas edge rules ship in the same increment, and whether the locked v1 "Ignore Keys" field stays on logic nodes.

## Request Type

**Enhancement** of existing U5 Properties + U2 canvas connection behavior (brownfield increment).

## Scope Estimate

**Multiple components**: `properties.schema.ts`, right sidebar, edge panel, connection rules, possibly facade/store and tests.

## Complexity Estimate

**Moderate** — Known domain from enso-suite; existing schema-driven properties; locked v1 invariant (`assertRegistryV1Invariant`) must be relaxed or scoped for logic types.

## Recommended Requirements Depth

**Standard** — Clarifying questions required; not a new product.

## Constraints Already Confirmed

- workflow-builder `route` / `routeEdges` is orthogonal pathfinding, not the Router node
- workflow-builder type `Decision` displays as **Router**
- enso-suite behavior prepared in `.cursor/skills/enso-logic-nodes/`
- Frontend-only builder today: mock/in-memory, no backend
- U5 BR-U5-04 locked every type to one mock boolean; this increment changes that for logic nodes
- Edge properties already exist (label); original BR-U5-09 (no edge properties) was later superseded
- User requires full AI-DLC gates (Requirements -> Workflow Planning -> Construction). No code until approved.

## Reverse Engineering

**Skipped for this increment.** Original project was greenfield (2026-08-07). U1-U8 construction artifacts exist. No `aidlc-docs/inception/reverse-engineering/` folder. Full SPA reverse-engineering would not change the known architecture for this scoped enhancement.
