---
spec_id: LOGS_AND_PERF_PANEL
title: Logs & Perf Panel (Live Metrics & Warnings)
version: 0.1.0
owner: Leo
status: draft
batch: 8
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Golden artifacts and schema validators included"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.logs.and.perf.panel
  metrics_prefix: uv.logs.and.perf.panel
risks:
  - id: R-LOGS_AND_PERF_PANEL-1
    desc: "Schema drift or lossy exports"
    mitigation: "Schema versioning; validators; golden round-trip tests"
---

## Purpose
Provide a built-in console for structured events and performance metrics, tied to
the Observability Spec (Batch 0).

## Views
- **Events**: filter by namespace/severity; copy as JSON; pin queries.
- **Metrics**: frame time, draw calls, VRAM, IO latency, cache hit rate; mini charts.
- **Warnings**: provider quotas, CRS mismatches, memory guards, dropped frames.

## Features
- Correlation IDs; export logs to NDJSON; redaction toggle for file paths.
- Snapshot: capture last N seconds of metrics for bug reports.

## Observability
- `uv.panel.logs.opened|closed`, `uv.panel.logs.exported`, `uv.obs.sampling.changed`.

## Acceptance
- 5k events/minute remain navigable; metrics charts update at 2–4 Hz without jank.
