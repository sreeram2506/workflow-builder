# Unit Test Execution — Solution Workflow

## Run Unit Tests

### 1. Execute All Unit Tests

```bash
npm test
```

(Uses `ng test --watch=false`.)

### 2. Review Test Results

| Metric | Latest (2026-08-15 U-SW-01b B&T) |
|---|---|
| Files | **21 passed** |
| Tests | **130 passed** / 0 failed |
| Report | Terminal output (Vitest via Angular builder) |

### Coverage areas (Solution Workflow)

- **U-SW-01a**: palette Blank Agent, agent tabs (`agent-tabs`, facade)
- **U-SW-01b**: agent graph swap, nested skills, pipeline mapper, Agents/Skills libraries, routes, chrome inset, save→saved

### 3. Fix Failing Tests

1. Read failing assertion / stack in terminal
2. Fix production or test code
3. Re-run `npm test` until green
