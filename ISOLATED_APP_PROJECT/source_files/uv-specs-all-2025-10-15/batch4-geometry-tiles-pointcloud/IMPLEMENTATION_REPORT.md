---
spec_id: IMPLEMENTATION_REPORT
title: Implementation Report (Batch 4)
version: 0.1.0
owner: Leo
status: draft
batch: 4
created: 2025-10-15
---

## Scope
3D Tiles (buildings/terrain/point clouds), Mesh import & materials, Point cloud rendering & LOD;
Inspector & Transform panels.

## Acceptance demos (for 'complete')
1. **City Walk** — Load a 3D Tiles city; navigate street-level; SSE keeps FPS above target; pick building shows attrs.
2. **Mesh Materials** — Load GLB with PBR; edit metal/rough/baseColor live; toggle wireframe; snapshot parity with reference.
3. **Point Density** — Load LAZ (medium); switch size modes (px/world/perspective); adjust density; attribute color ramp.
4. **Attribute Inspect** — Select model feature → Inspector shows metadata; copy to clipboard; search fields.
5. **Axis & Align** — Import OBJ with Z-up; axis swizzle to Y-up; align to ground; fit-to-layer correct.
6. **LOD Stress** — Move quickly through multi-tileset scene; no crashes; memory within 5% variance.

## Perf gates
- 3D Tiles SSE keeps frame ≤ 16.6 ms typical / ≤ 33 ms heavy (p95).
- Mesh material edit commit < 2 ms overhead; golden-image delta within tolerance.
- Point cloud 5–10M pts: interactive @ 30+ FPS (density controls); hover < 40 ms p95.

## Observability checks
- `uv.tiles3d.load|fail|sse.changed`, `uv.mesh.material.changed`, `uv.pc.density.changed`, `uv.pick.hit`
- Metrics: draw time by kind, active tiles, points drawn, VRAM, eviction rate.

## Risks & mitigations
- Mixed provider styles — normalize via style engine; document per-provider variances.
- Overdraw/haze — enable fog/haze; expose density/EDL controls in point clouds.