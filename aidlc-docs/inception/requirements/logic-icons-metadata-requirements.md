# Requirements — Host logic extras + agent metadata

## Intent Analysis Summary

| Field | Value |
|---|---|
| **User request** | Extra Condition / Router / Repeater with icons; agents support metadata besides default label |
| **Request type** | Enhancement (brownfield) |
| **Scope** | Palette catalog, host sanitizers, featured strip, default agents, node factory, left library, embed docs |
| **Complexity** | Moderate |
| **Requirements depth** | Standard |
| **Increment name** | Host logic extras + agent metadata |
| **Answers** | Q1=A · Q2=B · Q3=C · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A · Q9=A · Q10=A · Q11=A · Q12=B |

See `logic-icons-metadata-intent-analysis.md`.

---

## 1. Goals

1. Let a parent host supply **more than one** Condition, Router (`Decision`), and Repeater card, each with its own key, label, optional icon, and optional metadata.
2. When the host binds `[palettes]`, those logic cards **replace** the three built-in featured shapes (unless the host includes equivalent cards).
3. Let `[defaultAgents]` and host `[palettes]` carry **metadata** beyond `label` / `description`, and persist that metadata on the dropped node.

---

## 2. Locked decisions

| Topic | Choice |
|---|---|
| Extra logic cards | Yes — same `type`, different `key` / `label` / icon |
| Featured strip vs built-ins | Host `[palettes]` present → host Condition / Decision / Repeater replace static three |
| Icon fields | `iconUrl` and `iconPath`; URL wins if both set |
| Icon surface | Library only |
| Missing icon | Built-in type glyph (rhombus / router / repeater, or AIAgent path) |
| Metadata cards | Default agents **and** host palettes |
| Metadata shape | Optional plain object; also keep `taskMeta` |
| On drop | `node.data.metadata` + existing `node.data.ensoTask` from `taskMeta`; no Properties editor |
| URL allowlist | `https:` and same-origin relative; reject `javascript:`; `data:` only `data:image/*` |
| Extensions | Security Yes; Resiliency Yes (DR N/A); PBT Partial |

---

## 3. Functional requirements

### FR-LIM-01 — Extra logic cards on `[palettes]`

Host `[palettes]` MAY contain multiple items with `type` `Condition`, `Decision`, or `Repeater`. Each MUST have a unique `key` (existing last-key / sanitize rules). `label` is required. Unknown types remain dropped.

### FR-LIM-02 — Featured strip when host palettes are present

When `[palettes]` is **bound to an array of items** (non-empty after sanitize):

- Featured strip SHALL list **every** sanitized host item whose type is `Condition`, `Decision`, or `Repeater`, in catalog order.
- Built-in static Condition / Router / Repeater SHALL **not** appear unless the host included cards of those types.
- Count may be 0 (strip hidden or empty), 1, or many.

When `[palettes]` is **omitted**: keep today’s compose (static featured three plus Enso / adapter).

When `[palettes]="[]"`: keep today’s empty-remote behavior (featured and default agents hidden).

`wb-agent-skills-shell [palettes]` SHALL use the same featured-strip rule for that canvas.

### FR-LIM-03 — Icon fields

`PaletteItem` and `DefaultAgentCard` SHALL accept optional:

- `iconUrl?: string`
- `iconPath?: string` (SVG `d` for viewBox `0 0 24 24`)

If both are set and `iconUrl` sanitizes successfully, the library SHALL use the image. Otherwise use `iconPath` if non-empty. Otherwise FR-LIM-06 fallback.

JSON `palette.solution.defaultAgents` SHALL accept the same optional fields.

### FR-LIM-04 — Library icon rendering

Host icons SHALL appear only in:

- Featured logic strip
- Default-agent strip
- Solution agent list and skills list rows

Canvas node geometry and glyphs SHALL stay as today (no host image on the canvas). Properties panel SHALL not show a host icon this increment.

### FR-LIM-05 — Icon URL sanitization (SECURITY-05 / SECURITY-11)

A helper SHALL accept a URL only if:

- Scheme is `https:`, or
- Path is same-origin relative (`/…` or `./…` without a scheme), or
- `data:image/` with an allowed image subtype (no `data:text/html`, no `data:image/svg+xml` script vectors beyond treating SVG data as image — **reject `data:image/svg+xml`** to avoid script-in-SVG; allow raster `data:image/png`, `data:image/jpeg`, `data:image/gif`, `data:image/webp`)

Reject: `javascript:`, `http:`, `file:`, empty, other schemes, `data:` that is not an allowed raster image.

Invalid / rejected URL is treated as absent (FR-LIM-06). `<img>` SHALL use the sanitized string only (no raw host string).

