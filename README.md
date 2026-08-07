# Workflow Builder

Angular workflow builder (Phase 1 / Unit U1) — frontend-only, mock/in-memory data.

## Stack
- Angular **20** (latest CLI that runs on this machine’s Node 22.21.1; Angular 22 requires newer Node)
- Standalone components + signals
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
- App shell: top bar, collapsible sidebars, canvas placeholder with dotted grid
- Theme toggle (session-only — **refresh resets to dark**)
- In-memory seed: 5 nodes / 4 edges (branch topology) loaded into GraphStore
- Undo/Redo/Save/Run buttons present but disabled

## Explicit limitations
- **No backend**
- **No localStorage** — workflow state does not survive refresh
- Canvas does **not** render/interact with nodes yet (Phase 2+)

## Project layout
```
src/app/core/          # stores, facade, domain, seed
src/app/features/shell/
src/app/features/theme/
src/app/features/canvas/
aidlc-docs/            # AI-DLC documentation only
```
