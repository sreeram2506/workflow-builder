# U-DP-01 — Round 10 Clarification (properties vs propertiesSchema)

**Q1 also asked:** do we need both `properties` and `propertiesSchema`, or can they be one?

**Today**
- `propertiesSchema` — field definitions (type, path, label, options, …) for the Properties panel
- `properties` — seed **values** written to `node.data.properties` on drop

They answer different questions (shape vs starting values). Combining them is optional convenience.

---

## Question 1
How should consumer config look for host-added fields?

A) Keep both `propertiesSchema` + `properties` as today (recommended; clearest)

B) Single `propertiesSchema` only — allow optional `default` on each field for seeds; deprecate separate `properties` (still accept `properties` for backward compat)

C) Single `properties` map only — infer controls from value types (lose labels/options/required unless we add a different API)

X) Other (please describe after [Answer]: tag below)

[Answer]: X

Use a single properties configuration map for host-defined properties. Each property entry should contain both its UI/schema metadata and its initial/default value, avoiding the need to maintain separate propertiesSchema and properties configurations. The package provides only name and description as built-in defaults; all other properties are supplied by the consuming application through this configuration. Each configured property can independently specify its type, label, default value, enabled/disabled state, options, required state, and other supported metadata.

I think this is much easier for consumers to understand than maintaining two separate objects that have to stay synchronized.

---

## Resolution (2026-08-20)

**Q1 = X (unified properties map).** Implemented `host-properties.config.ts`:
- Prefer `properties: { path: { type, label, value?, section?, enabled?, … } }`
- Expands to internal schema + seeds; legacy `propertiesSchema` + plain seeds still work
- Wired through sanitize, node factory, and live resolve
