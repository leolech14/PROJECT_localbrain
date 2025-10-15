---
spec_id: IMPLEMENTATION_REPORT
title: Implementation Report (Batch 2)
version: 0.1.0
owner: Leo
status: draft
batch: 2
created: 2025-10-15
---

## Scope
Sniffers, caching, importers, tile source manager, realtime ingest, network rules, sample datasets, optional external tooling.

## Acceptance demos (for 'complete')
1. **Drop Party** — Drop: GeoJSON, GLB, COG, CSV, LAS → layers appear with correct defaults; UI remains responsive.
2. **Importer Proof** — Drop a Shapefile → worker converts to GeoJSON; progress UI; cancel works.
3. **Point Cloud** — Drop LAZ (small) → direct decode; LAZ (large) → background EPT/3D Tiles conversion; scene attaches when ready.
4. **Tiles** — Configure XYZ provider; fetch 4×4 tile grid; cache hit ratio > 0.6 on revisit; throttling respected.
5. **Realtime** — Connect to WebSocket; receive 10Hz updates; table + chart layer append smoothly (backpressure not exceeding memory cap).
6. **Network Rules** — Header injection and domain allowlist enforced; offline mode loads from cache gracefully.

## Perf gates (aligned with Batch 0)
- Drag-drop parse on 100MB CSV: first preview < 1.5s (worker), final layer commit < 4s.
- Shapefile (50MB) → GeoJSON conversion < 8s; UI thread long task p95 < 50ms.
- Tile throughput: sustain 40–80 tiles/s with p95 < 300ms on local network.

## Observability checks
- Events: `uv.io.sniff`, `uv.io.import.start|progress|end|cancel`, `uv.cache.hit|miss`, `uv.tiles.request|throttle`, `uv.rt.msg`.
- Metrics: IO latency p95, importer CPU time, cache size, hit rate, realtime queue depth.

## Risks & mitigations
- Huge files — chunked readers, sampling for preview, user-visible caps.
- Provider quotas — rate limiter + backoff + attribution requirements.