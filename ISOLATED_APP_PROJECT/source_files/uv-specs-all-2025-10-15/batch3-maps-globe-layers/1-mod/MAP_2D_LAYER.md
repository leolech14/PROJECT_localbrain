---
spec_id: MAP_2D_LAYER
title: Map 2D Layer
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
  events_namespace: uv.map.2d.layer
  metrics_prefix: uv.map.2d.layer
risks:
  - id: R-MAP_2D_LAYER-1
    desc: "Provider variance (styles, quotas, CORS)"
    mitigation: "Tile Source Manager + Network Rules; fallback providers and offline cache"
---

## Purpose
Provide a 2D map with imagery stacks and optional vector tiles, sharing the same Layer API.

## Data
- Imagery: XYZ/WMTS/WMS via Tile Source Manager.
- Vector tiles: MVT/PMTiles (mapped to vector symbology subset).

## Style
- Imagery: opacity, order, blend, color correction (brightness/contrast/gamma).
- Vectors: line/area symbolizers, color ramps by attribute, stroke/width, dash, labels (field/font/halo).
- Attribution: required credits rendered on HUD.

## Interactions
- Click/hover on vector layers (feature properties); imagery is non-pickable by default.
- Compare tools (swipe/spyglass) when two imagery layers are present.

## Transform
- 2D Mercator plane; CRS badge shows current projection; fits with reprojected inputs.

## Performance
- Tile prefetch within viewport + 1 ring; concurrency caps per host; GPU texture atlases for small overlays.

## Observability
- `uv.map.imagery.add|remove|reorder`, `uv.map.vector.tile.request|fail|throttle`

## Acceptance
- Reorder stack → visual change < 50 ms.
- Vector labels declutter visibly; collision artifacts under 2% on test scenes.
