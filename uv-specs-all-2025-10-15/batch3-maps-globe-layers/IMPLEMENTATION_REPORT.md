---
spec_id: IMPLEMENTATION_REPORT
title: Implementation Report (Batch 3)
version: 0.1.0
owner: Leo
status: draft
batch: 3
created: 2025-10-15
---

## Scope
2D map, 3D globe, terrain, vector, raster layers + related UI panels.

## Acceptance demos (for 'complete')
1. **2D ↔ 3D Toggle** — Switch between 2D and 3D views; camera & selection preserved.
2. **Imagery Stack** — Add two imagery sources; reorder & adjust opacity; attribution visible.
3. **Vector Styling** — Load GeoJSON of cities; classify by population; labels declutter; legend updates.
4. **Raster Analysis** — Load a COG DEM; apply hillshade & slope; toggle contours; FPS within budget.
5. **Terrain + Buildings** — Enable terrain + add 3D Tiles city; pick building shows attributes; fly-over smooth.
6. **CRS & Fit** — Load projected GeoJSON; verify reprojection; fit-to-layer positions camera correctly.

## Perf gates
- Tile load p95 < 300 ms (local); warm cache stack apply < 50 ms.
- Vector 100k features: initial draw < 500 ms post-prepare; pan/zoom consistent.
- Raster COG 4096² tile: decode < 120 ms (worker) p95; hillshade GPU cost < 2 ms.

## Observability checks
- `uv.map.imagery.add|remove|reorder`, `uv.vector.style.changed`, `uv.raster.bandmap.changed`
- Metrics: tile requests, cache hit rate, draw time by layer kind, label count after declutter.

## Risks & mitigations
- Provider limits/CORS — use allowlist, API keys, and fallbacks.
- Label clutter — collision engine with buckets and priority; user can hide labels per zoom band.