# Workflow Builder

Angular workflow builder (Units U1–U9) — frontend-only, mock/in-memory data.

## Stack
- Angular **20** (latest CLI that runs on this machine’s Node 22.21.1; Angular 22 requires newer Node)
- Standalone components + signals
- `@angular/cdk` drag-drop (palette)
- `@angular/forms` reactive forms (Properties)
- Custom SVG + HTML canvas (no graph libraries)
- CSS design tokens (light/dark; default dark)
- Vitest via `@angular/build:unit-test`
- `fast-check` for property-based smoke tests

## Run
```bash
npm install
npm start
```
Open the URL printed by `ng serve` (usually http://localhost:4200).

```bash
npm test
npm run build
```

## Phase 1 scope (U1)
- Floating top bar, Nodes Library / Properties overlays
- Theme toggle (session-only — **refresh resets to dark**)
- In-memory seed: 5 nodes / 4 edges
- Theme toggle (session-only — **refresh resets to dark**)

## Phase 2–3 scope (U2)
- Pan: left-drag empty canvas (also middle-mouse / Space+drag), wheel zoom (0.25–2.0), dotted grid
- HTML node cards + bezier SVG edges (port-attached)
- Selection, Shift multi-select, Shift+drag marquee
- Node drag (multi-move), minimap, zoom controls
- Session-only viewport (lost on refresh)

## Phase 4 scope (U3)
- Categorized Nodes Library (Flow / Logic / Integration / AI) with search
- CDK drag from palette onto canvas (or click / Enter / Space to add at viewport center)
- `createNode` selects the new node; sole selection auto-expands Properties (U5)

## Phase 5 scope (U4)
- Drag from **right (source)** handle to **left (target)** handle to create edges
- Invalid connections show red preview only (self-loop / wrong target)
- Escape cancels draft; Delete removes focused waypoint or selected edge(s)
- Multi-waypoint reshape (double-click edge to add; 16px grid snap)

## Phase 6 scope (U5)
- Schema-driven Properties panel (XPMS-style descriptors; reactive forms)
- General: label / subtitle / status; Configuration: one boolean mock per type **or** full flattened `data.ensoTask` fields when present
- Connection (edge) Properties: read-only id/source/target + editable label
- Explicit **Save** → `patchNode` / `patchEdge`; unsaved edits discarded on focus change
- View mode: form disabled (US-6.2 readiness)
- Nodes Library: host `[palettes]` overlay, optional catalog adapter, or empty-remote when omitted
- Omit `[palettes]` with no adapter: empty Agents / Skills library (`palette-empty-remote`). Nested Developed-skills uses the same `[palettes]` when composed. Repeater Properties has no dummy workflow catalog.

## Phases 7–8 scope (U6)
- **Layout ▾**: Vertical / Horizontal / Layered (hand-rolled; no layout libs)
- **Route edges**: medium obstacle-aware grid routing; replaces waypoints
- Applying layout also routes once, then fit-to-content
- Fallback notice via non-error canvas status when some edges use simple paths
- Env knobs: `routingGridSize`, `routingObstaclePadding`

## Phase 9 scope (U7)
- Export / Save download workflow JSON (`schemaVersion: 1`)
- Import via file picker or paste (replaces document; invalid keeps prior state)
- Debounced in-memory autosave status (500 ms); **refresh still clears**
- Undo / Redo (document snapshots, cap 100); copy/paste selected subgraph
- Shortcuts: ⌘/Ctrl+Z / Shift+Z / Y / C / V / S

## Phase 10 + View Mode (U8)
- **Run** simulation: BFS from Trigger ∪ indegree-0; sequential `running` → `success` (400 ms/step; reduced-motion ≤50 ms)
- **Stop** cancels timers (statuses left as-is); **Reset** clears statuses to idle
- View/edit toggle + **View** indicator; Run allowed in view; mutating locked
- Polite `aria-live` announcements; status patches skip undo history
- Env: `runStepDelayMs` (default 400)

## Phase 11 scope (U9)
- Condition Properties: General + required expression; outgoing edges labeled `true`/`false` (max 2, silent reject)
- Router (`Decision`) Properties: General only; unique label vs other Routers/Repeaters
- Router connectors: Name + required condition on the edge; new edges start as `Blank Condition`
- Repeater: Workflow/Agent and Version pickers (empty until a host source exists); Pause; no dummy catalog
- Ignore Keys hidden on Condition / Router / Repeater
- Save-only persist (`patchNode` / `patchEdge`); view mode inspect-only

## Explicit limitations
- **No localStorage persistence of workflows**
- No real workflow engine / branch evaluation / backend run API

## UI configurability (embed)

Host apps can hide chrome regions and filter palette types via `provideWorkflowBuilderUi`, `/assets/wb-ui-config.json`, and Syncfusion-style instance inputs (`[ui]`, `[palettes]`, `[defaultAgents]`) on the shells.

- Embed API + flag table: [docs/workflow-builder-ui-embed.md](docs/workflow-builder-ui-embed.md)
- Try JSON examples locally: [docs/workflow-builder-ui-config-try.md](docs/workflow-builder-ui-config-try.md)

## Project layout
```
src/app/core/          # stores, facade, domain, history, run, seed, canvas scheduler
src/app/features/shell/
src/app/features/theme/
src/app/features/canvas/
aidlc-docs/            # AI-DLC documentation only
```
