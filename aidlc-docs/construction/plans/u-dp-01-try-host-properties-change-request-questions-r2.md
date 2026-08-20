# U-DP-01 — Change Request Questions (Round 2)

You selected **Request Changes** after the live-palette schema + seed-properties fix. Answer below so we can update before re-approval.

**Prior fix**: Properties prefers live `[palettes]` schema for `paletteKey`; palette `properties` seeds on drop; try-host samples enriched.  
**Live**: `/try-ui` → Catalog **Host properties** → drop **Host If (schema)** / **Timeout Action**

---

## Question 1
What still needs to change?

A) Schema fields still not showing (or wrong place) after drop / refresh — describe which card and field after [Answer]:

B) Seeded `properties` values missing or wrong in the panel

C) Dynamic / collision / Add-property behavior wrong

D) Try-host sample data only (add/remove/rename fields or cards)

E) Docs or UX hint wording only

X) Other (please describe after [Answer]: tag below)

[Answer]:C Why can't we pass configs like  [palettes]="palettes()"
          [defaultAgents]="defaultAgents() for properties

## Question 2
Where are you looking when it fails?

A) `/try-ui` with Catalog **Host properties**

B) `/try-ui` but a different Catalog preset

C) Full SPA `/` (not try-ui)

D) Embedded host outside this repo

X) Other (please describe after [Answer]: tag below)

[Answer]:A

## Question 3
Severity / scope?

A) Small fix (one field, copy, or sample tweak)

B) Behavior bug in Properties / factory / live schema

C) Broader redesign of how schema is supplied

X) Other (please describe after [Answer]: tag below)

[Answer]:A

---

## Resolution (2026-08-19 Round 2)

Added instance **`[properties]`** on `wb-shell-layout` / `wb-agent-skills-shell` (peer of `[palettes]` / `[defaultAgents]`):

- Map keyed by `paletteKey`, or `{ schemaFor(node) }`
- First-win: live palette schema → instance `[properties]` → node snapshot → DI adapter
- Try-host: **Via `[properties]` input** card + `SAMPLE_HOST_PROPERTIES_BY_KEY`
- Docs: `docs/workflow-builder-ui-embed.md`
