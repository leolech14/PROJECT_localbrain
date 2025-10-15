---
spec_id: RASTER_LAYER
title: Raster Layer (COG/GeoTIFF)
version: 0.1.0
owner: Leo
status: draft
batch: 3
created: 2025-10-15
promotion_gates:
  i1:
    - "All sections stubbed; cross-links to prior batches resolved"
    - "Interfaces and events named; examples included"
  i2:
    - "Acceptance demos defined with measurable outcomes"
    - "Performance & memory budgets aligned to Batch 0"
  i3:
    - "Reference styling snapshots & test scenes attached"
    - "Observability events and metrics enumerated"
  complete:
    - "All gates green; consistency checks passed"
observability:
  events_namespace: uv.raster.layer
  metrics_prefix: uv.raster.layer
risks:
  - id: R-RASTER_LAYER-1
    desc: "Provider variance (styles, quotas, CORS)"
    mitigation: "Tile Source Manager + Network Rules; fallback providers and offline cache"
---

## Purpose
Display single/multi-band rasters, with colormaps and basic band math.

## Data
- COG/GeoTIFF with overviews; world-file images with georef sidecars; WMS as fallback.
- Band metadata: nodata, scale/offset, units; auto-detected.

## Style
- Band mapping (single, RGB, false-color); stretch (min/max, percentile, stddev).
- Colormaps (perceptual ramps); hillshade if DEM tagged; transparency by value.
- Resampling: nearest/bilinear/cubic; per-zoom caps.

## Interactions
- Pixel probe; histogram view; dynamic range suggestions from sampled tiles.

## Performance
- Decode in worker; transfer textures via ImageBitmap when possible; cache tiles aggressively.

## Observability
- `uv.raster.bandmap.changed`, `uv.raster.decode.ms`, `uv.raster.histogram.computed`

## Acceptance
- 4k tiles decode < 120 ms p95; histogram from sample tiles < 400 ms.
