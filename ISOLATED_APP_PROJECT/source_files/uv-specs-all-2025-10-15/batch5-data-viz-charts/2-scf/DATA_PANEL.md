---
spec_id: DATA_PANEL
title: Data Panel (Filters, Mapping, Summary)
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
  events_namespace: uv.data.panel
  metrics_prefix: uv.data.panel
risks:
  - id: R-DATA_PANEL-1
    desc: "Large table memory usage and cross-view selection cost"
    mitigation: "Columnar views, sampling, indexed joins, bitsets, and throttled events"
---

## Purpose
Give users control over filters, mappings from columns to visual channels, and quick stats.

## Sections
- **Source**: table id, rows/cols, schema preview, memory usage.
- **Filters**: SQL/expr builder, saved filters, quick sliders from histogram ranges.
- **Mapping**: X/Y/Color/Size/Shape selectors; scale (linear/log/time); legend & bins.
- **Summary**: min/max/mean/quantiles; missing counts; sparkline for selected columns.
- **Joins**: optional link to external table; select join key.

## UX
- Schema-aware dropdowns; search columns; tag numeric/categorical/time.
- Presets per layer; undo/redo property edits; inline docs.

## Observability
- `uv.data.filter.apply`, `uv.data.mapping.changed`, `uv.data.summary.computed`

## Acceptance
- Changing a mapping re-renders chart in < 80 ms; filter apply on 1M rows < 250 ms (simple predicate).
