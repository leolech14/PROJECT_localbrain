---
spec_id: WIDGET_SYSTEM
title: Widget System (Free Windows, Dashboard Layout)
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
  events_namespace: uv.widget.system
  metrics_prefix: uv.widget.system
risks:
  - id: R-WIDGET_SYSTEM-1
    desc: "Agent actions that surprise the user or violate policy"
    mitigation: "Dry-run, explicit confirmations, capability grants, undo-first policy"
---

## Purpose
Provide free-floating widgets (windows) that host panels, charts, minimaps, or custom plugin UIs.

## Behavior
- Create/close, drag, resize, snap, dock to sidebar; z-order with keyboard cycling.
- Adaptive layouts: widgets can switch compact/full modes; publish preferred sizes.
- Persistence: layout saved in `.uvscene.json` in `widgets[]` with positions/sizes/z.

## Types
- Core widgets: Style, Data, Inspector, Logs/Perf, Mini-Map, Chart, Console, Extensions.
- Plugin widgets: read-only panels with UI schema components (security constraints).

## Performance
- Virtualized widget tree; single compositor; opacity and transforms in GPU.

## Observability
- `uv.widget.create|focus|move|resize|dock|close`

## Acceptance
- 8 widgets interactively managed at ≥ 45 FPS; layout persists and restores exactly.
