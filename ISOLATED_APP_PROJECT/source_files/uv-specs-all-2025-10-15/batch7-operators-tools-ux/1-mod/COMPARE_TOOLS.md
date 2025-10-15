---
spec_id: COMPARE_TOOLS
title: Compare Tools (Swipe/Spyglass/Diff)
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
  events_namespace: uv.compare.tools
  metrics_prefix: uv.compare.tools
risks:
  - id: R-COMPARE_TOOLS-1
    desc: "Inconsistent operator behavior across layer kinds"
    mitigation: "Single Operator model + conformance tests per kind"
---

## Purpose
Visually compare two layers (usually rasters/imagery), with GPU-efficient masks
and minimal frame cost.

## Modes
- **Swipe**: vertical/horizontal divider draggable across viewport.
- **Spyglass**: circular reveal following cursor; size adjustable.
- **Diff**: shader-based per-pixel difference (abs/ratio); thresholds & color ramps.

## UX
- Toggle compare mode in Style panel or Operators panel; ESC exits compare mode.
- Persist last used compare settings per pair of layers.

## Performance
- Implement via stencil/mask passes to keep overhead low; avoid extra full-screen blits.

## Observability
- `uv.compare.mode.changed`, `uv.compare.params.changed`.

## Acceptance
- Swipe adds ≤ 2 ms GPU cost; spyglass ≤ 3 ms; diff within numeric tolerance on test images.
