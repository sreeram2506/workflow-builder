# NFR Requirements — U2 Canvas Engine

## Scope
Unit U2 (pan/zoom/grid/minimap/zoom controls; HTML nodes + straight SVG edges; selection/marquee; custom node drag). Frontend-only; builds on U1 stack.

## Performance
| ID | Requirement |
|---|---|
| NFR-P-10 | Pan, zoom, and node-drag interactions must **feel smooth** on a mid-range laptop for the seed graph and graphs up to the design ceiling (NFR-S-10); **no formal FPS number** and **no CI FPS harness** |
| NFR-P-11 | High-frequency pointer moves should use `pointer` events + `setPointerCapture` where needed; batch position/viewport writes with `requestAnimationFrame` during drag |
| NFR-P-12 | Wheel zoom listeners should be **passive where safe** (when `preventDefault` is not required); if default must be prevented, document why and keep the handler non-passive only for that path |
| NFR-P-13 | No decorative pan/zoom animation required; if easing is added later in U2, respect `prefers-reduced-motion` by applying instant transforms (NFR-U-12) |

## Scalability
| ID | Requirement |
|---|---|
| NFR-S-10 | U2 may claim “responsive” behavior for graphs of **≤100 nodes**; seed remains ~5 nodes |
| NFR-S-11 | No multi-user or server scaling requirements; single-user local prototype |
| NFR-S-12 | Do not optimize for thousands of nodes in U2; virtualization / spatial indexes are out of scope |

## Availability / Resiliency
| ID | Requirement |
|---|---|
| NFR-A-10 | No uptime SLA; availability = app loads in supported browser |
| NFR-A-11 | DR / RTO / RPO remain **N/A** |
| NFR-A-12 | Viewport and graph mutations remain session-only (lost on refresh) — documented product limitation |

## Security
| ID | Requirement |
|---|---|
| NFR-SEC-10 | Security Baseline extension disabled; hygiene only |
| NFR-SEC-11 | No secrets in repo; no `innerHTML` for untrusted strings (labels from seed/store are app-controlled) |
| NFR-SEC-12 | No new third-party canvas/gesture packages in U2 |

## Usability / Accessibility
| ID | Requirement |
|---|---|
| NFR-U-10 | Zoom control buttons keyboard-operable with accessible names |
| NFR-U-11 | Nodes (and edges where hit-tested) are selectable with **visible** selection chrome; full keyboard pan/zoom map **not** required in U2 |
| NFR-U-12 | If any animated zoom/pan easing is introduced, honor `prefers-reduced-motion` with instant jumps |
| NFR-U-13 | Evergreen desktop browsers only (carry U1) |
| NFR-U-14 | No full WCAG 2.2 AA audit gate in U2 |

## Maintainability / Testing
| ID | Requirement |
|---|---|
| NFR-M-10 | Strict TypeScript + strict templates; feature folder `features/canvas` |
| NFR-M-11 | Unit tests via Vitest for viewport helpers, selection helpers, and key component smoke |
| NFR-M-12 | `fast-check` properties for **viewport math**: zoom clamp invariant + screen↔world round-trip (Partial PBT) |
| NFR-M-13 | Marquee intersection may use example-based tests in U2 (PBT expansion optional later) |

## Explicit Deferrals
- Formal FPS CI / Lighthouse canvas budgets → later or never for prototype
- Keyboard pan/zoom map → later a11y polish
- Smart routing performance → U6
- Serialize round-trip PBT → U7
- View-mode lock a11y → U8

## Locked answers
| # | Answer |
|---|---|
| Q1 | A — qualitative smoothness only |
| Q2 / C1 | B — ≤100 nodes |
| Q3 | B — pointer + capture + rAF; passive wheel where safe |
| Q4 | A — baseline a11y |
| Q5 | A — viewport math PBT |
| Q6 / C2b | A — no new library |
| Q7 | B — respect reduced motion if easing added |

## Extension Compliance (U2 NFR stage)

### Resiliency Baseline
| Rule area | Status | Notes |
|---|---|---|
| Criticality | Compliant | Low prototype |
| RTO/RPO/DR | N/A | Confirmed |
| HA / multi-region | N/A | No backend |
| Interaction reliability | Compliant | Pointer capture + rAF batching specified |

### PBT (Partial)
| Rule | Status | Notes |
|---|---|---|
| PBT-09 Framework | Compliant | `fast-check` already present |
| Zoom clamp / screen↔world | Compliant intent | Implement in Code Gen |
| PBT-02 serialize | Deferred | U7 |

### Security Baseline
| Status | Notes |
|---|---|
| Skipped | Extension disabled |
