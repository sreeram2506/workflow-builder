# U-DP-01 — Change Request Questions (try-host / properties test data)

You selected **Request Changes** after the “where to add properties test data” guidance. Answer below so we can update the code before re-approval.

**Likely touchpoint**: `src/app/try/try-ui-host.component.ts` → `SAMPLE_HOST_PROPERTIES_PALETTES`  
**Live**: `/try-ui` → catalog **Host properties**

---

## Question 1
What should we change?

A) Enrich existing sample palettes only (more `propertiesSchema` fields on Timeout Action / Host If / etc.)

B) Add one or more new mock palette cards with richer schemas

C) Also seed initial `node.data.properties` values when a palette item is dropped (factory/palette support)

D) A + B + C (richer samples, new cards, and seed values on drop)

E) Something else in Properties / right sidebar behavior (not just sample data)

X) Other (please describe after [Answer]: tag below)

[Answer]: The changes that you made are not working properly, beacuse i added a field in try-ui-host component which is note but it is not reflecting in UI

## Question 2
Which field / value scenarios should the samples cover? (pick the closest set)

A) More of the same types already shown (text, number, boolean, select, textarea)

B) Include extras that exercise **dynamic** (unschematized) keys — e.g. string / number / boolean / JSON read-only

C) Include a **built-in key collision** case (dynamic key omitted because Condition/Router/Repeater owns it)

D) B + C (dynamics + collision) plus more schema fields

X) Other (please describe after [Answer]: tag below)

[Answer]: X

## Question 3
Scope of the change?

A) Try-host samples only (`try-ui-host.component.ts`)

B) Try-host + copy `properties` from palette in `node.factory` (and types/docs)

C) Try-host + factory + short note in `docs/workflow-builder-ui-embed.md`

X) Other (please describe after [Answer]: tag below)

[Answer]: X

---

## Resolution (2026-08-19)

**Root cause**: Properties used the **drop-time snapshot** of `propertiesSchema` on the node. Editing `SAMPLE_HOST_PROPERTIES_PALETTES` did not update an already-selected / already-dropped node.

**Fix**:
- Prefer live `[palettes]` `propertiesSchema` for matching `paletteKey`
- Optional palette `properties` seed copied on drop
- Enriched try-host Host If / Timeout Action samples (incl. `note`)
- Docs updated; **313** tests passing
