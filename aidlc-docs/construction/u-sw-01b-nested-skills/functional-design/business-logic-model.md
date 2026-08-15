# Business Logic Model — U-SW-01b Nested Agent Skills

**Unit**: `u-sw-01b-nested-skills`  
**Stories**: US-SW-02, US-SW-03, US-SW-04, US-SW-05

---

## Capability overview

1. **Navigate nested** — Selecting an open agent tab routes to `/agent/:nodeId` with dedicated nested shell (skills catalog + selected list + Properties).
2. **Mock skills** — Static catalog of 5 developed skills; add to `AIAgent.data.skills` (dedupe by `skillId`).
3. **Persist** — Skills live on the agent node; survive Back / re-enter in-session via document state.
4. **Back** — Top bar Back → `/`, keep tabs, select/focus that Blank Agent.
5. **View mode** — No add/remove skills; Properties read-only; Back still available.

---

## Primary flows

### F1 — Open nested via tab

```text
Author has agent tab (01a) → click tab
  → Router.navigate(['/agent', nodeId])
  → Nested shell: catalog | selected skills | Properties
  → Invalid nodeId → navigate ['/'] (+ optional canvasStatus)
```

### F2 — Add skill

```text
Edit mode → pick skill from catalog
  → if skillId already in data.skills → no-op (optionally focus that entry)
  → else append { skillId, name, description } to data.skills via facade patch
```

### F3 — Remove skill

```text
Edit mode → × on skill card → remove from data.skills
View mode → remove disabled
```

### F4 — Back

```text
Back → navigate ['/'] → keep OpenAgentTabs → selectNodes([nodeId]) + focus
```

### F5 — Properties selection

```text
No skill selected → Properties for AIAgent node (existing patterns)
Skill card selected → Properties for that skill entry (name/description; limited edit or read display per schema)
```

---

## Out of scope

- Live Enso skills API  
- Nested workflow graph / Skill NodeType  
- Production route guards/auth  
