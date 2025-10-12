---
type: Spec
status: Draft
module: UI
owner: Agent A (UI Velocity)
created: 2025-10-08
version: 0.1
depends_on: [LB-SPEC-011-ACP, Front-End-Module-Report]
---

# Summary
Define the LocalBrain UI shell: regions (TopBar, OmniSearch, LeftDock, MainGrid, RightInspector, BottomTray),
pane types (Browser, Files, Editor, Terminal, Chat), and AI-controllable **UI Intents** (open/close/focus/split/move/resize/snapshot).

# Functional Requirements
- **Layout model:** 12-col responsive grid; panes snap to (x,y,w,h); FLIP transitions for reorders/resizes. 
- **Pane types:** `browser`, `files`, `editor`, `terminal`, `chat`, `preview`. Each has standard actions.
- **Window ops:** `open`, `close`, `focus`, `split({direction})`, `move({x,y})`, `resize({w,h})`, `pin`, `unpin`, `snapshot`.
- **Focus contract:** Only one primary focus; shell emits `focusChanged(entityId)`.
- **Context menus:** Uniform menu model with safe actions & shortcuts. 
- **Sidebar modes:** `overlay | push`, width tokens. 
- **Animation:** motion tokens + FLIP for layout changes; reduced‑motion honoring OS setting.

# Non-Functional
- **Latency:** Intent→visible change ≤ 120 ms p95 (local prototype).
- **Accessibility:** Keyboard parity for every intent; APCA ≥ 60 for text tokens.
- **Persistence:** Per‑breakpoint layouts saved; versioned schema with migrations.

# Telemetry
- Events: `IntentReceived`, `IntentApplied`, `LayoutChanged`, `FocusChanged`.
- Fields: `intentId`, `agentId`, `entity`, `durationMs`, `result`.

# Security
- Only intents admitted through ACP (see LB‑SPEC‑011); kill‑switch honors `uiFrozen=true`.

# Definition of Done
- Storybook/Playwright demos: all intents exercised.
- Keyboard map doc; screen-reader checks on pane switching.
- Perf harness showing ≤120ms p95 for `open→paint`.