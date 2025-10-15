---
spec_id: CHART_2D_LAYER
title: Chart 2D Layer (Scatter/Line/Area/Histogram)
version: 0.1.0
owner: Leo
status: draft
batch: 5
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Reference snapshots and golden plots attached"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.chart.2d.layer
  metrics_prefix: uv.chart.2d.layer
risks:
  - id: R-CHART_2D_LAYER-1
    desc: "Large table memory usage and cross-view selection cost"
    mitigation: "Columnar views, sampling, indexed joins, bitsets, and throttled events"
---

## Purpose
Render 2D charts as HUD overlays (single DOM canvas per chart) with data-driven mapping
from table columns to visual channels. Support large datasets with binning and downsampling.

## Channels
- **Position**: X, Y (columns or expressions) with scales (linear/log/time).
- **Color/Size/Shape**: by attribute or constant; perceptual ramps.
- **Facets** (Phase 2): small multiples by categorical.

## Marks
- **Scatter** (million+ points) with WebGL path (preferred) or Canvas fallback.
- **Line/Area** with downsampling (**LTTB**) and decimation for performance.
- **Histogram**: fixed/bin-count; drag handles; cumulative option.

## Interactions
- Hover tooltips (throttled), brush select (rect/lasso), pan/zoom (wheel/drag), double-click to reset.
- Brushed set emits selection bitset; linked to map/3D via Link Brush Engine.

## Layout
- Docked overlay panels; resize/drag; axis/legend; export snapshot (PNG).

## Performance
- Use Screen-space binning for scatter heatmaps when density high.
- WebGL point sprite rendering with dynamic point size; batching by color ramp buckets.

## Observability
- `uv.chart.render.start|end`, `uv.chart.brush.start|update|end`, `uv.chart.export`

## Acceptance
- 1M scatter @ 60 FPS typical; histogram recompute < 120 ms; line LTTB over 1M samples < 300 ms.
