# Unit ↔ Story Map

All stories from `stories.md` are assigned. Phase 7–8 remain epic-level until gate questions expand them.

| Story | Title | Unit | Build phase |
|---|---|---|---|
| US-1.1 | Open application shell | **U1** | 1 |
| US-1.2 | See seeded mock workflow data | **U1** | 1 |
| US-1.3 | Toggle light and dark theme | **U1** | 1 |
| US-2.1 | Pan the canvas | **U2** | 2 |
| US-2.2 | Zoom the canvas | **U2** | 2 |
| US-2.3 | Use dotted grid background | **U2** | 2 |
| US-2.4 | Use minimap for navigation | **U2** | 2 |
| US-3.1 | View custom node cards on canvas | **U2** | 3 |
| US-3.2 | View edges between nodes | **U2** | 3 |
| US-3.3 | Select nodes and see highlight | **U2** | 3 |
| US-3.4 | Lasso / marquee select | **U2** | 3 |
| US-4.1 | Browse categorized palette | **U3** | 4 |
| US-4.2 | Drag node from palette to canvas | **U3** | 4 |
| US-5.1 | Connect nodes via handles | **U4** | 5 |
| US-5.2 | Reject invalid connections | **U4** | 5 |
| US-5.3 | Reshape edges with waypoints | **U4** | 5 |
| US-6.1 | Edit selected node via schema form | **U5** | 6 |
| US-6.2 | Inspect properties in view mode | **U8** (panel from U5; lock/inspect in U8) | 6+VM |
| US-E7 | Smart edge routing (epic) | **U6** | 7 |
| US-E8 | Auto-layout (epic) | **U6** | 8 |
| US-9.1 | Export workflow JSON | **U7** | 9 |
| US-9.2 | Import workflow JSON | **U7** | 9 |
| US-9.3 | Debounced in-memory auto-save | **U7** | 9 |
| US-9.4 | Undo and redo edits | **U7** | 9 |
| US-9.5 | Copy and paste nodes | **U7** | 9 |
| US-10.1 | Simulate run over mock graph | **U8** | 10 |
| US-VM.1 | Enter read-only view mode | **U8** | VM |
| US-VM.2 | Locked controls in view mode | **U8** | VM |
| US-VM.3 | Return to edit mode | **U8** | VM |

## Coverage Check
| Unit | Stories |
|---|---|
| U1 | US-1.1, US-1.2, US-1.3 |
| U2 | US-2.1–2.4, US-3.1–3.4 |
| U3 | US-4.1, US-4.2 |
| U4 | US-5.1, US-5.2, US-5.3 |
| U5 | US-6.1 |
| U6 | US-E7, US-E8 |
| U7 | US-9.1–9.5 |
| U8 | US-10.1, US-VM.1–3, US-6.2 |

- **Orphan stories**: None  
- **US-6.2 dual touch**: U5 delivers properties panel; U8 delivers view-mode non-editable behavior  

## First Construction Focus
**U1 stories only** for the first CONSTRUCTION loop.
