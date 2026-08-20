# Requirements — Dynamic Properties

## Intent Analysis Summary

| Field | Value |
|---|---|
| **User request** | Dynamic property configuration/rendering: static + fully dynamic; Dynamic Property component; host-supplied config; no Enso-specific names |
| **Request type** | Enhancement (brownfield) — extends U-HP-01 |
| **Scope** | Domain types/resolve, Dynamic Property component, right-sidebar, UI chrome flag, embed docs, try host demo |
| **Complexity** | Moderate |
| **Requirements depth** | Standard |
| **Increment name** | Dynamic Properties |
| **Answers** | Q1=B · Q2=A · Q3=no exclude · Q4=B · Q5=C · Q6=A · Q7=B · Q8=A · Q9=A · Q10=B · Ext=A/A/B · F1=A · F2=B · F3=A · F4=A |

See `dynamic-properties-intent-analysis.md`, `dynamic-properties-requirement-verification-questions.md`, `dynamic-properties-requirement-follow-up-questions.md`.

---

## 1. Goals

1. Selected-node configuration values live in `node.data.properties` as `Record<string, unknown>` — no hardcoded application property keys in the library.
2. Hosts supply UI definitions via existing `propertiesSchema` (palette / `node.data`) and `provideWorkflowBuilderUi({ properties })`, same pattern as agents/palettes.
3. Known keys use schema metadata; remaining keys use a **Dynamic Property** control with type inference.
4. New host properties/nodes work without library changes.
5. Edits write back through existing `patchNode` / document updates (no new shell output).
6. Public API and docs stay vendor-neutral (no Enso-specific names or logic).

---

## 2. Locked decisions

| Topic | Choice |
|---|---|
| Value map | `node.data.properties: Record<string, unknown>` |
| Schema vs dynamic | **Extend** U-HP-01: schema preferred for known keys; remaining map keys inferred |
| Reserved keys | No library reserved-key filter inside the map — show all keys in `properties` |
| Inference | string→text, number→number, boolean→toggle; empty/undefined→text; other→read-only JSON textarea |
| Add property | Only when `propertiesPanel.addProperty === true` (default `false`) |
| General | Always above configuration (label / subtitle / status) |
| Logic built-ins | Always apply for Condition / Router / Repeater; dynamic keys are additional |
| Built-in vs same dynamic key | Built-in wins; omit that key from the dynamic list |
| Schema value binding | Schema fields bind to `node.data.properties` (path relative to that map) |
| Host supply | Palette `propertiesSchema` + `provideWorkflowBuilderUi({ properties })` only (no new instance input) |
| Host notify | `patchNode` / graph document only — no `propertiesChange` output |
| Delivery slice | Full edit + Save write-back in one unit (minimal Dynamic Property component) |
| Extensions | Security Yes; Resiliency Yes (DR N/A for this library SPA increment); PBT Partial |

### Panel section order (selected node)

1. **General** (always)
2. **Built-in configuration** when node type is Condition / Router / Repeater (existing built-in schemas; paths remain as today on `node.data`)
3. **Host / dynamic configuration** from resolved schema + remaining `node.data.properties` keys

### Resolve notes (vs U-HP-01 first-win)

- Host `propertiesSchema` / adapter still supply field **metadata** (labels, control types, options).
- **Values** for host/dynamic fields read and write `node.data.properties` (not arbitrary top-level `node.data` paths), per F4=A.
- Built-in logic fields continue to use their existing `node.data` paths; keys that collide with those built-in field ids are omitted from the dynamic list (F2=B).
- Keys covered by the active host schema are rendered once via schema controls (bound into the properties map); they are not duplicated in the inferred dynamic list.

---

## 3. Functional requirements

### FR-DP-01 — Properties value map

- On Save of host/dynamic fields, persist into `node.data.properties`.
- Missing map: treat as `{}` for read; create on first write if needed.
- Do not require a fixed set of property keys in library code.

### FR-DP-02 — Dynamic Property component

- New reusable component renders one property (label + control) from:
  - optional metadata (type, label, options, …), or
  - inference from current value (FR-DP-03).
- Right-sidebar SHALL use this component for inferred (and optionally schema-backed) dynamic fields.
- Unknown / non-built-in widget ids remain disabled text (U-HP-01 behavior); do not execute host HTML/JS.

