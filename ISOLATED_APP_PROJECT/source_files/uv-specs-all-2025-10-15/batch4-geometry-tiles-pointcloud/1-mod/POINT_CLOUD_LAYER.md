---
spec_id: POINT_CLOUD_LAYER
title: Point Cloud Layer (LAS/LAZ/E57/EPT/3D Tiles pnts)
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
  events_namespace: uv.point.cloud.layer
  metrics_prefix: uv.point.cloud.layer
risks:
  - id: R-POINT_CLOUD_LAYER-1
    desc: Huge datasets (tiles/point clouds) creating VRAM pressure
    mitigation: LOD/SSE, density controls, eviction, and HUD warnings
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Render large point clouds with attribute-driven styling and density controls, supporting both **native tiles**
(EPT/3D Tiles pnts) and **in-memory decoded LAS/LAZ** for smaller sets.

## Data
- **Native**: EPT or 3D Tiles pnts via importer/provider.
- **In-memory**: LAS/LAZ/E57 parsed in worker; quantize positions; optional downsample on import.

## Style
- Size mode: `fixed_px | world_meters | perspective`.
- Attribute → color (classification, intensity, RGB) with ramps; size mapping; opacity.
- EDL (eye-dome lighting) toggle; density limit per pixel.

## Transform
- CRS handling if georeferenced; axis swizzle; origin rebasing for precision.

## Interactions
- Hover/select with attribute popover; brush selection; density-aware picking (nearest-k).

## Performance
- Octree LOD; frustum culling; GPU instancing; indirect draws. Density clamps to keep frame budget.
- Streaming chunks integrated with Cache & Storage under `pointcloud/`.

## Observability
- `uv.pc.load.start|end|fail`, `uv.pc.density.changed`, `uv.pc.style.changed`
- Metrics: points in view, points drawn, LOD level, decode ms, VRAM.

## Acceptance
- 10M points navigable @ ≥ 30 FPS; color by classification/intensity works; EDL < 2 ms cost (if enabled).

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
