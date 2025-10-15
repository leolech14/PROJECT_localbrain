---
spec_id: SIDEBAR_AND_WIDGET_DOCK
title: Sidebar & Widget Dock (Taskbar analogue)
version: 0.1.0
owner: Leo
status: draft
batch: 13
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Prototype notes and golden flows attached"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.sidebar.and.widget.dock
  metrics_prefix: uv.sidebar.and.widget.dock
risks:
  - id: R-SIDEBAR_AND_WIDGET_DOCK-1
    desc: "Agent actions that surprise the user or violate policy"
    mitigation: "Dry-run, explicit confirmations, capability grants, undo-first policy"
---

## Purpose
Provide a persistent sidebar (taskbar analogue) for quick launch, pinned widgets, and status.

## Features
- Pinned widgets and recent tools; status pills (cache %, FPS, network mode).
- Dock region for minimizing widgets; hover to preview.
- Indicators: mic active, agent listening, recording on.

## Observability
- `uv.sidebar.pin|unpin`, `uv.sidebar.status.changed`