### FR-DP-03 — Inference

| Value | Control |
|---|---|
| `string` | text |
| `number` | number |
| `boolean` | boolean toggle |
| `null` / `undefined` / missing | text (empty) |
| object / array / other | read-only JSON textarea |

### FR-DP-04 — Schema + remaining keys

- Resolve host schema as today (palette `propertiesSchema` → provider adapter).
- For each visible schema field: bind control to `node.data.properties` at `field.path` (relative to the map).
- After schema fields, list remaining keys in `node.data.properties` not covered by schema (and not omitted per built-in collision), each via Dynamic Property + inference.

### FR-DP-05 — Built-ins + dynamic

- Condition / Router / Repeater always show built-in configuration sections when applicable.
- Dynamic/host sections are additional below.
- If a key in `node.data.properties` matches a built-in field identity used by that type, omit it from the dynamic list (built-in wins).

### FR-DP-06 — Add property (chrome-gated)

- Extend `PropertiesPanelFeatures` with `addProperty: boolean` (default `false`).
- When true: UI to add a new key (+ initial value) into `node.data.properties`.
- When false: edit existing keys only.
- Wire through existing UI normalize / `provideWorkflowBuilderUi` chrome merge.

### FR-DP-07 — Save / write-back

- Properties Save continues to call `facade.patchNode` (or equivalent) updating General fields and `data.properties`.
- No new EventEmitter / output for property changes in this increment.
- Hosts observe document/facade as today.

### FR-DP-08 — Vendor neutrality

- No Enso-specific types, field names, or docs in the library public surface.
- Consuming apps may map their domain into `properties` + `propertiesSchema` outside this package.

### FR-DP-09 — Docs and try host

- Update `docs/workflow-builder-ui-embed.md` for `node.data.properties`, binding rule, inference, and `propertiesPanel.addProperty`.
- Extend try/demo host with at least one example of schema + extra dynamic keys (and optional add-property flag).

---

## 4. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-DP-01 Security | Do not interpret opaque blobs; no HTML injection from property values/labels; sanitize control binding; no secrets in logs; vendor-neutral API (SECURITY applicable to new UI code; infra SECURITY-01/02/04 largely N/A for this library-only change) |
| NFR-DP-02 Resiliency | Invalid schema fields skipped without crashing panel; malformed `properties` coerced safely; DR/RTO/RPO **N/A** (in-memory SPA library, no new persistence tier) |
| NFR-DP-03 PBT (partial) | Property tests for pure helpers: inference mapping, “remaining keys” filter, schema path bind round-trip into `properties` map |
| NFR-DP-04 Compatibility | Document that host/dynamic values move to `node.data.properties`; hosts previously writing schema values at top-level `node.data` paths MUST migrate |
| NFR-DP-05 UX | General always visible; panel remains usable with empty `properties` |

---

## 5. Out of scope

- New shell `[properties]` / `[propertiesConfig]` instance input
- Live custom widget component registry
- New `propertiesChange` output event
- Migrating built-in Condition/Router/Repeater values into `properties` map
- Enso-specific adapters inside this package
- Changing connection/canvas/agent-library behavior unrelated to Properties

---

## 6. Acceptance criteria (summary)

1. Host can drop a node with `propertiesSchema` + seed `properties` values; panel edits bind to the map and Save persists via `patchNode`.
2. Extra keys in `properties` without schema metadata appear with inferred controls and are editable (except read-only JSON types).
3. Condition/Router/Repeater still show built-ins; colliding dynamic keys are hidden from the dynamic list.
4. `propertiesPanel.addProperty` default off; when on, user can add a key to the map.
5. Embed docs + try host demonstrate the contract without Enso naming.
6. Unit/PBT coverage for inference and key-filter helpers.

---

## 7. Extension compliance (Requirements stage)

| Extension | Status | Notes |
|---|---|---|
| Security Baseline | Compliant for scope | Documented XSS/input constraints; most cloud/infra rules N/A |
| Resiliency Baseline | Compliant / N/A DR | Directional UI resilience; RTO/RPO/DR N/A for library increment (same stance as U-HP-01 / U-HE-01) |
| PBT Partial | Compliant intent | Pure + serialization/round-trip helpers identified for Construction |
