---
spec_id: IMPLEMENTATION_REPORT
title: Implementation Report (Batch 5)
version: 0.1.0
owner: Leo
status: draft
batch: 5
created: 2025-10-15T00:00:00.000Z
category: 3-cfg
flavor: reference
updated: '2025-10-15'
promotion_gates:
  i1:
    - Front matter valid against schema v2
    - All 12 sections present
  i2:
    - Unit and integration tests implemented and green
  i3:
    - GPU snapshot and perf gates pass on perf scenes
  complete:
    - Docs done; sample recipe added; release notes drafted
observability:
  events_namespace: uv.implementation.report
  metrics_prefix: uv.implementation.report
  event_list: []
---

## Scope
Arrow/Parquet/CSV ingestion, Chart2D layer (scatter/line/area/histogram), Link Brush Engine,
Data Panel (filters + channel mapping), Charts Overlay (layout, legends, export).

## Acceptance demos (for 'complete')
1. **Million-Point Scatter** — Load 1M rows (Arrow/Parquet); plot scatter with color/size by attribute; pan/zoom stays within frame budget.
2. **Histogram & Quantiles** — Create histogram of a column; drag bin edges; stats update; range filter applies to linked layers.
3. **Linked Brushing** — Brush scatter; map & 3D Tiles highlight matching features via shared keys; latency < 80 ms (p95).
4. **Expression Filters** — Apply SQL/expr filter (DuckDB-WASM) to reduce dataset; chart & map update; memory stays within cap.
5. **Snapshots & Export** — Export chart PNG; export filtered table to CSV/Parquet; view recipe captures chart state.

## Perf gates (aligned with Batch 0)
- 1M point scatter @ 60 FPS typical, ≥ 30 FPS under hover/brush (p95 frame ≤ 33 ms).
- 10M row table ingestion: schema in < 1s, first 100k preview in < 1.5s (worker).
- Brush propagation end-to-end < 80 ms (p95); selection bitset ops < 5 ms.

## Observability checks
- Events: `uv.table.ingest.*`, `uv.chart.render.*`, `uv.brush.start|update|end`, `uv.filter.apply`.
- Metrics: rows loaded, columns, memory MB, render ms, brush hitcount, join time.

## Risks & mitigations
- Wide tables — column pruning and lazy materialization.
- Expensive joins — preindex join keys, store row→feature maps, throttle updates.

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
