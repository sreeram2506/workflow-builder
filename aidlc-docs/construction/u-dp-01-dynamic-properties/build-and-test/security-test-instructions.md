# Security Test Instructions — U-DP-01

## Checks (this increment)

- Property labels/values not bound as HTML
- Unknown widgets remain disabled text
- Embed/try docs contain no access tokens or Enso-specific public API names
- Malformed `properties` coerced to `{}` without crashing the panel

## Automated
Covered by unit/component specs + PBT Partial on pure helpers. No separate scanner job in this stage.

## Manual
Spot-check Properties with object values (read-only JSON) and Add-property chrome off by default.
