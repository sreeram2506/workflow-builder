# Intent Analysis — Host logic extras + agent metadata

| Field | Value |
|---|---|
| **User request** | Extra Condition / Router / Repeater cards with icons; default agents support metadata besides label |
| **Request type** | Enhancement (brownfield) |
| **Scope** | Multiple components: palette types, host sanitizers, featured strip, default-agent mapping, node factory, library UI, embed docs, try harness |
| **Complexity** | Moderate |
| **Requirements depth** | Standard |
| **Clarity after Q1–Q12** | Clear — no contradictions |
| **Answers** | Q1=A · Q2=B · Q3=C · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A · Q9=A · Q10=A · Q11=A · Q12=B |

## Locked decisions

| ID | Decision |
|---|---|
| Q1 | Extra Condition / Router / Repeater cards (same type, different key/label/icon). Featured strip may exceed three shapes |
| Q2 | When host `[palettes]` is present, host logic cards **replace** the three built-ins. Show every host Condition / Router / Repeater. Static three appear only if the host included them |
| Q3 | Both `iconUrl` and `iconPath`; `iconUrl` wins when both are set |
| Q4 | Icons in the **library only** (featured strip, default-agent cards, list rows). Canvas nodes unchanged |
| Q5 | Metadata on `[defaultAgents]` **and** host `[palettes]` (including extra logic cards) |
| Q6 | Optional `metadata?: Record<string, unknown>` (plain object). Keep / copy `taskMeta` when present |
| Q7 | Copy onto `node.data` on drop (`data.metadata`, `data.ensoTask` from `taskMeta`). No Properties editor for arbitrary keys |
| Q8 | Missing / invalid icon → today’s type glyph |
| Q9 | Allow `https:` and same-origin relative paths. Reject `javascript:`, `data:` except `data:image/*`. Broken URL → Q8 |
| Q10 | Security Baseline **Yes** |
| Q11 | Resiliency Baseline **Yes** (directional; this increment has no new deployable backend / DR surface) |
| Q12 | PBT **Partial** (pure sanitizers / mapping) |
