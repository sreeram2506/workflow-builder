# Frontend Components Summary — U1

## Created
- Floating **Nodes Library** (left): full-height overlay panel + collapsed chip; mock catalog rows; Templates disabled
- Floating **Properties** (right): matching overlay panel + chip; mock grouped fields (readonly); API/schema later
- Floating **top bar** over canvas (reference-style): logo, icon tools (undo/redo/save/run disabled), centered `Drafts / title`, theme sun/moon, read-only + overflow placeholders
- Canvas host (grid placeholder); `ThemeToggleComponent` file retained but theme control lives in top bar

## Catalog (library mock)
Trigger, Action, Delay, Condition, Decision, Notification, AI Agent, End

## Change requests
- Round 1: Nodes Library chip/panel vs docked sidebar
- Round 2: full panel height; Properties same layout; mock data both sides; catalog expanded
- Round 3: header/icons match Workflow Builder floating app bar; side panels offset below header

## Tests
- `app.spec.ts` checks `Drafts /`, title, Nodes Library, Properties, canvas hint
