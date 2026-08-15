# Integration Test Instructions — Solution Workflow

## Purpose

Validate U-SW-01a ↔ U-SW-01b interactions in the SPA (no separate backend test suite in this increment).

## Automated (in unit suite)

- Facade + domain specs cover tab open → navigate `/agent/:nodeId` → enter/exit nested graph
- `app.spec` boots shell with Agents Library + seeded canvas
- Pipeline / task mappers cover API→palette mapping used by sidebars

## Manual integration scenarios

### Scenario 1: Solution → nested agent → back

1. `npm start` (with proxy if using live Enso)
2. From **Agents Library**, add Blank Agent or an API/mock agent
3. Select agent → header chip appears; click chip or dblclick → `/agent/:nodeId`
4. Drag skills / logic nodes on nested canvas; click Solution chip or **← Back**
5. **Expected**: nested graph persists on re-open; solution graph unchanged

### Scenario 2: Agents Library API / mock fallback

1. With valid token + reachable `pipeline/list` → live agents listed
2. With auth miss or API failure → mock agents (Claims / Policy / Notify) appear; banner explains fallback

### Scenario 3: Save vs Export

1. Click **Save** → toast **Saved**, badge `saved`, no download
2. Click **Export** → JSON download still works

## Setup

```bash
npm start
# optional live Enso:
# ensure proxy.conf.json + environment token / workflow ids
```

## Cleanup

Stop the dev server; no external test containers required.
