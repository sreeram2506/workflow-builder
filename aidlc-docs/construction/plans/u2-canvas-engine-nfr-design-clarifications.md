# U2 NFR Design — Clarification (Q4 vs no-new-lib)

**Conflict:** NFR Requirements locked **C2b = A (no new npm library)**, but NFR Design Q4 answered **B** (DOM sanitizer library).

Fill `[Answer]:`, then reply in chat when done.

---

## Question C1
**How should we resolve node-label security for U2?**

A) **Hygiene only** (NFR Design Q4-A): Angular text bindings / interpolation; **no** sanitizer package; keeps “no new library”

B) **Re-open stack**: add a specific sanitizer package — write the **exact npm package name** after [Answer]: (I will not invent one)

C) Use Angular’s built-in `DomSanitizer` **only if needed**, still **no new package** (prefer bindings; no bypass APIs)

X) Other (please describe after [Answer]: tag below)

[Answer]: A

---
