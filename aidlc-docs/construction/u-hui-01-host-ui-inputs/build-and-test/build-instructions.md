# Build Instructions — U-HUI-01 Host UI chrome inputs

## Prerequisites
- **Node.js** + npm (project uses Angular 20)
- Repo root: `/Users/sreeram/ofcwork/workflow-builder`

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build
```bash
npm run build
```

### 3. Verify
- Output: `dist/workflow-builder`
- Acceptable warnings: initial bundle budget (~583 kB vs 500 kB); left-sidebar component style budget (~6 kB vs 4 kB)

## U-HUI-01 artifacts (no new assets)
- Code: `src/app/core/ui-config/` (token, reader, `mergeInstanceUiFeatures`)
- Shells: `shell-layout.component.ts`, `agent-skills-shell.component.ts`
- Docs: `docs/workflow-builder-ui-embed.md` (`[ui]` section)
