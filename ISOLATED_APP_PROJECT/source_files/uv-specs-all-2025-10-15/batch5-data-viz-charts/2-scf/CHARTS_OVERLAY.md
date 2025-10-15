---
spec_id: CHARTS_OVERLAY
title: Charts Overlay (Layout, Legends, Export)
version: 0.1.0
owner: Leo
status: draft
batch: 5
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to prior batches resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Performance & memory budgets aligned to Batch 0
  i3:
    - Reference snapshots and golden plots attached
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.charts.overlay
  metrics_prefix: uv.charts.overlay
risks:
  - id: R-CHARTS_OVERLAY-1
    desc: Large table memory usage and cross-view selection cost
    mitigation: Columnar views, sampling, indexed joins, bitsets, and throttled events
category: 2-scf
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Manage one or more chart overlays, their layout, legends, and exports.

## Layout
- Dock positions: left/right/bottom; draggable & resizable; snap guides.
- Pin/unpin charts; grid layout for multiple charts (2×2, custom).

## Legends & axes
- Auto legends (color ramps, bin counts); axis ticks and labels; time formatting with locale.

## Export
- PNG snapshots with/without HUD; CSV/Parquet export of brushed/filtered rows.

## Accessibility
- Keyboard navigation; larger click targets; screen-reader labels on controls.

## Observability
- `uv.charts.overlay.add|remove|move|resize`, `uv.charts.export`

## Acceptance
- Drag/resize remains at 60 FPS; export PNG < 200 ms; CSV export writes 1M rows in < 3s (streaming).

## 1. Purpose & Outcomes
TBD


## 2. Context & Dependencies
TBD


## 3. Public API (Types & Contracts)
TBD


## 4. Data & State Model
TBD


## 5. Algorithms & Control Flow
TBD


## 6. UI & Controls (UCC/CCD)
TBD


## 7. Observability (Events & Metrics)
TBD


## 8. Performance Budget & Fallbacks
TBD


## 9. Security, Privacy & Permissions
TBD


## 10. Acceptance Demos & Test Plan
TBD


## 11. Implementation Recipe (Ingredients & Steps)
TBD


## 12. Integration Checklist & Promotion Gates
TBD
