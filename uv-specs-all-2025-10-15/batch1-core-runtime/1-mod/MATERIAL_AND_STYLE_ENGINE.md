---
spec_id: MATERIAL_AND_STYLE_ENGINE
title: Material & Style Engine
version: 0.1.0
owner: Leo
status: draft
batch: 1
created: 2025-10-15
promotion_gates:
  i1:
    - "Public interfaces stubbed; invariants documented"
    - "Events & metrics cataloged"
  i2:
    - "Worked example with sample data"
    - "Contract tests specified"
  i3:
    - "Performance and memory budgets verified on canonical scenes"
    - "Failure modes & UX errors defined"
  complete:
    - "Adopted with passing gates; docs and samples merged"
observability:
  events_namespace: uv.material.and.style.engine
  metrics_prefix: uv.material.and.style.engine
risks:
  - id: R-MATERIAL_AND_STYLE_ENGINE-1
    desc: "Interface drift vs. electron/web constraints"
    mitigation: "Lock TS types; IPC contracts with version keys"
---

## Purpose
Map StyleSpec → Cesium primitives/materials consistently.

## Common Style
- `opacity`, `blend`, `zOrder`, `visibility rules`.

## Kind Extensions
- **Vector**: symbol (shape), size (px/m), color (field/ramp), stroke, label rules.
- **Raster**: band mapping, colormap, stretch (min/max/percent), hillshade.
- **Mesh**: PBR (base/metal/rough/emissive/normal), double-sided, cull mode, wireframe.
- **PointCloud**: size mode (fixed/world/perspective), attribute → color/size, density, EDL.
- **Chart**: channels (X/Y/Color/Size/Shape), bins, smoothing.

## Implementation Notes
- Use Cesium MaterialProperty & Appearance for supported paths.
- For HUD charts, render to HTML canvas; z-order above 3D.
- Color ramps standardized (OKLCH-backed palettes).

## Tests
- Palette switch updates within 2 frames; alpha compositing matches reference.
