---
spec_id: MESH_LAYER
title: Mesh Layer (glTF/OBJ/PLY/STL)
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
  events_namespace: uv.mesh.layer
  metrics_prefix: uv.mesh.layer
risks:
  - id: R-MESH_LAYER-1
    desc: Huge datasets (tiles/point clouds) creating VRAM pressure
    mitigation: LOD/SSE, density controls, eviction, and HUD warnings
category: 1-mod
flavor: codegen
updated: '2025-10-15'
---

## Purpose
Load and render local mesh files (glTF/GLB preferred) with PBR materials and instancing.

## Data
- Formats: GLB/GLTF (Draco/meshopt), OBJ, PLY, STL. USD/USDZ optional (read-only).
- Draco/meshopt decoding in workers; textures streamed; KTX2 preferred when available.

## Style
- Material editor: baseColor, metallic, roughness, emissive, normal, occlusion.
- Render toggles: double-sided, cull mode, wireframe, alpha mode.

## Transform
- Axis swizzle (e.g., Z-up → Y-up); units (mm/cm/m → m); model matrix edits; align to ground.

## Interactions
- Pick returns `meshId/primitive/featureIndex` when available; bounding boxes and stats in Inspector.

## Performance
- Instancing for repeated meshes; bindless-like texture reuse where available; LOD (simplified proxies) optional via importer.

## Observability
- `uv.mesh.load.start|end|fail`, `uv.mesh.material.changed`, `uv.mesh.instancing.enabled`
- Metrics: triangles drawn, materials, textures, VRAM.

## Acceptance
- 1M tri GLB loads and is interactive; material edits re-render < 50 ms.

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
