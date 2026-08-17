# Business Rules — U-LIM-01 Host logic extras + agent metadata

---

## BR-LIM-01 — Extra logic cards (FR-LIM-01, US-LIM-01)

Host `[palettes]` MAY contain multiple items with type `Condition`, `Decision`, or `Repeater`. Required: non-empty `key` and `label`; type in `ALLOWED_NODE_TYPES`. Unknown types dropped (existing).

## BR-LIM-02 — Featured replace (FR-LIM-02, Q2=A)

`hostPalettesPresent` = overlay is a defined array **and** sanitized length &gt; 0.

| Binding | Featured strip |
|---|---|
| Omit `[palettes]` | First-of-type built-in Condition, Router, Repeater (allow-list) |
| `[palettes]="[]"` | Empty-remote; strip hidden (U-HPI) |
| Non-empty items | All remaining Condition/Decision/Repeater in catalog order; static three omitted from compose |

Skills shell uses the same rule.

## BR-LIM-03 — Icon URL allowlist (FR-LIM-05, Q1=A, SECURITY-05)

`sanitizeIconUrl` accepts:

- `https:` URLs
- Relative: starts with `/` or `./`, no scheme, no `//`, no `../`
- Raster `data:image/png`, `jpeg`, `jpg`, `gif`, `webp` only

Reject: `javascript:`, `http:`, `file:`, protocol-relative `//`, `data:image/svg+xml`, other `data:`, empty, non-strings.

Invalid → treat as absent (FR-LIM-06). Never bind raw unsanitized strings to `img src`.

## BR-LIM-04 — Icon precedence (FR-LIM-03, FR-LIM-04)

Library only (featured, default-agent, list rows):

1. Sanitized `iconUrl`  
2. Non-empty `iconPath` (SVG `d`, Q4=A; no innerHTML)  
3. Type glyph  

Canvas and Properties do not show host icons.

## BR-LIM-05 — Image error (Q5=A, SECURITY-15)

On `<img>` error, add item `key` to a failed set. That row uses the type glyph until `iconUrl` changes.

## BR-LIM-06 — Metadata (FR-LIM-07..09, Q3=A)

- Copy only plain objects (not array, not null).  
- Shallow `{ ...obj }` at sanitize and at drop.  
- Do not render keys in the library.  
- Keep `taskMeta` the same way on palettes.  
- No Properties editor for arbitrary keys.

## BR-LIM-07 — JSON defaultAgents (FR-LIM-03, FR-LIM-09, Q7=A)

`normalizeDefaultAgentCards` keeps optional `iconUrl`, `iconPath`, `metadata`. Last-key-wins unchanged. Host palettes: no new key dedupe.

## BR-LIM-08 — Docs (FR-LIM-10)

Embed guide: extra logic cards, replace rule, icon fields, metadata. No access tokens. Try host may demo (gitignored).

## BR-LIM-09 — PBT (Q6=A, NFR-LIM-04)

See Testable Properties in `business-logic-model.md` (P-LIM-01..05).
