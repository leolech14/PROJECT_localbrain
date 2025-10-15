---
spec_id: LAYERS_PANEL
title: Layers Panel (Tree, Group, Solo/Lock)
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
  events_namespace: uv.layers.panel
  metrics_prefix: uv.layers.panel
risks:
  - id: R-LAYERS_PANEL-1
    desc: "Inconsistent operator behavior across layer kinds"
    mitigation: "Single Operator model + conformance tests per kind"
---

## Purpose
Manage the layer stack: add/remove/reorder, group, visibility/solo/lock, counts,
and quick actions, with performance on large scenes.

## Features
- Drag-drop reorder with auto-scroll; groups with collapse/expand.
- Solo/lock/mute; mini-sparklines for counts/LOD; error badges.
- Context menu: duplicate, export, convert, isolate, fit-to-layer.

## Performance
- Virtualized list; handle 1000+ layers without jank.

## Observability
- `uv.ui.layers.add|remove|reorder|group|solo|lock`.

## Acceptance
- Reordering 100 layers remains responsive; actions emit correct events.
