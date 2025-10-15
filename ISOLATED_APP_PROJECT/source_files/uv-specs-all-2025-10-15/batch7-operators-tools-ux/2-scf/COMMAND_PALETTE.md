---
spec_id: COMMAND_PALETTE
title: Command Palette (⇧⌘P)
version: 0.1.0
owner: Leo
status: draft
batch: 7
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Reference UX flows & keyboard maps attached"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.command.palette
  metrics_prefix: uv.command.palette
risks:
  - id: R-COMMAND_PALETTE-1
    desc: "Inconsistent operator behavior across layer kinds"
    mitigation: "Single Operator model + conformance tests per kind"
---

## Purpose
Quickly invoke any operator or navigate to panels/settings via fuzzy search and keyboard.

## Features
- Fuzzy search over operators, panels, commands; shows hotkeys.
- Context-aware suggestions; recent items first; accessible via ⇧⌘P.
- Executes operator with default params or opens parameter sheet.

## Observability
- `uv.ui.command.opened|executed|failed`.

## Acceptance
- Open→type→execute under 300 ms; keyboard-only path for all common actions.
