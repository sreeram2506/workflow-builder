# U-DP-01 — Round 9 (unified General)

**User request:** No separate General vs Library defaults. Show only library properties under a **General** section; by default Name + Description; Name = label value; host can add more sections.

## Resolution (2026-08-20)

1. Package library section title is **General** (`name`, `description` only).
2. Removed hardcoded Label / Subtitle / Status block from the Properties panel.
3. Name is seeded from palette `label` and Save writes Name → `node.label` (+ `properties.name`); Description ↔ subtitle.
4. Host still adds sections via `propertiesSchema` / `properties` / `[properties]`.
5. Resolve always merges General with host schema (host fields never replace Name/Description).
6. Try-host samples default to General-only; `host-extra-props` demos consumer-added fields.
