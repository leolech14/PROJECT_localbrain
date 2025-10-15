---
spec_id: TRANSFORM_AND_CRS_SERVICE
title: Transform & CRS Service
version: 0.1.0
owner: Leo
status: draft
batch: 1
created: 2025-10-15T00:00:00.000Z
promotion_gates:
  i1:
    - Public interfaces stubbed; invariants documented
    - Events & metrics cataloged
  i2:
    - Worked example with sample data
    - Contract tests specified
  i3:
    - Performance and memory budgets verified on canonical scenes
    - Failure modes & UX errors defined
  complete:
    - Adopted with passing gates; docs and samples merged
observability:
  events_namespace: uv.transform.and.crs.service
  metrics_prefix: uv.transform.and.crs.service
risks:
  - id: R-TRANSFORM_AND_CRS_SERVICE-1
    desc: Interface drift vs. electron/web constraints
    mitigation: Lock TS types; IPC contracts with version keys
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Normalize coordinates/axes/units for the renderer and user expectations.

## Policy
- Geospatial layers default to WGS84 (EPSG:4326) with Cesium's ellipsoid.
- Non-geo meshes use local modelMatrix; user can georeference via anchors.
- Reprojection occurs **on import** (workers) using proj4; avoid per-frame transforms.

## Axis & Units
- Axis swizzle first-class: enum mapping on the TransformSpec.
- Units: linear (m/ft) and angular (deg/rad); displayed in UI & tooltips.

## Precision
- Large coordinates are recentred to avoid float precision loss (origin shift).

## Tests
- Load UTM shapefile → reprojection to WGS84 matches known control points.
- Axis swap XZY → gizmo and bounding box align accordingly.

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
