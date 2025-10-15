---
spec_id: TILE_SOURCE_MANAGER
title: Tile Source Manager
version: 0.1.0
owner: Leo
status: draft
batch: 2
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to Batch 0/1 resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Reference importer notes/prototypes attached"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.tile.source.manager
  metrics_prefix: uv.tile.source.manager
risks:
  - id: R-TILE_SOURCE_MANAGER-1
    desc: "Large file handling and UI stalls"
    mitigation: "Workers, chunked IO, staged commits, cancellation"
---

## Purpose
Consistent fetch, cache, rate-limit, and header injection for XYZ/WMTS/WMS/MVT/PMTiles/MBTiles (and 3D tiles setup).

## Sources
- **XYZ/WMTS/WMS** (imagery/raster)
- **MVT/PMTiles** (vector tiles)
- **MBTiles** (local sqlite-backed tiles)
- **3D Tiles / quantized-mesh** (configuration & credentials)

## Templates & coords
- URL templates: `https://{s}.host/{z}/{x}/{y}.png`
- Subdomains cycling, retries with backoff, tms/xyz y-flip.

## Rate limiting
- Global and per-host concurrency; token bucket per host; 429/503 backoff.

## Headers & auth
- Per-source headers; query params; signed URL refresh hooks.

## API
```ts
addSource(id, config): SourceHandle
removeSource(id): void
getTile(id, z, x, y): Promise<Blob|ArrayBuffer>
stats(id): {...}
```

## Observability
- `uv.tiles.request|success|fail|throttle`, per-host metrics, cache hits.

## Acceptance
- 4×4 grid loads under 1s (warm cache); graceful backoff on quota errors.
