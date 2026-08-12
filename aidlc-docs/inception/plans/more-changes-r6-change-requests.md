# More Changes R6 — Change Requests (direct implement)

**Source**: `more-changes-r6-clarification-questions.md`  
**Answers**: Q1=A · Q2=A · Q3=A

## Problem

Dragging from **top** to another node’s **left / top / bottom** failed because ports were gated as in↔out only (`top` = in → could not land on `left`/`top`).

## Fix

- [x] Allow **any handle → any handle** on a different node
- [x] Body-drop snaps to **nearest** port (no role preference)
- [x] Keep `sourceSide` / `targetSide` persistence
- [x] Still reject self-loops / missing nodes only
