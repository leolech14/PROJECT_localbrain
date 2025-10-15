---
spec_id: TILES_3D_LAYER
title: 3D Tiles Layer
version: 0.1.0
owner: Leo
status: draft
batch: 4
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - Sections stubbed; cross-links to Batches 0–3 resolved
    - Interfaces, events, and examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Performance & memory budgets aligned to Batch 0
  i3:
    - Reference snapshots/test scenes attached; importer notes updated
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.tiles.3d.layer
  metrics_prefix: uv.tiles.3d.layer
risks:
  - id: R-TILES_3D_LAYER-1
    desc: Huge datasets (tiles/point clouds) creating VRAM pressure
    mitigation: LOD/SSE, density controls, eviction, and HUD warnings
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Stream and render **3D Tiles** datasets (buildings, terrain, point clouds) with screen-space error (SSE)
and picking. Conforms to the Layer API (prepare → commit → draw) and uses Tile Source Manager for auth/config.

## Data
- Tileset JSON: b3dm/i3dm/pnts; quantized-mesh terrain via globe.
- Optional per-feature properties (batch tables / feature tables) for picking & styling hooks.

## Style
- Per-tileset visibility, opacity; color overrides and attribute-based ramps when available.
- Lighting/shadows toggles (if enabled in renderer); fog/haze.

## Transform
- World-georeferenced; support local transforms and axis corrections for custom tilesets.

## Interactions
- Drill-pick returns `featureId`, batch properties, tileset/layer ids.
- Per-tileset SSE target; slider in UI for quality vs performance.

## Performance
- SSE adapts LOD; request throttling and priority by camera distance and motion.
- Cache-control integrated with global Cache & Storage namespace `tiles3d/`.

## Observability
- `uv.tiles3d.load.start|end|fail`, `uv.tiles3d.sse.changed`, `uv.tiles3d.tile.add|evict`
- Metrics: active tiles, visible tiles, request rate, average SSE, draw time.

## Acceptance
- Cold start to first geometry < 3s (remote); pick latency < 40 ms p95.

## 1. Purpose & Outcomes
TBD


## 2. Context & Dependencies
TBD


## 3. Public API (Types & Contracts)
TBD


## 4. Data & State Model
TBD


## 5. Algorithms & Control Flow
TBD


## 6. UI & Controls (UCC/CCD)
TBD


## 7. Observability (Events & Metrics)
TBD


## 8. Performance Budget & Fallbacks
TBD


## 9. Security, Privacy & Permissions
TBD


## 10. Acceptance Demos & Test Plan
TBD


## 11. Implementation Recipe (Ingredients & Steps)
TBD


## 12. Integration Checklist & Promotion Gates
TBD
