# More Changes R41 — Change Requests (direct implement)

**Source**: user follow-up + shared sync image  
**Ask**: keep **exactly** the same Repeater shape as the reference image (not a different interpretation)

## Rules

- [x] Dual thick CW arrows with 180° rotational symmetry
- [x] Rounded stroke tails (`stroke-linecap="round"`)
- [x] Wide triangular tips (slightly wider than body); top tip → right, bottom tip → left
- [x] Clear gaps between each tip and the opposite tail
- [x] Theme accent color only (no purple/blue gradient from image)

## Notes

- File: `workflow-node.component.ts`
- Hard-refresh local app after pull
