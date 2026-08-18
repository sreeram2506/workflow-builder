# Requirements — Enter agent without tab bar

## Intent Analysis Summary

| Field | Value |
|---|---|
| **User request** | Enter nested agent by tab bar **or** double-click; both must work when the agent bar is hidden |
| **Request type** | Enhancement (brownfield) |
| **Scope** | Canvas dblclick, `openAgentTab` gating, nested-shell Back/Solution control |
| **Complexity** | Simple–moderate |
| **Requirements depth** | Standard |
| **Increment name** | Enter agent without tab bar |
| **Answers** | Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=B |

See `agent-enter-without-tabs-intent-analysis.md`.

---

## 1. Goals

1. Two ways into a Blank Agent / AIAgent nested canvas: **tab chip** (when the bar is on) and **double-click** the node (always, including when the bar is off).
2. When `agentTabs.enabled` is false, the user can still enter and **leave** the nested canvas in-app (not browser-only).
3. Do not invent hidden tab chips while the bar is off.
4. View mode still enters; edits stay blocked as today.

---

## 2. Locked decisions

| Topic | Choice |
|---|---|
| Enter | Chip click when `agentTabs.enabled`; double-click AIAgent on **solution** canvas always |
| Nested dblclick | Must **not** re-enter / nest another agent from inside `/agent/:id` |
| Single-click node | Does **not** navigate (unchanged) |
| Exit when bar hidden | Independent **Back / Solution** control on nested shell (not the tab strip) |
| Tabs on | Existing Solution chip on the strip stays |
| Tab state when bar off | Do **not** `openAgentTab` / add chips |
| View mode | Double-click / chip still enter; nested canvas remains read-only for edits |
| Extensions | Security Yes (new-code scoped); Resiliency Yes (directional, DR N/A); PBT Partial |

---

## 3. Functional requirements

### FR-AE-01 — Double-click enters

On the **solution** canvas, double-click of a node with `type === 'AIAgent'` SHALL navigate to `/agent/:nodeId` (same `selectAgentTab` / `enterAgentCanvas` path as today). This SHALL work when `agentTabs.enabled` is false.

Non-AIAgent double-click is unchanged (not this increment).

### FR-AE-02 — Tab bar still enters

When `agentTabs.enabled` is true and chips are shown, clicking an agent chip SHALL still enter that agent (`focusAgentTabChrome` → navigate). Solution chip still returns to the solution canvas.

### FR-AE-03 — No re-enter inside nested canvas

While `editingAgentNodeId` is set, double-click on a canvas node SHALL NOT call enter/navigate again.

### FR-AE-04 — Back without the tab strip

The nested agent shell SHALL show an in-app **Back / Solution** control that calls the existing `navigateBackToSolution` path. It SHALL be visible when `agentTabs.enabled` is false (and MAY also show when tabs are on, as long as it does not duplicate confusing chrome — prefer: show this control whenever the tab strip is **not** mounted).

The control MUST NOT depend on `agentTabs().length > 0`.

### FR-AE-05 — No hidden tabs when the bar is off

When effective `agentTabs.enabled` is false:

- Single-click / drop / create of an AIAgent SHALL NOT add tab chips (`openAgentTab` skipped).
- Double-click SHALL still navigate without requiring a chip.

When the host later sets `agentTabs.enabled` true, the strip behaves as today for **new** opens; leftover hidden tabs are not required.

### FR-AE-06 — View mode

Double-click and chip enter SHALL work in View mode. Nested graph edits remain blocked by existing view-mode guards.

### FR-AE-07 — Chrome flag unchanged

`agentTabs.enabled` remains the flag that shows or hides the **tab strip**. It SHALL NOT gate nested routing.

### FR-AE-08 — Embed / try (if touched)

If embed docs or the local try harness mention agent tabs, document that double-click still opens the agent when the bar is hidden, and that nested Back/Solution exists.

---

## 4. Non-functional

- No new HTTP, secrets, or host tokens.
- Invalid `/agent/:id` still redirects home (existing fail-safe).
- `npm test` / `npm run build` stay green. Existing Condition edges, Router connectors, `[palettes]`, Properties schema, chrome flags other than this behavior stay intact.

---

## 5. Out of scope

- Single-click enter (Q1 not C)
- Browser-only back (Q2 not B)
- Always showing a lone Solution chip as the only back path (Q2 not C) — independent control instead
- Live tab state while the bar is off (Q3 not B)
- Changing nested skills library, Properties schema, or palette overlay
- Committing `src/app/try/`

---

## 6. Success

- With `agentTabs.enabled: true`: chip enter + double-click enter both work; Solution chip returns.
- With `agentTabs.enabled: false`: double-click enter works; nested Back/Solution returns; no tab strip; no chips accumulated from select/drop.
- Nested canvas: no second enter on dblclick.
- View: still enters; cannot edit nested graph.
