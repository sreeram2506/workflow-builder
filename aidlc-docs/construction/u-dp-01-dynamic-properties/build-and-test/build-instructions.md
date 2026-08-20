# Build Instructions — U-DP-01 Dynamic Properties

## Prerequisites
- **Build Tool**: Angular CLI 20 / npm
- **Node.js**: v20.19+ or v22.12+ (Angular 20)
- **Dependencies**: `npm install` from workspace root
- **Environment**: No required secrets for this SPA increment

## Build Steps

### 1. Install Dependencies
```bash
cd /Users/trivenigogireddy/Work/workflow-builder
npm install
```

### 2. Build
```bash
npm run build
```

### 3. Verify Build Success
- **Expected**: `Application bundle generation complete`
- **Artifacts**: `dist/workflow-builder/`
- **Common warnings**: Initial bundle budget (~500 kB) may warn; left-sidebar CSS budget — accepted for this increment

## Troubleshooting

### Node version too old
- **Cause**: CLI refuses Node &lt; 20.19
- **Solution**: `nvm use 22` (or install Node 22 LTS), then re-run

### Compilation errors after pull
- **Cause**: Stale `node_modules` or incomplete install
- **Solution**: `rm -rf node_modules && npm install`
