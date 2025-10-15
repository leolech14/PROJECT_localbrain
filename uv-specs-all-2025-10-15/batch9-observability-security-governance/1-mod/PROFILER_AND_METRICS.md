---
spec_id: PROFILER_AND_METRICS
title: Profiler & Metrics
version: 0.1.0
owner: Leo
status: draft
batch: 9
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to Batches 0–8 resolved"
    - "Interfaces, events, and metrics named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Golden traces/snapshots attached; policy checklists completed"
    - "Observability wiring verified end-to-end"
  complete:
    - "All gates green; consistency checks passed; living links in INDEX"
observability:
  events_namespace: uv.profiler.and.metrics
  metrics_prefix: uv.profiler.and.metrics
risks:
  - id: R-PROFILER_AND_METRICS-1
    desc: "Excessive telemetry causing perf or privacy regressions"
    mitigation: "Sampling, redaction, consent; budgets enforced at compile-time"
---

## Purpose
Give developers and power users **trustworthy, low-overhead** telemetry with budgets and sampling
defined in Batch 0 **Observability Spec**.

## Architecture
- **Counters/gauges/histograms** with typed registry (frame time, draw calls, VRAM, tile latency).
- **Span/traces** for key operations (prepare/commit/draw; import; encode).
- **Ring buffers** for recent events; **sampling** default 1/10 for high-frequency (`uv.render.frame`).

## API (TS)
```ts
const m = metrics("uv.render");
m.gauge("frame_time_ms").set(value);
m.counter("draw_calls").add(n);
const span = tracer.begin("uv.io.fetch", {url, host});
span.end({status, bytes, ttfb_ms});
```

## Budgets
- Enforced compile-time constants for max series and sample rate.
- Per-subsystem toggles via Settings and feature flags.

## Export
- NDJSON snapshot; profiling bundle (trace + metrics) zipped; privacy redaction flags.

## Acceptance
- Sampling change reflects in ≤ 1s; exporting 60s of telemetry completes < 2s; overhead < 1 ms/frame p95.
