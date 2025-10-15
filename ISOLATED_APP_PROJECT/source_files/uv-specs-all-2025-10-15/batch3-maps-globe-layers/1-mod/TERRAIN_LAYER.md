---
spec_id: TERRAIN_LAYER
title: Terrain Layer
version: 0.1.0
owner: Leo
status: draft
batch: 3
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - All sections stubbed; cross-links to prior batches resolved
    - Interfaces and events named; examples included
  i2:
    - Acceptance demos defined with measurable outcomes
    - Performance & memory budgets aligned to Batch 0
  i3:
    - Reference styling snapshots & test scenes attached
    - Observability events and metrics enumerated
  complete:
    - All gates green; consistency checks passed
observability:
  events_namespace: uv.terrain.layer
  metrics_prefix: uv.terrain.layer
risks:
  - id: R-TERRAIN_LAYER-1
    desc: Provider variance (styles, quotas, CORS)
    mitigation: Tile Source Manager + Network Rules; fallback providers and offline cache
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Render elevation as quantized-mesh or raster DEM with basic analysis overlays.

## Data
- Quantized-mesh (preferred) or DEM tiles; local DEM via importer → COG/tiles.
- Optionally contour vector overlay derived at import.

## Style
- Exaggeration, hillshade (azimuth, altitude), slope (degrees/percent), optional contours (interval/label).

## Interactions
- Probe tool sampling height/slope; profile along path (Phase 2).

## Performance
- GPU hillshade kernel budget < 2 ms/frame; slope overlay done in shader when possible.

## Observability
- `uv.terrain.enabled`, `uv.terrain.hillshade.changed`, `uv.terrain.slope.changed`

## Acceptance
- DEM 10m resolution region renders smoothly at mid-zoom; hillshade toggles under 50 ms.

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
