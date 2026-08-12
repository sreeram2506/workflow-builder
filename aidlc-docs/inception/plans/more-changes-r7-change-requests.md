# More Changes R7 — Change Requests (direct implement)

**Source**: `more-changes-r7-clarification-questions.md`  
**Answers**: Q1=A · Q2=A · Q3=A

## Port model

| Side   | Role   |
|--------|--------|
| right  | **output** |
| left   | input  |
| top    | input  |
| bottom | input  |

## Rules

- [x] **right → left/top/bottom** = valid (green)
- [x] **right → right** = invalid (not green; no edge)
- [x] Reverse drag **input → right** normalizes to output→input
- [x] Visual: output handle filled; input handles hollow
- [x] Body-drop prefers complementary ports
