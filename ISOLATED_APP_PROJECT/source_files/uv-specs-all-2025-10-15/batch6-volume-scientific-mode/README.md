---
spec_id: README
title: README
version: 0.1.0
owner: Leo
status: draft
batch: '?'
category: 3-cfg
flavor: reference
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

# batch6-volume-scientific-mode — Volume & Scientific Mode

This batch brings **volumetric data** to the viewer. In the **main Cesium viewer**, we
support orthogonal **slices** and simple **isosurfaces** where feasible. For full 3D
ray-marched volumes and scientific algorithms, we add a **Scientific Mode** view powered
by **vtk.js**, linked to the same project, camera, and selections.

**Reading order**
1. `1-mod/VOLUME_LAYER.md`
2. `1-mod/SCIENTIFIC_MODE_BRIDGE.md`
3. `2-scf/SCIENTIFIC_MODE_WINDOW.md`
4. `3-cfg/SCIENTIFIC_MODE_LIMITS.md`

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
