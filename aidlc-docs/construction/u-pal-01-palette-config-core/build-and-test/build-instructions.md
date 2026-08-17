# Build Instructions — U-PAL-01 Palette config core

## Prerequisites
- **Node.js** + npm (Angular 20)
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
- Acceptable warnings: initial bundle budget (~578 kB vs 500 kB); left-sidebar CSS budget (~6 kB vs 4 kB)

## U-PAL-01 notes
- No new HTTP or assets required. Palette rides the existing `/assets/wb-ui-config.json` initializer.
- Chrome `{}` defaults still show-all types and omitted `defaultAgents`.
