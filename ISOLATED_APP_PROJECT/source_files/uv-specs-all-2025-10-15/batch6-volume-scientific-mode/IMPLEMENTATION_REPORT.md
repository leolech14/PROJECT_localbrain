---
spec_id: IMPLEMENTATION_REPORT
title: Implementation Report (Batch 6)
version: 0.1.0
owner: Leo
status: draft
batch: 6
created: 2025-10-15T00:00:00.000Z
category: 3-cfg
flavor: reference
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
  events_namespace: uv.implementation.report
  metrics_prefix: uv.implementation.report
  event_list: []
---

## Scope
Volume layer (slices/iso), Scientific Mode (vtk.js) with linked camera/selection, window controls, and limits/caps config.

## Acceptance demos (for 'complete')
1. **Ortho Slices** — Load a NIfTI (`.nii.gz`) 256×256×200; display axial/coronal/sagittal slices; move slice sliders; draw stays ≥ 45 FPS; probe reports voxel value with units.
2. **Isosurface Quick Look** — For a scalar field, enable single isovalue; marching-cubes in worker → glTF surface; edit iso slider; update < 800 ms on 128³.
3. **Switch to Scientific Mode** — Open vtk.js view of the same volume; enable volume ray-march; adjust transfer function; linked **selection** highlights voxels/slices in both views.
4. **Linked Camera** — Bookmark in main viewer → convert to vtk.js camera; round-trip preserves framing (ε thresholds specified).
5. **Export** — Save transfer-function preset; export slice PNG and iso-surface GLB; reopen project and presets reapply exactly.

## Perf gates
- Slice update UI→draw p95 < 50 ms (256²).
- Probe latency < 30 ms p95.
- Isosurface (128³) CPU pipeline < 800 ms; memory spike < 1.5× base.
- Scientific Mode volume render 256³ at ≥ 30 FPS with default sampling on target hardware.

## Observability checks
- Events: `uv.volume.slice.changed`, `uv.volume.iso.changed`, `uv.volume.probe`, `uv.scimode.open|close`, `uv.scimode.tf.changed`, `uv.scimode.render.ms`.
- Metrics: volume dimensions, bytes, sampling step, render time, probe rate, memory usage.

## Risks & mitigations
- Large volumes blow memory — enforce caps (see `3-cfg/SCIENTIFIC_MODE_LIMITS.md`), chunked Zarr/NetCDF readers, sampling previews.
- Depth interop between engines — we do **not** Z-buffer mix; views are separate; link state only.

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
