# Round 11 resolution — XPMS `x_config` → Properties

## Decisions
- **Q1**: Consumer owns path mapping. Try-UI uses full `config_path` as the property path under `node.data.properties` (nested via package `setAtPath` on expand).
- **Q2**: Sections `Basic` / `Advanced`.
- **Q3**: `hidden: true` → omitted by converter (default `hidden` is false).
- **Q4**: Mapper lives in Try-UI only (`src/app/try/map-x-config-to-properties.ts`); package stays config-agnostic.
- **Q5**: Type mapping table accepted; later adjusted — `string` + `multi_select` without options → `text` (textbox), not `textarea`.

## Package support (generic, not XPMS-specific)
- Unified expand nests dotted path seeds with `setAtPath`.
- Dynamic remaining keys skip nested roots covered by dotted schema paths.
