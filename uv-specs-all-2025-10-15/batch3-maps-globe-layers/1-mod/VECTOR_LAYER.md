---
spec_id: VECTOR_LAYER
title: Vector Layer (GeoJSON/TopoJSON/MVT mapping)
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
  events_namespace: uv.vector.layer
  metrics_prefix: uv.vector.layer
risks:
  - id: R-VECTOR_LAYER-1
    desc: "Provider variance (styles, quotas, CORS)"
    mitigation: "Tile Source Manager + Network Rules; fallback providers and offline cache"
---

## Purpose
Render vector features with symbolizers, classification, and labeling, from file or tile sources.

## Data
- Files: GeoJSON/TopoJSON/FlatGeobuf (native/importer), attributes preserved.
- Tiles: MVT/PMTiles (through map layer mapping to symbolizers).

## Style
- Points: shapes (circle/square/pin), size (px/m), fill/stroke, icons (sprite atlas).
- Lines: color, width, dash, caps/joins, arrows.
- Polygons: fill, stroke, hatching; outline rules; holes handling.
- Data-driven styling: attribute → color/size via ramps/class breaks/quantiles.
- Labels: field expression, font family/size, halo, priority, zoom-based rules.

## Label declutter
- Screen-space collision with buckets (point/line/area); priority + anchor; partial fade to avoid popping.

## Interactions
- Hover/select emits attributes; brush selection; spatial filter operators (buffer/clip) (Phase 2).

## Performance
- Geometry simplification by zoom; tile-based batching; instanced markers; text as SDF glyphs.

## Observability
- `uv.vector.style.changed`, `uv.vector.label.collision.stats`

## Acceptance
- 100k features styled & panned at interactive rates; label collisions < threshold on test scenes.
