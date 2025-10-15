---
spec_id: README
title: README
version: 0.1.0
owner: Leo
status: draft
batch: '?'
category: 1-mod
flavor: codegen
created: '2025-10-15'
updated: '2025-10-15'
promotion_gates:
  i1:
    - Front matter valid against schema v2
    - All 12 sections present
  i2:
    - Unit and integration tests implemented and green
  i3:
    - GPU snapshot and perf gates pass on perf scenes
  complete:
    - Docs done; sample recipe added; release notes drafted
observability:
  events_namespace: uv.readme
  metrics_prefix: uv.readme
  event_list: []
---

# batch3-maps-globe-layers — Maps & Globe Layers

This batch delivers the **base of the canvas**: 2D maps, the 3D globe with terrain,
vector layers (GeoJSON/TopoJSON/MVT mapping), and rasters (COG/GeoTIFF), with UI style
panels and the map/globe window behavior.

**Reading order**
1. `1-mod/MAP_2D_LAYER.md`
2. `1-mod/GLOBE_3D_LAYER.md`
3. `1-mod/TERRAIN_LAYER.md`
4. `1-mod/VECTOR_LAYER.md`
5. `1-mod/RASTER_LAYER.md`
6. `2-scf/MAP_AND_GLOBE_WINDOW.md`
7. `2-scf/STYLE_PANEL.md`

See `IMPLEMENTATION_REPORT.md` for acceptance demos and promotion gates.

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
