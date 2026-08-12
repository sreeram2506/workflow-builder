# Business Logic Model — U8 Simulated Run & View Mode

## Purpose
Mock Run walks the graph updating node status badges; View mode locks mutating controls while allowing inspect/navigation (and Run).

## Actors
- Workflow Author (P-AUTHOR)
- Workflow Reviewer (P-REVIEWER)

## Locked decisions

| Topic | Decision |
|---|---|
| Walk order | BFS from Trigger-type and/or indegree-0 seeds; each node once |
| Timing | Sequential: `running` → `success` with **400 ms** per node step |
| After run | Leave final statuses; **Reset statuses** control; new Run resets to `idle` first |
| View + Run | Run **allowed** in view mode (status only) |
| Concurrent | Run disabled while active; **Stop** cancels (statuses left as-is) |
| View UX | Enable top-bar view/edit toggle; clear **View** indicator |
| Locks | Mutating locked; allow pan/zoom/minimap/selection/theme/Export/Save-download/Run |
| Empty / no seeds | No nodes → `canvasStatus` “Nothing to run”; no start seeds → “No start node” and abort |
| Non-goals | No backend engine; no real branch evaluation; no run log persistence |

---

## Flow 1 — Simulated Run

```text
User clicks Run (edit or view)
  -> if simulation active: ignore (button disabled) 
  -> if nodes empty: canvasStatus “Nothing to run”; return
  -> compute BFS order from Trigger ∪ indegree-0
  -> if no seeds: canvasStatus “No start node”; return
  -> reset all node statuses to idle
  -> set runActive=true; enable Stop; disable Run
  -> for each node in order:
       set status running; wait 400ms; set status success
       (if Stop: clear timers; runActive=false; leave statuses; return)
  -> runActive=false; re-enable Run
```

---

## Flow 2 — Stop / Reset

```text
Stop: cancel pending timers; runActive=false; keep current statuses
Reset statuses: set all nodes idle (edit or view); no structural change
```

---

## Flow 3 — View mode enter / exit

```text
Toggle view:
  -> editorMode = 'view'; show View indicator; lock mutating chrome
Toggle edit:
  -> editorMode = 'edit'; unlock mutating chrome
  -> if run active, Stop behavior (cancel timers) optional — locked: Stop/cancel on mode switch
```

---

## Out of scope
- Real Condition/Decision evaluation
- Backend / engine APIs
- Persisted run history
