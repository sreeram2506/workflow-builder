# More Changes R5 — Change Requests (direct implement)

**Source**: `more-changes-r5-clarification-questions.md`  
**Answers**: Q1=B · Q2=A · Q3=A  
**Reference**: workflowbuilder.io / React Flow–style connect UX

## Checklist

- [x] Larger handle hit targets + visible hover
- [x] Drop on/near node body snaps to nearest **compatible** port (in↔out)
- [x] Valid draft line snaps to target port (not floating cursor)
- [x] Keep port-side persistence + out→out / in→in still invalid

## Notes

- Start from any handle; release on the **card** (not only the tiny dot) to connect
- Compatible: out (`right`/`bottom`) ↔ in (`left`/`top`)
