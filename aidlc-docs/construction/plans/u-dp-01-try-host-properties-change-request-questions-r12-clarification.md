# Round 12 resolution — Canvas / left-pane label polish

## Decisions
- **Q1**: G — freeform UI polish
- **Q2**: A — direct implement
- **Q3**: A — one pass

## Implemented
1. Hide canvas node status badge when `status === 'idle'` (running/success/error still show).
2. Multi-word labels use two-line clamp + ellipsis (canvas card, shape label, left-pane titles).
3. Left-pane agents/palette cards without `iconUrl` show first two letters via `initialsFromLabel` (same as canvas avatar).
