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

# batch4-geometry-tiles-pointcloud — 3D Geometry, 3D Tiles & Point Clouds

This batch brings **city-scale 3D** (3D Tiles), imported **meshes** (glTF/OBJ/PLY/STL),
and **point clouds** (LAS/LAZ/E57/EPT/3D Tiles pnts). It also ships the UI panels for
inspection (attributes/materials/metadata) and transforms (CRS, axis, units, align/snap).

**Reading order**
1. `1-mod/TILES_3D_LAYER.md`
2. `1-mod/MESH_LAYER.md`
3. `1-mod/POINT_CLOUD_LAYER.md`
4. `2-scf/INSPECTOR_PANEL.md`
5. `2-scf/TRANSFORM_PANEL.md`

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
