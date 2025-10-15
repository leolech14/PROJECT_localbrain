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

# Batch 1 — Core Runtime & Layer API (How to use)

This batch specifies the **single-renderer core**, the **Layer API**, the **depsgraph** for
incremental updates, and the **Electron app shell** + **panel layout**.

**Reading order**
1. `RENDER_CORE_ADAPTER.md`
2. `LAYER_API.md`
3. `SCENE_GRAPH_AND_DEPENDENCIES.md`
4. `MATERIAL_AND_STYLE_ENGINE.md`
5. `PICKING_AND_SELECTION.md`
6. `TRANSFORM_AND_CRS_SERVICE.md`
7. `CAMERA_AND_NAVIGATION.md`
8. `APP_SHELL_ELECTRON.md`
9. `PANEL_LAYOUT.md`

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
