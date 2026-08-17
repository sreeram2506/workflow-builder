# Build Instructions — U-UI-01 Config Core

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
- Acceptable warnings: initial bundle budget (~569 kB vs 500 kB); top-bar / left-sidebar component style budgets

## U-UI-01 assets
- Active config: `src/assets/wb-ui-config.json` (default `{}`)
- Examples: `src/assets/examples/wb-ui-config.*.json`
- `angular.json` maps `src/assets` → `/assets`
