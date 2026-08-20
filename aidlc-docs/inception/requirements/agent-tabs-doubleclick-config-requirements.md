# Requirements — Agent tabs doubleClick config

## Intent Analysis Summary

| Field | Value |
|---|---|
| **User request** | Introduce double-click-to-enter-agent as a parent-passable UI config flag |
| **Request type** | Enhancement (brownfield) |
| **Scope** | UI feature map + canvas dblclick gate + embed/JSON examples |
| **Complexity** | Simple |
| **Requirements depth** | Standard |
| **Increment name** | More Changes R62 — `agentTabs.doubleClick` |
| **Answers** | Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A · Q9=A · Q10=B |

See `agent-tabs-doubleclick-config-intent-analysis.md`.

---

## 1. Goals

1. Let a **host parent** enable or disable canvas double-click enter of a Blank Agent / AIAgent via the same UI config merge as other chrome.
2. Keep **backward-compatible default**: omitted key → `true` (today’s always-on dblclick).
3. Keep `agentTabs.enabled` as **strip chrome only**; do not couple it to the new leaf.
4. Document the flag in embed docs and JSON examples. Do not put secrets in config.

---

## 2. Locked decisions

| Topic | Choice |
|---|---|
| Interaction gated | Canvas node double-click only (not chip dblclick) |
| Config path | `agentTabs.doubleClick` |
| Default | `true` |
| vs `agentTabs.enabled` | Independent leaves |
| Both false | No nested enter from builder UI |
| Host layers | Defaults → JSON → provider → instance `[ui]` (sticky like `agentTabs.enabled`) |
| Chip single-click | Unchanged; still enters when strip is on even if dblclick is off |
| Nested canvas dblclick | Still must not re-enter (U-AE-01 unchanged) |
| Extensions | Security Yes (blocking, new-code scoped); Resiliency Yes (directional; DR/topology N/A this increment); PBT Partial |

---

## 3. Functional requirements

### FR-DC-01 — Feature leaf

`UiFeatures.agentTabs` SHALL include boolean `doubleClick`. Path `agentTabs.doubleClick` SHALL appear in `UI_FEATURE_PATHS` so `is('agentTabs.doubleClick')` resolves.

Omit / unknown / non-boolean SHALL normalize like other chrome booleans (default `true` when the key is absent after merge).

### FR-DC-02 — Merge precedence

Resolution SHALL stay:

1. Built-in defaults (`doubleClick: true`)
2. `/assets/wb-ui-config.json`
3. `provideWorkflowBuilderUi({ features })`
4. Instance `[ui]` on `wb-shell-layout` / `wb-agent-skills-shell`

Instance overlay SHALL stay sticky onto a routed nested shell that omits `[ui]` (same as `agentTabs.enabled`).

### FR-DC-03 — Canvas double-click enter gated

On the **solution** canvas, double-click of `type === 'AIAgent'` SHALL call `selectAgentTab` / navigate to `/agent/:nodeId` **only when** effective `agentTabs.doubleClick` is true.

When effective `agentTabs.doubleClick` is false, that dblclick SHALL NOT navigate. Selection / drag behavior is unchanged.

### FR-DC-04 — Independent of strip chrome

`agentTabs.enabled` SHALL continue to show or hide the chip strip only.

| `enabled` | `doubleClick` | Enter from builder UI |
|---|---|---|
| true | true | Chip click and canvas dblclick |
| true | false | Chip click only |
| false | true | Canvas dblclick only (nested **Solution** Back as U-AE-01) |
| false | false | No nested enter from builder chrome |

### FR-DC-05 — Chip single-click unchanged

When the strip is mounted, clicking an agent chip SHALL still enter that agent even if `doubleClick` is false.

### FR-DC-06 — Nested canvas

While `editingAgentNodeId` is set, node double-click SHALL NOT enter another agent, regardless of `doubleClick`.

### FR-DC-07 — View mode

When `doubleClick` is true, view mode SHALL still enter (existing U-AE-01). Nested graph edits stay blocked. When `doubleClick` is false, view-mode dblclick SHALL NOT enter.

### FR-DC-08 — Embed / examples

`docs/workflow-builder-ui-embed.md` SHALL document `agentTabs.doubleClick`. Example JSON files that list chrome leaves SHALL include the key (`all-on` true, `all-off` false). Host still MUST register `{ path: 'agent/:nodeId', component: AgentSkillsShellComponent }` or enter has no nested shell.

Parent example:

```typescript
provideWorkflowBuilderUi({
  features: {
    agentTabs: { enabled: false, doubleClick: true },
  },
});
```

---

## 4. Non-functional

- No new HTTP, persistence, or host tokens.
- Do not log secrets, access tokens, or document payloads.
- Invalid UI config JSON still keeps last-good / defaults (existing fail-safe).
- `npm test` / `npm run build` stay green. Other chrome, palette, Properties, persist, and connection rules stay intact.

### PBT (Partial)

Merge/defaulting of the new boolean is in scope for invariant tests (absent key → true; explicit false wins; independent of `enabled`). No new serialization format.

---

## 5. Out of scope

- Chip double-click as a gesture
- New enter paths (context menu, Properties action) when both flags are false
- Changing nested Back / Solution chrome (U-AE-01 stays)
- Single-click node enter
- Publishing `enso-workflow-builder` (OTP carry-over; not this increment unless asked)
- Committing `src/app/try/`

---

## 6. Success

- Omit the key: canvas dblclick still enters (compat).
- `agentTabs.doubleClick: false`: canvas dblclick does not enter; chips still enter if the strip is on.
- `agentTabs.enabled: false` + `doubleClick: true`: dblclick enters; no chip strip; nested Back works.
- Both false: no enter from builder chrome.
- Nested canvas: no second enter.

---

## 7. Extension compliance (Requirements)

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-01 | N/A | No new data store |
| SECURITY-02 | N/A | No network intermediary |
| SECURITY-03 | N/A | No new production logger / centralized log service this increment |
| SECURITY-04 | N/A | No new HTML-serving endpoint |
| SECURITY-05 | Compliant | New leaf goes through existing JSON normalize (boolean / drop invalid) |
| SECURITY-06–10, 12–14 | N/A | No IAM, network, auth, supply-chain, or alerting change |
| SECURITY-11 | Compliant | Least surprise: default true; fail-safe invalid JSON → defaults |
| SECURITY-15 | Compliant | Invalid JSON / missing file keep defaults; dblclick false is explicit off not an error |
| SECURITY-07 secrets | Compliant | No secrets in feature map, examples, or embed docs |
| RESILIENCY-01 | Compliant | Workload: SPA chrome leaf; unavailability = host cannot gate dblclick (low) |
| RESILIENCY-02, 08, 11, 12 | N/A | No new persistent workload, RTO/RPO, or DR topology this increment |
| RESILIENCY-03–07, 09–10, 13–15 | N/A | No CI/CD, HA, or incident-process change this increment |
| PBT-02, 03, 07–09 | Compliant (Partial) | Document merge invariant; tests in construction |
| PBT-01, 04–06 | Advisory (Partial mode) | N/A or defer |
