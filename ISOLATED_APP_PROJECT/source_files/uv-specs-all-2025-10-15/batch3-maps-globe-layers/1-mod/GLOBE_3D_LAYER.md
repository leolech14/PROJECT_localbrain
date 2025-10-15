---
spec_id: GLOBE_3D_LAYER
title: Globe 3D Layer
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
  events_namespace: uv.globe.3d.layer
  metrics_prefix: uv.globe.3d.layer
risks:
  - id: R-GLOBE_3D_LAYER-1
    desc: "Provider variance (styles, quotas, CORS)"
    mitigation: "Tile Source Manager + Network Rules; fallback providers and offline cache"
---

## Purpose
Enable a 3D globe with terrain/imagery and geodesic camera behavior.

## Data
- Terrain (optional) + imagery layers from Tile Source Manager.
- 3D Tiles (buildings/trees) attach as separate layers but share camera & culling.

## Style
- Atmosphere toggles, lighting, shadows (if enabled), water/terrain exaggeration.
- Imagery same as 2D but composited on ellipsoid/terrain.

## Interactions
- Geodesic distances for measure; pick terrain heights; drill-pick 3D Tiles above terrain.

## Camera
- Ellipsoid-aware or terrain-following flights; horizon & fog for depth cues.

## Performance
- Screen-space error (SSE) for terrain & 3D Tiles; horizon culling; texture reuse.

## Observability
- `uv.globe.mode.enter|exit`, `uv.globe.terrain.enabled`, `uv.globe.sse.changed`

## Acceptance
- 2D↔3D switch retains selection/camera context within epsilon.
- Terrain SSE target keeps frame under budget in perf scenes.