### FR-LIM-06 — Icon fallback

If there is no usable icon, the library SHALL show today’s type glyph (logic preview SVGs in the featured strip; `iconPathForType` in card wells).

A broken image load SHALL fall back to the same glyph (do not leave a dead image).

### FR-LIM-07 — Metadata on host cards

`DefaultAgentCard` and `PaletteItem` SHALL accept optional `metadata?: Record<string, unknown>`.

Sanitize:

- Copy only if value is a plain object (not array, not null).
- Drop the field if missing or not a plain object.
- Do not stringify or render keys in the library.

`taskMeta` on host `[palettes]`, when a plain object, SHALL be copied (today it is dropped).

### FR-LIM-08 — Metadata on drop

`createWorkflowNodeFromPaletteItem` SHALL set:

- `data.paletteKey` (existing)
- `data.metadata` = shallow copy of item `metadata` when present
- `data.ensoTask` = shallow copy of `taskMeta` when present (existing)

Default-agent mapping SHALL pass `metadata`, `iconUrl`, and `iconPath` onto the palette item so drop sees them.

No new Properties fields for arbitrary metadata keys this increment.

### FR-LIM-09 — Host sanitizers preserve extras

`sanitizeHostPaletteItems` and `sanitizeHostDefaultAgents` (and JSON `normalizeDefaultAgentCards`) SHALL keep valid `iconUrl`, `iconPath`, `metadata`, and `taskMeta` (palettes only for `taskMeta`).

Do not put access tokens in examples or try-harness samples.

### FR-LIM-10 — Docs and try harness

Update `docs/workflow-builder-ui-embed.md` with icon + metadata examples and the featured-strip replace rule.

Local try host (gitignored) MAY demonstrate extra logic cards with icons and default agents with metadata.

### Out of scope (this increment)

- Canvas or Properties host icons
- Properties editor for metadata
- Changing node types / allowing unknown types such as `"Stream"`
- Live Enso skill icon APIs
- `http:` icon URLs

---

## 4. Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-LIM-01 | Sanitize helpers are pure; invalid rows/fields dropped, remainder canvas-safe |
| NFR-LIM-02 | SECURITY-05: icon URLs allowlisted; no `javascript:` / unsafe `data:` in `img src` |
| NFR-LIM-03 | Fail-safe (SECURITY-15): rejected or broken icon → type glyph; catalog still usable |
| NFR-LIM-04 | PBT Partial: sanitizer invariants (URL allowlist, metadata object-only, featured-strip replace when host palettes present) |
| NFR-LIM-05 | Existing unit tests stay green; add example + PBT coverage for new fields |
| NFR-LIM-06 | No secrets in docs/examples |

---

## 5. Extension compliance

| Rule | Status | Rationale |
|---|---|---|
| SECURITY-01 | N/A | No new data store |
| SECURITY-02 | N/A | No network intermediary |
| SECURITY-03 | N/A | No new production logger / centralized logs |
| SECURITY-04 | N/A | No HTML-serving endpoint changes |
| SECURITY-05 | Compliant (planned) | Icon URL + metadata type checks in sanitizers |
| SECURITY-06 | N/A | No IAM |
| SECURITY-07 | N/A | No network/firewall |
| SECURITY-08 | N/A | No new authenticated API |
| SECURITY-09 | N/A | No deploy hardening this increment |
| SECURITY-10 | N/A | No new dependencies planned |
| SECURITY-11 | Compliant (planned) | Misuse: `javascript:` / unsafe `data:` rejected |
| SECURITY-12 | N/A | No auth changes |
| SECURITY-13 | Compliant (planned) | Host JSON not deserialized as code; plain-object allowlist |
| SECURITY-14 | N/A | No new alerting |
| SECURITY-15 | Compliant (planned) | Invalid icon → glyph fallback |
| RESILIENCY-01..15 | N/A / directional | Client-side library increment; no new deployable workload, RTO/RPO/DR/CAB not applicable |
| PBT-02,03,07,08,09 | Compliant (planned) | Partial mode: sanitizer invariants + generators |
| PBT-01,04,05,06,10 | Advisory | Partial mode |

---

## 6. Success criteria

1. Host can bind several Condition / Router / Repeater `[palettes]` with icons; featured strip shows all of them and not the static three.
2. Omit `[palettes]` still shows the built-in three.
3. Default agents and palette cards accept `metadata`; dropped nodes include `data.metadata`.
4. Host `taskMeta` is no longer dropped; drop still sets `data.ensoTask`.
5. Unsafe icon URLs never reach `img src`; fallback glyph shows.
6. Embed guide documents the API. Tests (example + partial PBT) pass.
